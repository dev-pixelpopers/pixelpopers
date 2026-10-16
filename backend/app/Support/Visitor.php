<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Http\Request;

/**
 * Who actually sent a form. The website forwards every submission from its
 * own server, so `$request->ip()` is the website's address for all visitors —
 * which would make every visitor share one spam limit. The website therefore
 * passes the visitor's address in `X-Visitor-Ip`, signed with the shared
 * secret (Site settings → Revalidation → Shared secret, the website's
 * REVALIDATE_SECRET) in `X-Site-Key`. Without a matching key the header is
 * ignored, so nobody else can pick an address to dodge the limit.
 */
class Visitor
{
    public static function ip(Request $request): ?string
    {
        $secret = (string) Setting::get('frontend_revalidate_secret', '');
        $key = $request->header('X-Site-Key');
        $forwarded = $request->header('X-Visitor-Ip');

        if ($secret !== '' && is_string($key) && hash_equals($secret, $key)
            && is_string($forwarded) && filter_var($forwarded, FILTER_VALIDATE_IP)) {
            return $forwarded;
        }

        return $request->ip();
    }
}
