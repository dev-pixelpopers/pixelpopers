<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing
|--------------------------------------------------------------------------
| The browser calls the API directly for the website's forms, so the website's
| origin must be allowed. FRONTEND_URL is always allowed; add preview or extra
| domains to CORS_ALLOWED_ORIGINS (comma-separated). Server-side fetches from
| Next.js aren't subject to CORS.
*/

$fromEnv = array_filter(array_map('trim', explode(',', (string) env(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000'
))));

$frontend = rtrim((string) env('FRONTEND_URL', ''), '/');

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    'allowed_origins' => array_values(array_unique(array_filter([...$fromEnv, $frontend]))),

    // Vercel preview deployments, e.g. https://pixelpopers-git-feature-x.vercel.app
    'allowed_origins_patterns' => array_filter([env('CORS_ALLOWED_ORIGIN_PATTERN', '#^https://pixelpopers(-[a-z0-9-]+)?\.vercel\.app$#')]),

    'allowed_headers' => ['Content-Type', 'Accept', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,
];
