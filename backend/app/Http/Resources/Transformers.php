<?php

namespace App\Http\Resources;

use App\Models\Client;
use App\Models\Comment;
use App\Models\Page;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\ShowreelItem;
use App\Models\TeamMember;
use App\Models\Testimonial;

/**
 * Shapes records for the public API in the frontend's own vocabulary: the
 * same field names and nesting as the TypeScript types in the Next.js app
 * (src/lib/*), so switching the site from its built-in data to the API is a
 * drop-in change. Media paths are passed through as stored ("/assets/…" stays
 * relative to the website; uploads are absolute URLs).
 */
class Transformers
{
    public static function page(Page $page): array
    {
        return [
            'slug' => $page->slug,
            'title' => $page->title,
            'seo' => [
                'title' => $page->seo_title,
                'description' => $page->seo_description,
                'keywords' => $page->seo_keywords,
                'ogImage' => $page->og_image,
                'robots' => $page->robots,
            ],
            // Keyed by section, e.g. sections.hero, sections.values.
            'sections' => $page->sections
                ->where('is_published', true)
                ->mapWithKeys(fn ($section) => [$section->key => $section->content])
                ->all(),
            'updatedAt' => $page->updated_at?->toIso8601String(),
        ];
    }

    /** The ServiceDetail type, plus the home page tile. */
    public static function service(Service $s, bool $full = true): array
    {
        $summary = [
            'slug' => $s->slug,
            'name' => $s->name,
            'accent' => $s->accent,
            'tile' => $s->tile ? ['id' => $s->slug, 'title' => $s->name] + $s->tile : null,
        ];
        if (! $full) {
            return $summary + ['heroIntro' => $s->hero_intro];
        }

        return $summary + [
            'heroLines' => $s->hero_lines ?? [],
            'heroIntro' => $s->hero_intro,
            'heroCta' => $s->hero_cta,
            'metaTitle' => $s->meta_title,
            'metaDescription' => $s->meta_description,
            'ogImage' => $s->og_image,
            'overview' => $s->overview,
            'included' => $s->included ?? [],
            'process' => $s->process ?? [],
            'audience' => $s->audience ?? [],
            'insights' => $s->insights ?? [],
            'whyUs' => $s->why_us,
            'tools' => $s->tools ?? [],
            'stats' => $s->stats ?? [],
            'packages' => $s->packages ?? [],
            'faqs' => $s->faqs ?? [],
            'ctaHeading' => $s->cta_heading,
            'ctaButton' => $s->cta_button,
            // Sections switched off in the CMS (keys of Service::SECTIONS).
            'hidden' => $s->hiddenSections(),
            'updatedAt' => $s->updated_at?->toIso8601String(),
        ];
    }

    /** The work Project type (card fields only when $full is false). */
    public static function project(Project $p, bool $full = true): array
    {
        $card = [
            'slug' => $p->slug,
            'name' => $p->name,
            'client' => $p->client,
            'year' => $p->year,
            'month' => $p->month,
            'tagline' => $p->tagline,
            'services' => $p->services ?? [],
            'categories' => $p->categories ?? [],
            'discipline' => $p->discipline,
            'accent' => $p->accent,
            'cover' => $p->cover,
            'coverBg' => $p->cover_bg,
            'description' => $p->description,
            'featured' => $p->featured,
        ];
        if (! $full) {
            return $card;
        }

        return $card + [
            'timeline' => $p->timeline,
            'sticker' => $p->sticker,
            'intro' => $p->intro,
            'brand' => $p->brand,
            'results' => $p->results ?? [],
            'quote' => $p->quote,
            'story' => $p->story,
            'gallery' => $p->gallery ?? [],
            'galleryHeading' => $p->gallery_heading,
            'delivered' => $p->delivered,
            'phases' => $p->phases ?? [],
            'team' => $p->team ?? [],
            'seo' => ['title' => $p->seo_title, 'description' => $p->seo_description, 'ogImage' => $p->og_image],
            'updatedAt' => $p->updated_at?->toIso8601String(),
        ];
    }

    /** The home carousel's Project type. */
    public static function showreel(ShowreelItem $item): array
    {
        return ['id' => $item->slug, 'title' => $item->title, 'video' => $item->video, 'poster' => $item->poster];
    }

    public static function client(Client $c): array
    {
        return [
            'name' => $c->name,
            'src' => $c->logo,
            'width' => $c->width,
            'height' => $c->height,
            'tint' => $c->tint,
            'rotate' => $c->rotate,
        ];
    }

    /** The Owner type, with the author bios the blog uses. */
    public static function teamMember(TeamMember $m): array
    {
        return [
            'name' => $m->name,
            'role' => $m->role,
            'avatar' => $m->avatar,
            'accent' => $m->accent,
            'rotate' => $m->rotate,
            'bio' => ['short' => $m->bio_short, 'long' => $m->bio_long],
        ];
    }

    public static function testimonial(Testimonial $t): array
    {
        return ['quote' => $t->quote, 'role' => $t->role, 'company' => $t->company, 'initial' => $t->initial, 'tone' => $t->tone];
    }

    public static function comment(Comment $c): array
    {
        return [
            'name' => $c->name,
            'when' => $c->display_when ?? $c->created_at?->diffForHumans(),
            'text' => $c->body,
            'tone' => $c->tone,
            'createdAt' => $c->created_at?->toIso8601String(),
        ];
    }

    /** The blog Post type. */
    public static function post(Post $p, bool $full = true): array
    {
        $card = [
            'slug' => $p->slug,
            'title' => $p->title,
            'category' => $p->category?->name,
            'categoryTone' => $p->category?->tone,
            'date' => $p->published_at?->toDateString(),
            'readTime' => $p->read_time,
            'author' => $p->author?->name,
            'cover' => $p->cover,
            'excerpt' => $p->excerpt,
            'description' => $p->description,
            'tags' => $p->tags ?? [],
            'featured' => $p->featured,
        ];
        if (! $full) {
            return $card;
        }

        return $card + [
            'body' => $p->body ?? [],
            'comments' => $p->approvedComments->map(fn (Comment $c) => self::comment($c))->all(),
            'authorBio' => $p->author ? ['short' => $p->author->bio_short, 'long' => $p->author->bio_long, 'avatar' => $p->author->avatar] : null,
            'seo' => ['title' => $p->seo_title, 'ogImage' => $p->og_image],
            'updatedAt' => $p->updated_at?->toIso8601String(),
        ];
    }
}
