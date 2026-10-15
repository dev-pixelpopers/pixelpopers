<?php

namespace App\Models\Concerns;

use App\Support\ContentCache;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shared by every model the public API serves: published/ordered scopes, and
 * dropping the API cache (see ContentCache) whenever a record changes.
 */
trait IsContent
{
    public static function bootIsContent(): void
    {
        static::saved(fn () => ContentCache::bust());
        static::deleted(fn () => ContentCache::bust());
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where($this->getTable().'.is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy($this->getTable().'.sort_order')->orderBy($this->getTable().'.id');
    }
}
