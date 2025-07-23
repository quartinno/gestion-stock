<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Stripe\Stripe as StripeSDK;

class StripeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Set the Stripe API key
        StripeSDK::setApiKey(config('services.stripe.secret'));
        
        // Set the API version for consistency
        StripeSDK::setApiVersion('2023-10-16');
    }
}
