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
        'images',
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

    /**
     * The pictures in each service page's design that can be replaced from
     * the admin (Images tab): slot => [built-in file, label, page section].
     * The page asks for each spot by its slot name; the admin groups the
     * slots by section, in page order. Services created in the admin use
     * the generic layout, which has none.
     */
    public const IMAGE_SLOTS = [
        'brand-identity' => [
            'hero' => ['/assets/inner/brand-identity/fifth-sip-packaging.webp', 'Photo card in the collage', 'Hero'],
            'wild-packaging' => ['/assets/inner/brand-identity/fifth-sip-packaging.webp', 'Large photo (“Packaging”)', 'Brand in the wild'],
            'wild-merch' => ['/assets/inner/brand-identity/fifth-sip-merch.webp', 'Top-right photo (“Merch”)', 'Brand in the wild'],
            'wild-social' => ['/assets/inner/brand-identity/kern-social.webp', 'Bottom-right photo (“Social”)', 'Brand in the wild'],
            'before' => ['', 'Before photo (left side)', 'Before & after'],
            'after' => ['/assets/inner/brand-identity/fifth-sip-packaging.webp', 'After photo (right side)', 'Before & after'],
        ],
        'ui-ux-design' => [
            'hero-phone' => ['/assets/inner/ui-shop.webp', 'Phone screen', 'Hero'],
            'hifi-screen' => ['/assets/inner/liquidity.webp', 'Hi-fi screen', 'Wireframe → hi-fi'],
            'library-product' => ['/assets/inner/brand-identity/fifth-sip-packaging.webp', 'Product card photo', 'Design systems'],
            'library-avatar-1' => ['/assets/images/adan-j.png', 'Avatar 1', 'Design systems'],
            'library-avatar-2' => ['/assets/images/barry-allen.png', 'Avatar 2', 'Design systems'],
            'library-avatar-3' => ['/assets/images/james-allen.png', 'Avatar 3', 'Design systems'],
            'devices-laptop' => ['/assets/inner/liquidity.webp', 'Laptop screen', 'One product. Every screen.'],
            'devices-tablet' => ['/assets/inner/ui-shop.webp', 'Tablet screen', 'One product. Every screen.'],
            'devices-phone' => ['/assets/inner/liquidity.webp', 'Phone screen', 'One product. Every screen.'],
            'tested-heatmap' => ['/assets/inner/liquidity.webp', 'Heatmap screenshot', 'Tested with real humans'],
            'artboard-design' => ['/assets/inner/ui-shop.webp', '“Design” artboard screen', 'Process artboards'],
        ],
        'digital-marketing' => [
            'hero-post' => ['/assets/inner/fifth-sip.webp', 'Sponsored post photo', 'Hero'],
            'grid-1' => ['/assets/inner/fifth-sip.webp', 'Profile grid photo 1', 'Social media'],
            'grid-2' => ['/assets/inner/tien-coffee.webp', 'Profile grid photo 2', 'Social media'],
            'grid-3' => ['/assets/inner/radiance.webp', 'Profile grid photo 3', 'Social media'],
            'grid-4' => ['/assets/inner/campaign-strip.webp', 'Profile grid photo 4', 'Social media'],
            'grid-5' => ['/assets/inner/marketing.webp', 'Profile grid photo 5', 'Social media'],
            'story-1' => ['/assets/inner/radiance.webp', 'Story ad 1 (pink)', 'Process story ads'],
            'story-2' => ['/assets/inner/fifth-sip.webp', 'Story ad 2 (yellow)', 'Process story ads'],
            'story-3' => ['/assets/inner/digital-marketing/flavour-drop.webp', 'Story ad 3 (blue)', 'Process story ads'],
            'story-4' => ['/assets/inner/fortis-homes.webp', 'Story ad 4', 'Process story ads'],
        ],
        'web-development' => [
            'hero-browser' => ['/assets/inner/elevate.webp', 'Browser screenshot', 'Hero'],
            'devices-laptop' => ['/assets/inner/elevate.webp', 'Laptop screen', 'Responsive devices'],
            'devices-tablet' => ['/assets/inner/liquidity.webp', 'Tablet screen', 'Responsive devices'],
            'devices-phone' => ['/assets/inner/ui-shop.webp', 'Phone screen', 'Responsive devices'],
            'cms-preview' => ['/assets/inner/elevate.webp', 'Hero image in the CMS mock-up', 'CMS editor'],
        ],
        'motion-graphic' => [
            'hero-video' => ['/assets/videos/snackbar-video.mp4', 'Video in the player (MP4)', 'Hero'],
            'hero-poster' => ['/assets/inner/motion.webp', 'Player cover image', 'Hero'],
            'film-1' => ['/assets/inner/radiance.webp', 'Film strip frame 1', 'Hero'],
            'film-2' => ['/assets/inner/campaign-strip.webp', 'Film strip frame 2', 'Hero'],
            'film-3' => ['/assets/inner/motion.webp', 'Film strip frame 3', 'Hero'],
            'film-4' => ['/assets/inner/cube.webp', 'Film strip frame 4', 'Hero'],
            'film-5' => ['/assets/inner/fifth-sip.webp', 'Film strip frame 5', 'Hero'],
            'film-6' => ['/assets/inner/ui-shop.webp', 'Film strip frame 6', 'Hero'],
            'storyboard-4' => ['/assets/inner/brand-identity/fifth-sip-packaging.webp', 'Panel 4 (“Zoom in”)', 'Storyboard'],
            'storyboard-5' => ['/assets/inner/ui-shop.webp', 'Panel 5 phone screen', 'Storyboard'],
            'reel-1' => ['/assets/inner/radiance.webp', 'Reel 1 (“Glow routine”)', 'Social reels'],
            'reel-2' => ['/assets/inner/motion-graphic/reel-clim.webp', 'Reel 2 (“Bold flavour drop”)', 'Social reels'],
            'reel-3' => ['/assets/inner/motion.webp', 'Reel 3 (“Behind the motion”)', 'Social reels'],
        ],
        'content-writing' => [
            'post-photo' => ['/assets/inner/writing.webp', 'Article photo', 'The Poppin’ Post'],
        ],
    ];

    /** @return array<string, string> slot => uploaded replacement */
    public function imageOverrides(): array
    {
        return array_filter(
            array_intersect_key($this->images ?? [], self::IMAGE_SLOTS[$this->slug] ?? []),
            fn ($url) => filled($url),
        );
    }

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
        'images' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
