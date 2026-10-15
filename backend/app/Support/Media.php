<?php

namespace App\Support;

/**
 * Media paths in the CMS are either files that ship with the website
 * ("/assets/…", served by the Next.js app) or absolute URLs (uploads to this
 * server, or anywhere else). This resolves a path to something a browser can
 * load from the admin panel: site-relative paths are prefixed with
 * FRONTEND_URL.
 */
class Media
{
    public static function absolute(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }
        if (preg_match('#^(https?:)?//#i', $path) || str_starts_with($path, 'data:')) {
            return $path;
        }

        return rtrim((string) config('app.frontend_url'), '/').'/'.ltrim($path, '/');
    }
}
