<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->prefix('payment')->group(function () {
    // Stripe Payment Routes
    Route::post('/stripe/create-payment-intent', [PaymentController::class, 'createStripePaymentIntent']);
    Route::post('/stripe/success', [PaymentController::class, 'handleSuccessfulPayment']);

    // PayPal Payment Routes
    Route::post('/paypal', [PaymentController::class, 'paypalPayment']);
    Route::post('/paypal/success', [PaymentController::class, 'paypalSuccess']);
});
