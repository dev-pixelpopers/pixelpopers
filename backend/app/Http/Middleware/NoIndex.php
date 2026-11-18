<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * admin.pixelpopers.com is the CMS, not the website: nothing it serves (the
 * admin, its login page, the API) may appear in search results. Uploaded
 * files are covered by the same header in public/.htaccess, since Apache
 * serves them without Laravel.
 */
class NoIndex
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');

        return $response;
    }
}
