<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use App\Models\Concerns\PrunesOptionalJson;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * A blog post. `body` is a list of typed blocks (p, h2, list, quote, stats,
 * steps, image, callout) — the same shape the frontend renders.
 */
class Post extends Model
{
    use IsContent, PrunesOptionalJson;

    protected $fillable = [
        'slug',
        'title',
        'post_category_id',
        'author_id',
        'published_at',
        'read_time',
        'cover',
        'excerpt',
        'description',
        'tags',
        'featured',
        'body',
        'seo_title',
        'og_image',
        'is_published',
    ];

    protected $casts = [
        'published_at' => 'date',
        'read_time' => 'integer',
        'cover' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'body' => 'array',
        'is_published' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function approvedComments(): HasMany
    {
        return $this->comments()->where('is_approved', true)->oldest();
    }

    /** Posts have no manual order: newest first. */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
