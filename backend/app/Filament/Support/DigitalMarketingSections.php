<?php

namespace App\Filament\Support;

use Filament\Forms;
use Filament\Schemas\Components as SchemaComponents;

/**
 * The admin form for every piece of copy on the Digital Marketing page's
 * design sections (Services → Digital Marketing → Page sections).
 *
 * The website keeps the design's own words (frontend
 * src/components/inner/services/digital-marketing/copy.ts); DEFAULTS mirrors
 * them so each field shows its design wording as a placeholder. A field left
 * empty keeps that wording. Lists are fixed-length — each circle, funnel bar
 * and sticker has its own place and colour in the design — so the form edits
 * their words, never their number.
 *
 * Fields save to `engine.*` (the growth engine section) and `copy.*` (the rest).
 */
class DigitalMarketingSections
{
    use BuildsPageSectionFields;

    public const DEFAULTS = [
        'hero' => [
            'dashboard' => [
                'title' => 'Campaign overview',
                'period' => 'Last 30 days',
                'kpis' => [
                    ['label' => 'Reach', 'value' => '1.2M', 'delta' => '+212%'],
                    ['label' => 'Clicks', 'value' => '48.3K', 'delta' => '+87%'],
                    ['label' => 'Sales', 'value' => '$86K', 'delta' => '+64%'],
                ],
            ],
            'toasts' => [['label' => '♥  12.4K'], ['label' => '●  New lead: Sarah from Lahore'], ['label' => 'ROAS 3.2×'], ['label' => 'CTR 4.8%']],
        ],
        'engine' => [
            'eyebrow' => 'The growth engine',
            'heading' => 'One brand. Six channels.',
            'text' => '',
            'center' => "Your\nbrand",
            'channels' => [
                ['name' => 'Social', 'note' => '+48% followers'],
                ['name' => 'SEO', 'note' => 'Page 1 rankings'],
                ['name' => 'Paid ads', 'note' => '3.2× ROAS'],
                ['name' => 'Email', 'note' => '42% open rate'],
                ['name' => 'Content', 'note' => 'Reels & posts'],
                ['name' => 'Analytics', 'note' => 'Monthly reports'],
            ],
        ],
        'funnel' => [
            'eyebrow' => 'The funnel, fixed',
            'heading' => 'From “who?” to “where do I pay?”',
            'text' => '',
            'stages' => [
                ['stage' => 'Awareness', 'how' => 'Reels, collabs & paid reach', 'result' => '1.2M reached'],
                ['stage' => 'Interest', 'how' => 'Content, SEO & retargeting', 'result' => '86K visits'],
                ['stage' => 'Consideration', 'how' => 'Reviews, email & landing pages', 'result' => '12K leads'],
                ['stage' => 'Conversion', 'how' => 'Offers, checkout & ads', 'result' => '3.4K sales'],
                ['stage' => 'Loyalty', 'how' => 'Email flows & community', 'result' => '42% repeat'],
            ],
        ],
        'social' => [
            'eyebrow' => 'Social media',
            'heading' => "Feeds that\nactually pop",
            'intro' => 'We plan, shoot, design and post — a consistent feed with a clear look, a steady rhythm and content people save and share.',
            'text' => 'As a social media marketing agency, we plan, design and create content that gives your brand a distinctive presence. From reels and carousels to campaigns and content calendars, we keep your feed consistent, your audience engaged and your brand worth following.',
            'calendar' => 'Content calendar · October',
        ],
        'results' => [
            'eyebrow' => 'Results, not vanity',
            'heading' => 'Watch the bars go up',
            'text' => 'Our digital marketing services for small business focus on results that matter, more qualified leads, stronger conversions and measurable revenue growth. We track performance, optimise campaigns and make every marketing investment work harder for your business.',
            'chartTitle' => 'Monthly revenue from digital channels',
            'before' => 'Before',
            'after' => 'With Pixel Popers',
            'highlight' => 'OCT  ·  $38.6K',
            'highlightNote' => '▲ 160% vs May',
            'stickers' => [
                ['value' => '+160%', 'label' => 'Revenue in 6 months'],
                ['value' => '4.8%', 'label' => 'Avg. click-through'],
                ['value' => '−38%', 'label' => 'Cost per lead'],
            ],
        ],
        'seo' => [
            'eyebrow' => 'SEO',
            'heading' => 'Be the first thing they find',
            'subheading' => 'SEO Services That Put Your Business First in Search',
            'text' => 'Get found by customers already searching for what you offer. Our SEO services focus on improving search visibility, attracting relevant traffic and turning organic searches into real business opportunities.',
            'query' => 'best specialty coffee near me',
            'result' => [
                'url' => 'fifthsip.cafe › menu',
                'title' => 'Fifth Sip — Specialty Coffee & Brunch | Order Online',
                'rating' => '4.9 (1,204)',
                'description' => 'Open now  ·  Freshly roasted beans, brunch all day and the best flat white in town.',
            ],
            'others' => [
                ['url' => 'anothercafe.com › about', 'title' => 'Another Café — Coffee Shop'],
                ['url' => 'directory.com › coffee', 'title' => 'Top 10 Coffee Shops (2026)'],
            ],
        ],
        'ads' => [
            'eyebrow' => 'How we do it',
            'heading' => 'Four stories to growth',
            'text' => '',
            'stories' => [
                ['headline' => 'Glow in 7 days', 'cta' => 'Shop now', 'alt' => 'Skincare story ad: “Radiance that feels alive” with a glowing portrait'],
                ['headline' => 'Your 5th sip is on us', 'cta' => 'Claim offer', 'alt' => 'Fifth Sip coffee story ad with branded cups, bag and menus'],
                ['headline' => 'Bold flavor. New drop.', 'cta' => 'Order now', 'alt' => 'Colourful drinks brand story ad announcing a new flavour drop'],
                ['headline' => '2 & 3 BHK from 49L', 'cta' => 'Book a visit', 'alt' => 'Real-estate story ad for 2 and 3 BHK apartments'],
            ],
        ],
    ];

