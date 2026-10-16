<?php

namespace App\Models;

use App\Support\ContentCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Site-wide key/value settings (SEO defaults, company details, social links,
 * analytics, SMTP, frontend revalidation), edited on Site Settings.
 * Values are stored JSON-encoded so arrays and numbers survive the round trip.
 */
class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    private const CACHE_KEY = 'settings:all';

    /** Keys the public API may expose (everything else — SMTP, secrets — stays private). */
    public const PUBLIC_KEYS = [
        'site_name', 'site_title', 'site_description', 'site_keywords', 'site_url', 'default_og_image',
        'company_email', 'company_phone', 'company_address', 'company_hours',
        'social_instagram', 'social_behance', 'social_linkedin', 'social_dribbble', 'social_x', 'social_facebook',
        'google_analytics_id', 'google_tag_manager_id', 'meta_pixel_id',
        'footer_tagline', 'availability_label',
        // Visitor greetings (Site settings → Greetings).
        'greeting_gif', 'thumbs_gif', 'greeting_gif_home', 'greeting_gif_work', 'greeting_gif_case_study', 'greeting_gif_services', 'greeting_gif_service', 'greeting_gif_about', 'greeting_gif_blog', 'greeting_gif_post', 'greeting_gif_contact',
    ];

    protected static function booted(): void
    {
        $flush = function () {
            Cache::forget(self::CACHE_KEY);
            ContentCache::bust();
        };
        static::saved($flush);
        static::deleted($flush);
    }

    /** @return array<string, mixed> */
    public static function all_values(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => static::query()
            ->pluck('value', 'key')
            ->map(fn ($value) => self::decode($value))
            ->all());
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = self::all_values()[$key] ?? null;

        return $value === null || $value === '' ? $default : $value;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => json_encode($value)]);
    }

    /** @return array<string, mixed> */
    public static function publicValues(): array
    {
        $all = self::all_values();

        return collect(self::PUBLIC_KEYS)->mapWithKeys(fn ($key) => [$key => $all[$key] ?? null])->all();
    }

    private static function decode(?string $value): mixed
    {
        if ($value === null) {
            return null;
        }
        $decoded = json_decode($value, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }
}
