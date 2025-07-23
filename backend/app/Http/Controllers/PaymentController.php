<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Stripe\Stripe;
use Stripe\PaymentIntent;

use PayPal\Api\Amount;
use PayPal\Api\Payer;
use PayPal\Api\Payment as PayPalPayment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Payment;

class PaymentController extends Controller
{
    private $paypalApiContext;

    public function __construct()
    {
        // Setup PayPal API context
        $paypalConfig = config('services.paypal');
        $this->paypalApiContext = new ApiContext(
            new OAuthTokenCredential(
                $paypalConfig['client_id'],
                $paypalConfig['secret']
            )
        );
        $this->paypalApiContext->setConfig($paypalConfig['settings']);
    }

    public function createStripePaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:50',
            'plan_id' => 'required|exists:plan,plan_id',
        ]);

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $intent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => 'usd',
                'metadata' => [
                    'plan_id' => $request->plan_id,
                    'user_id' => auth()->id(), // Assuming user is authenticated
                ],
            ]);

            return response()->json(['clientSecret' => $intent->client_secret]);
        } catch (\Exception $e) {
            Log::error('Stripe Payment Intent Creation Failed: ' . $e->getMessage());
            return response()->json(['error' => 'Could not initiate payment.'], 500);
        }
    }

    public function handleSuccessfulPayment(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            Stripe::setApiKey(config('services.stripe.secret'));
            $intent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($intent->status !== 'succeeded') {
                return response()->json(['error' => 'Payment not successful.'], 400);
            }

            $plan = Plan::find($intent->metadata->plan_id);
            $user = auth()->user(); // You must ensure the user is authenticated

            if (!$user || !$plan) {
                return response()->json(['error' => 'User or Plan not found.'], 404);
            }

            // Create Subscription
            $subscription = Subscription::create([
                'subscription_id' => Str::uuid(),
                'business_id' => $user->business_id,
                'plan_id' => $plan->plan_id,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addMonths($plan->duration),
                'status' => 'active',
                'auto_renewal' => true,
            ]);

            // Create Payment Record
            Payment::create([
                'payment_id' => Str::uuid(),
                'subscription_id' => $subscription->subscription_id,
                'amount' => $intent->amount / 100,
                'transaction_id' => $intent->id,
                'payment_method' => 'stripe',
                'payment_date' => Carbon::now(),
                'status' => 'completed',
                'stripe_payment_intent_id' => $intent->id,
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Payment successful and subscription activated.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Stripe Success Handling Failed: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing your payment.'], 500);
        }
    }

    public function paypalPayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plan,plan_id',
        ]);

        $plan = Plan::find($request->plan_id);

        $payer = new Payer();
        $payer->setPaymentMethod('paypal');

        $amount = new Amount();
        $amount->setCurrency('USD')->setTotal($plan->price);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setDescription($plan->name . ' Subscription')
            ->setInvoiceNumber(uniqid());

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl(config('app.frontend_url') . '/payment/paypal/success')
            ->setCancelUrl(config('app.frontend_url') . '/payment/paypal/cancel');

        $payment = new PayPalPayment();
        $payment->setIntent('sale')
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions([$transaction]);

        try {
            $payment->create($this->paypalApiContext);
            return response()->json(['id' => $payment->getId()]);
        } catch (\Exception $e) {
            Log::error('PayPal Payment Creation Failed: ' . $e->getMessage());
            return response()->json(['error' => 'Could not initiate PayPal payment.'], 500);
        }
    }

    public function paypalSuccess(Request $request)
    {
        $request->validate([
            'paymentId' => 'required|string',
            'PayerID' => 'required|string',
            'plan_id' => 'required|exists:plan,plan_id',
        ]);

        DB::beginTransaction();
        try {
            $payment = PayPalPayment::get($request->paymentId, $this->paypalApiContext);
            $execution = new PaymentExecution();
            $execution->setPayerId($request->PayerID);

            $result = $payment->execute($execution, $this->paypalApiContext);

            if ($result->getState() !== 'approved') {
                return response()->json(['error' => 'PayPal payment not approved.'], 400);
            }

            $plan = Plan::find($request->plan_id);
            $user = auth()->user();

            if (!$user || !$plan) {
                return response()->json(['error' => 'User or Plan not found.'], 404);
            }

            $transaction = $result->getTransactions()[0];

            // Create Subscription
            $subscription = Subscription::create([
                'subscription_id' => Str::uuid(),
                'business_id' => $user->business_id,
                'plan_id' => $plan->plan_id,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addMonths($plan->duration),
                'status' => 'active',
                'auto_renewal' => true,
            ]);

            // Create Payment Record
            Payment::create([
                'payment_id' => Str::uuid(),
                'subscription_id' => $subscription->subscription_id,
                'amount' => $transaction->getAmount()->getTotal(),
                'transaction_id' => $result->getId(),
                'payment_method' => 'paypal',
                'payment_date' => Carbon::now(),
                'status' => 'completed',
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'PayPal payment successful and subscription activated.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('PayPal Success Handling Failed: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing your PayPal payment.'], 500);
        }
    }
}

