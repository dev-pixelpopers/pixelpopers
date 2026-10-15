<?php

namespace App\Support;

use App\Models\Setting;
use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Caches public API responses and drops them all whenever content changes.
 *
 * Every cached response key carries a version number; bumping the version
 * (on any content save or delete) makes every old entry unreachable at once,
 * which works on every cache store — no tags needed.
 *
 * After a bump it also pings the frontend's on-demand revalidation endpoint,
 * when one is configured under Site Settings → Frontend, so the Next.js site
 * re-renders with the new content instead of waiting for its cache to expire.
 */
class ContentCache
{
    private const VERSION_KEY = 'content-cache-version';

    private const TTL_SECONDS = 3600;

    private static bool $revalidateQueued = false;

    public static function remember(string $key, Closure $callback): mixed
    {
        return Cache::remember(self::key($key), self::TTL_SECONDS, $callback);
    }

    public static function bust(): void
    {
        Cache::forever(self::VERSION_KEY, self::version() + 1);

        // Several models can change in one request (a save plus its sections):
        // ping the frontend once, after the response is sent.
        if (! self::$revalidateQueued) {
            self::$revalidateQueued = true;
            app()->terminating(fn () => self::revalidateFrontend());
        }
    }

    private static function key(string $key): string
    {
        return 'api:v'.self::version().':'.$key;
    }

    private static function version(): int
    {
        return (int) Cache::get(self::VERSION_KEY, 1);
    }

    private static function revalidateFrontend(): void
    {
        self::$revalidateQueued = false;
        $url = (string) Setting::get('frontend_revalidate_url', '');
        $secret = (string) Setting::get('frontend_revalidate_secret', '');

        if ($url === '' || $secret === '') {
            return;
        }

        try {
            Http::timeout(5)->withHeaders(['x-revalidate-secret' => $secret])->post($url, ['tag' => 'cms']);
        } catch (Throwable $exception) {
            Log::warning('Frontend revalidation failed.', ['error' => $exception->getMessage()]);
        }
    }
}
