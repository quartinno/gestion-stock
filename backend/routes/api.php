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

use App\Http\Controllers\AuthController;

// Public authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::prefix('payment')->group(function () {
        // Stripe Payment Routes
        Route::post('/stripe/create-payment-intent', [PaymentController::class, 'createStripePaymentIntent']);
        Route::post('/stripe/success', [PaymentController::class, 'handleSuccessfulPayment']);

        // PayPal Payment Routes
        Route::post('/paypal/create-order', [PaymentController::class, 'createPayPalOrder']);
        Route::post('/paypal/capture-order', [PaymentController::class, 'capturePayPalOrder']);
    });
});
