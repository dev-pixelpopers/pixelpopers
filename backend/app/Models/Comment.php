<?php

namespace App\Models;

use App\Support\ContentCache;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

/**
 * A reader's comment on a post. New comments wait for approval in the admin.
 */
class Comment extends Model
{
    protected $fillable = [
        'post_id',
        'name',
        'email',
        'body',
        'tone',
        'display_when',
        'is_approved',
        'ip_address',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    protected static function booted(): void
    {
        // Approved comments are part of the cached post response.
        static::saved(fn () => ContentCache::bust());
        static::deleted(fn () => ContentCache::bust());
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
