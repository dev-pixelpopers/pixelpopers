<?php

use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\FormController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API for the Next.js website
|--------------------------------------------------------------------------
| Read endpoints return { data: ... } in the website's own shapes (see
| App\Http\Resources\Transformers). Form endpoints are rate-limited per IP.
*/

Route::prefix('v1')->group(function () {
    Route::get('/site', [ContentController::class, 'site']);
    Route::get('/sitemap', [ContentController::class, 'sitemap']);

    Route::get('/pages', [ContentController::class, 'pages']);
    Route::get('/pages/{slug}', [ContentController::class, 'page']);

    Route::get('/services', [ContentController::class, 'services']);
    Route::get('/services/{slug}', [ContentController::class, 'service']);

    Route::get('/projects', [ContentController::class, 'projects']);
    Route::get('/projects/{slug}', [ContentController::class, 'project']);

    Route::get('/showreel', [ContentController::class, 'showreel']);
    Route::get('/clients', [ContentController::class, 'clients']);
    Route::get('/team', [ContentController::class, 'team']);
    Route::get('/testimonials', [ContentController::class, 'testimonials']);

    Route::get('/post-categories', [ContentController::class, 'categories']);
    Route::get('/posts', [ContentController::class, 'posts']);
    Route::get('/posts/{slug}', [ContentController::class, 'post']);

    Route::middleware('throttle:forms')->group(function () {
        Route::post('/contact', [FormController::class, 'contact']);
        Route::post('/newsletter', [FormController::class, 'newsletter']);
        Route::post('/posts/{slug}/comments', [FormController::class, 'comment']);
    });
});
