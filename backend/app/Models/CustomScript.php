<?php

namespace App\Models;

use App\Support\ContentCache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A code snippet the website adds to its pages (SEO → Scripts): on every
 * page (`target` "*") or on one page (its path), in the <head> or at the
 * end of the <body>.
 */
class CustomScript extends Model
{
    public const EVERY_PAGE = '*';

    public const LOCATIONS = [
        'head' => 'Inside <head>',
        'body' => 'End of <body>',
    ];

    protected $fillable = ['name', 'target', 'location', 'code', 'is_active', 'sort_order'];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (CustomScript $script) {
            $script->target = self::normaliseTarget($script->target);
        });
        static::saved(fn () => ContentCache::bust());
        static::deleted(fn () => ContentCache::bust());
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public static function normaliseTarget(?string $value): string
    {
        $value = trim((string) $value);
        if ($value === '' || $value === self::EVERY_PAGE) {
            return self::EVERY_PAGE;
        }

        return Redirect::normalisePath($value);
    }
}
