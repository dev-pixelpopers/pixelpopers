<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * A blog category (Branding, UI/UX, …) and the brand tone its tags use.
 */
class PostCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'tone',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function scopeOrdered(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