    /** The tab's contents: one collapsible block per page section, top to bottom. */
    public static function schema(): array
    {
        return [
            SchemaComponents\Text::make('Every word in the page’s design sections. Each box shows the design’s wording in grey — leave it empty to keep that, or type to replace it. Descriptions show under each section’s visual.'),

            self::section('Hero — campaign dashboard', [
                self::input('hero.dashboard.title', 'Dashboard title'),
                self::input('hero.dashboard.period', 'Period'),
                ...self::items('hero.dashboard.kpis', 3, 'KPI', ['label' => 'Label', 'value' => 'Value', 'delta' => 'Change']),
                ...self::items('hero.toasts', 4, 'Notification', ['label' => 'Text']),
            ], collapsed: true),

            self::section('Growth engine — “One brand. Six channels.”', [
                ...self::titleFields('engine', 'engine'),
                self::area('engine.center', 'Centre circle', 'engine', 2),
                ...self::items('engine.channels', 6, 'Channel circle', ['name' => 'Name', 'note' => 'Note'], 'engine'),
            ]),

            self::section('Funnel — “From who? to where do I pay?”', [
                ...self::titleFields('funnel'),
                ...self::items('funnel.stages', 5, 'Funnel bar', ['stage' => 'Stage', 'how' => 'How (left)', 'result' => 'Result (right)']),
            ]),

            self::section('Social media — “Feeds that actually pop”', [
                ...self::titleFields('social'),
                self::area('social.intro', 'Intro (next to the phone)')->columnSpanFull(),
                self::input('social.calendar', 'Calendar title'),
            ]),

            self::section('Results — “Watch the bars go up”', [
                ...self::titleFields('results'),
                self::input('results.chartTitle', 'Chart title'),
                self::input('results.highlight', 'Highlight (top bar)'),
                self::input('results.before', 'Legend: before'),
                self::input('results.after', 'Legend: after'),
                self::input('results.highlightNote', 'Highlight note'),
                ...self::items('results.stickers', 3, 'Sticker', ['value' => 'Number', 'label' => 'Label']),
            ]),

            self::section('SEO — “Be the first thing they find”', [
                ...self::titleFields('seo', withSubheading: true),
                self::input('seo.query', 'Search box'),
                self::input('seo.result.url', '#1 result: address'),
                self::input('seo.result.title', '#1 result: title'),
                self::input('seo.result.rating', '#1 result: rating'),
                self::input('seo.result.description', '#1 result: description')->columnSpanFull(),
                ...self::items('seo.others', 2, 'Other result', ['url' => 'Address', 'title' => 'Title']),
            ]),

            self::section('Process — “Four stories to growth”', [
                ...self::titleFields('ads'),
                SchemaComponents\Text::make('The steps behind each story come from the Process tab.')->columnSpanFull(),
                ...self::items('ads.stories', 4, 'Story ad', ['headline' => 'Headline', 'cta' => 'Button', 'alt' => 'Image description (alt)']),
            ]),
        ];
    }
}
