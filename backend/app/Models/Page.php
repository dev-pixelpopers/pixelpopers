<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * A site page (home, about, services, work, contact, blog): its SEO fields,
 * plus the copy for each of its sections in PageSection.
 */
class Page extends Model
{
    use IsContent;

    protected $fillable = [
        'slug',
        'title',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'og_image',
        'robots',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }
}
