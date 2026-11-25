<?php

namespace App\Support;

use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Support\Str;

/**
 * The sections a page built in the CMS can be made of: every section of the
 * site's own pages that works on its own. The website renders each with its
 * original design (src/components/custom/Blocks.tsx keeps the same list).
 *
 * A new page's section starts as a copy of an existing one — from a built-in
 * page or from another custom page — with its own editable copy afterwards.
 */
class SectionLibrary
{
    public const TYPES = [
        'about:hero' => 'About → Hero',
        'about:story' => 'About → Our story',
        'about:full_story' => 'About → Full story',
        'about:values' => 'About → Values',
        'about:how_we_work' => 'About → How we work',
        'about:audience' => 'About → Who we work with',
        'about:journey' => 'About → Journey',
        'about:testimonials' => 'About → Testimonials',
        'about:perks' => 'About → Perks',
        'about:hiring' => 'About → We’re hiring',
        'about:cta' => 'About → Closing call to action',
        'contact:hero' => 'Contact → Hero with the enquiry form',
        'contact:next_steps' => 'Contact → What happens next',
        'contact:channels' => 'Contact → Other ways to say hi',
        'contact:chat_faq' => 'Contact → Chat-style FAQ',
        'contact:after_send' => 'Contact → After you hit send',
        'contact:where_when' => 'Contact → Where & when',
        'contact:testimonials' => 'Contact → Testimonials',
        'services:hero' => 'Services → Hero',
        'services:intro' => 'Services → Intro with stats',
        'services:rows' => 'Services → Service list',
        'services:marquee' => 'Services → Scrolling marquee',
        'services:explained' => 'Services → Services explained',
        'services:faq' => 'Services → FAQ',
        'services:comparison' => 'Services → Comparison table',
        'services:industries' => 'Services → Industries',
        'services:models' => 'Services → Ways to work with us',
        'services:stats' => 'Services → Stats band',
        'services:testimonials' => 'Services → Testimonials',
        'services:cta' => 'Services → Closing call to action',
        'work:hero' => 'Work → Hero',
        'work:intro' => 'Work → Intro',
        'work:clients' => 'Work → Client logos',
        'work:impact' => 'Work → Impact',
        'work:testimonials' => 'Work → Testimonials',
        'work:teasers' => 'Work → In the oven',
        'work:marquees' => 'Work → Scrolling marquees',
        'work:cta' => 'Work → Closing call to action',
        'blog:hero' => 'Blog → Hero',
        'blog:journal_intro' => 'Blog → Journal intro',
        'blog:start_here' => 'Blog → Start here',
        'blog:resources' => 'Blog → Resources',
        'blog:trending_tags' => 'Blog → Trending tags',
        'blog:newsletter' => 'Blog → Newsletter sign-up',
    ];

    /** "about:values" for About's Values section; a custom page's section keeps the type it was copied as. */
    public static function typeOf(PageSection $section): ?string
    {
        $type = $section->type ?: ($section->page ? $section->page->slug.':'.$section->key : null);

        return $type !== null && array_key_exists($type, self::TYPES) ? $type : null;
    }

    public static function label(?string $type): string
    {
        return self::TYPES[$type] ?? (string) $type;
    }

    /**
     * Every section that can be copied, grouped by the page it's on:
     * [page title => [section id => "Values"]]. Built-in pages first.
     *
     * @return array<string, array<int, string>>
     */
    public static function sources(?Page $except = null): array
    {
        $groups = [];
        $pages = Page::query()->with('sections')->where('slug', '!=', 'home')
            ->when($except, fn ($q) => $q->whereKeyNot($except->getKey()))
            ->orderBy('is_custom')->orderBy('sort_order')->orderBy('title')->get();
        foreach ($pages as $page) {
            foreach ($page->sections as $section) {
                $type = self::typeOf($section);
                if ($type === null) {
                    continue;
                }
                $group = $page->is_custom ? "Your pages · {$page->title}" : $page->title;
                $name = $page->is_custom ? $section->label.' ('.Str::after(self::label($type), '→ ').' design)' : Str::after(self::label($type), '→ ');
                $groups[$group][$section->id] = trim($name);
            }
        }

        return $groups;
    }

    /** Copies a section (its content and form layout) onto a custom page, after its last section. */
    public static function copyTo(Page $page, PageSection $source, ?string $label = null): PageSection
    {
        $type = self::typeOf($source);
        abort_if($type === null, 422, 'This section can’t be copied.');

        $base = Str::of(Str::after($type, ':'))->replace('_', '-')->toString();
        $key = $base;
        for ($n = 2; $page->sections()->where('key', $key)->exists(); $n++) {
            $key = "$base-$n";
        }

        return $page->sections()->create([
            'key' => $key,
            'type' => $type,
            'label' => $label ?: $source->label,
            'content' => $source->content,
            'schema' => $source->schema,
            'is_published' => true,
            'sort_order' => (int) $page->sections()->max('sort_order') + 1,
        ]);
    }

    /**
     * "Duplicate": a new custom page with a copy of every section of `$source`
     * that a page can be made of (same names, same show/hide state, same
     * order) and its search & sharing tags. Copies are independent of the
     * original from then on. Returns the new page.
     */
    public static function duplicate(Page $source, string $title, string $slug, bool $published = false): Page
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($source, $title, $slug, $published) {
            $page = Page::create([
                'slug' => $slug,
                'title' => $title,
                'is_custom' => true,
                'is_published' => $published,
                'seo_title' => null,
                'seo_description' => $source->seo_description,
                'seo_keywords' => $source->seo_keywords,
                'og_image' => $source->og_image,
                'robots' => $source->robots ?: 'index, follow',
                'sort_order' => (int) Page::max('sort_order') + 1,
            ]);
            foreach ($source->sections()->get() as $section) {
                if (self::typeOf($section) === null) {
                    continue;
                }
                self::copyTo($page, $section, $section->label)->update(['is_published' => $section->is_published]);
            }

            return $page;
        });
    }

    /** Sections of `$page` a duplicate can't take with it (they only work on their own page). */
    public static function notCopyable(Page $page): array
    {
        return $page->sections()->get()->filter(fn (PageSection $s) => self::typeOf($s) === null)->pluck('label')->all();
    }

    /** Addresses a custom page can't use: the site's own routes and files. */
    public const RESERVED_SLUGS = [
        'home', 'about', 'work', 'services', 'blog', 'contact', 'api', 'admin', 'assets', 'icons', 'fonts',
        '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'opengraph-image', 'storage',
    ];
}
