<?php

return [
    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie', 
        'login', 
        'logout', 
        'register',
        'payment/*',
        'stripe/*',
        'paypal/*'
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://www.sandbox.paypal.com',
        'https://www.paypal.com'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'X-CSRF-TOKEN',
        'Authorization',
        'Accept',
        'X-XSRF-TOKEN',
        'X-Socket-Id',
        'X-Pusher-*',
        'X-CSRF-*',
        'X-*',
        '*'
    ],
    'exposed_headers' => [
        'X-Socket-Id',
        'X-XSRF-TOKEN',
        'X-CSRF-TOKEN'
    ],
    'max_age' => 60 * 60 * 24, // 24 hours
    'supports_credentials' => true,
];