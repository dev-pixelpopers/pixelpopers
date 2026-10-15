<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * A founder / team member: the home page's leadership cards, and blog authors.
 */
class TeamMember extends Model
{
    use IsContent;

    protected $fillable = [
        'name',
        'role',
        'avatar',
        'accent',
        'rotate',
        'bio_short',
        'bio_long',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'rotate' => 'float',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }
}
