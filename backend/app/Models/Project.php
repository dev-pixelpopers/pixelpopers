<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use App\Models\Concerns\PrunesOptionalJson;
use Illuminate\Database\Eloquent\Model;

/**
 * A case study: a card on /work and its own /work/{slug} page.
 */
class Project extends Model
{
    use IsContent, PrunesOptionalJson;

    protected $fillable = [
        'slug',
        'name',
        'client',
        'year',
        'month',
        'tagline',
        'discipline',
        'accent',
        'description',
        'featured',
        'timeline',
        'sticker',
        'cover',
        'cover_bg',
        'services',
        'categories',
        'intro',
        'brand',
        'results',
        'quote',
        'story',
        'gallery',
        'gallery_heading',
        'delivered',
        'phases',
        'team',
        'seo_title',
        'seo_description',
        'og_image',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'featured' => 'boolean',
        'cover' => 'array',
        'services' => 'array',
        'categories' => 'array',
        'intro' => 'array',
        'brand' => 'array',
        'results' => 'array',
        'quote' => 'array',
        'story' => 'array',
        'gallery' => 'array',
        'delivered' => 'array',
        'phases' => 'array',
        'team' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
