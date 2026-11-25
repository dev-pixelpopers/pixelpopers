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
        'is_custom',
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
        'is_custom' => 'boolean',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        // Menu links to a page follow it when its address changes, and go when it's deleted.
        static::updated(function (Page $page) {
            if ($page->wasChanged('slug')) {
                \App\Support\Navigation::renamePage((string) $page->getOriginal('slug'), $page->slug);
            }
        });
        static::deleted(fn (Page $page) => \App\Support\Navigation::forgetPage($page->slug));
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }
}
