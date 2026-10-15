<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use App\Models\Concerns\PrunesOptionalJson;
use Illuminate\Database\Eloquent\Model;

/**
 * A clip in the home page's video carousel (and the Studio cube it folds into).
 */
class ShowreelItem extends Model
{
    use IsContent, PrunesOptionalJson;

    protected $fillable = [
        'slug',
        'title',
        'video',
        'poster',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'poster' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
