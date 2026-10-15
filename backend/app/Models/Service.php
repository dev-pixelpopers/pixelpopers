<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use App\Models\Concerns\PrunesOptionalJson;
use Illuminate\Database\Eloquent\Model;

/**
 * A service: its detail page (/services/{slug}) and its giant-letter tile on
 * the home page (`tile`).
 */
class Service extends Model
{
    use IsContent, PrunesOptionalJson;

    protected $fillable = [
        'slug',
        'name',
        'accent',
        'hero_lines',
        'hero_intro',
        'hero_cta',
        'meta_title',
        'meta_description',
        'overview',
        'included',
        'process',
        'audience',
        'insights',
        'why_us',
        'tools',
        'stats',
        'packages',
        'faqs',
        'cta_heading',
        'cta_button',
        'tile',
        'visibility',
        'og_image',
        'is_published',
        'sort_order',
    ];

    /** Sections of the service page that can be switched off, in page order. */
    public const SECTIONS = [
        'overview' => 'Overview',
        'included' => 'What’s included',
        'process' => 'Process steps',
        'audience' => 'Who it’s for',
        'insights' => 'Short guide',
        'why_us' => 'Why us',
        'packages' => 'Packages',
        'faqs' => 'FAQs',
        'more' => 'More services',
        'cta' => 'Closing call to action',
    ];

    /** @return list<string> keys of the sections switched off */
    public function hiddenSections(): array
    {
        return array_keys(array_filter($this->visibility ?? [], fn ($shown) => $shown === false));
    }

    protected $casts = [
        'hero_lines' => 'array',
        'overview' => 'array',
        'included' => 'array',
        'process' => 'array',
        'audience' => 'array',
        'insights' => 'array',
        'why_us' => 'array',
        'tools' => 'array',
        'stats' => 'array',
        'packages' => 'array',
        'faqs' => 'array',
        'tile' => 'array',
        'visibility' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
