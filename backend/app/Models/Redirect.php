<?php

namespace App\Models;

use App\Support\ContentCache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A website redirect (SEO → Redirects). `from_path` is stored normalised —
 * a leading slash, no domain, no trailing slash, lower case — so "/Old-Page/",
 * "old-page" and "https://www.pixelpopers.com/old-page" are all the same rule.
 * A path ending in "/*" matches everything under it.
 */
class Redirect extends Model
{
    /** HTTP status → what it means, for the admin. */
    public const STATUSES = [
        301 => '301 · Moved permanently (best for SEO)',
        302 => '302 · Temporary',
        410 => '410 · Gone (page never coming back)',
    ];

    protected $fillable = ['from_path', 'to_url', 'status_code', 'is_active', 'notes'];

    protected $casts = [
        'status_code' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Redirect $redirect) {
            $redirect->from_path = self::normalisePath($redirect->from_path);
            $redirect->to_url = $redirect->status_code === 410 ? null : self::normaliseTarget($redirect->to_url);
        });
        static::saved(fn () => ContentCache::bust());
        static::deleted(fn () => ContentCache::bust());
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function isWildcard(): bool
    {
        return str_ends_with($this->from_path, '/*');
    }

    /** "https://www.pixelpopers.com/Old-Page/?x=1" → "/old-page". Keeps a trailing "/*". */
    public static function normalisePath(?string $value): string
    {
        $value = trim((string) $value);
        if (preg_match('#^https?://#i', $value)) {
            $value = (string) (parse_url($value, PHP_URL_PATH) ?? '/');
        }
        $value = preg_replace('/[?#].*$/', '', $value) ?? '';
        $wildcard = str_ends_with($value, '*');
        $value = rtrim(rtrim($value, '*'), '/');
        $value = '/'.ltrim(rawurldecode($value), '/');
        $value = mb_strtolower($value);

        return $wildcard ? rtrim($value, '/').'/*' : $value;
    }

    /** A site path ("services" → "/services") or a full URL, as typed. */
    public static function normaliseTarget(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }
        if (preg_match('#^https?://#i', $value)) {
            return $value;
        }

        return '/'.ltrim($value, '/');
    }

    /**
     * Parses a pasted list for the "Add many" action: one redirect per line,
     * "from  to  [status]" separated by spaces, tabs or commas (CSV works).
     * A line with only a path (or "410") is marked gone.
     *
     * @return array{rows: list<array{from_path: string, to_url: ?string, status_code: int}>, skipped: list<string>}
     */
    public static function parseList(string $text): array
    {
        $rows = [];
        $skipped = [];
        foreach (preg_split('/\R/', $text) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            $parts = array_values(array_filter(preg_split('/[\s,;]+/', $line) ?: [], fn ($p) => $p !== ''));
            $from = $parts[0] ?? '';
            if (count($parts) === 1) {
                [$to, $status] = [null, 410];
            } elseif (preg_match('/^\d{3}$/', $parts[1])) {
                [$to, $status] = [null, (int) $parts[1]];
            } else {
                [$to, $status] = [$parts[1], (int) ($parts[2] ?? 301)];
            }
            if (! array_key_exists($status, self::STATUSES) || ($status !== 410 && $to === null) || in_array(mb_strtolower($from), ['from', 'source', 'old'], true)) {
                $skipped[] = $line;

                continue;
            }
            $rows[] = ['from_path' => self::normalisePath($from), 'to_url' => $status === 410 ? null : self::normaliseTarget($to), 'status_code' => $status];
        }

        return ['rows' => $rows, 'skipped' => $skipped];
    }
}
