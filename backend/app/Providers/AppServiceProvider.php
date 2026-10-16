<?php

namespace App\Providers;

use App\Support\Visitor;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // The website's forms: generous for people, useless for spam bursts.
        RateLimiter::for('forms', fn (Request $request) => [
            // Keyed by the real visitor, not the website's server (see Visitor).
            Limit::perMinute(5)->by(Visitor::ip($request)),
            Limit::perDay(50)->by(Visitor::ip($request)),
        ]);
    }
}
