<?php

namespace App\Filament\Support;

/**
 * Services → Content Writing → Page sections. DEFAULTS mirrors the website's
 * frontend src/components/inner/services/content-writing/copy.ts; the form is
 * built from it (see BuildsPageSectionsFromDefaults).
 */
class ContentWritingSections
{
    use BuildsPageSectionsFromDefaults;

    public const SECTIONS = [
        'hero' => 'Hero — draft on the desk',
        'rewrite' => 'The rewrite — before & after',
        'tone' => 'Tone of voice sliders',
        'post' => 'The Poppin’ Post (newspaper)',
        'seo' => 'SEO content — keywords & sticky notes',
    ];

    public const NOTES = [
        'hero' => 'The draft reads: lead, struck-out words (red pen), inserted words, body, keyword, ending.',
        'tone' => 'Each slider’s value is a number from 0 to 100.',
        'post' => 'The newspaper photo is on the Images tab.',
        'seo' => 'In the sample paragraph, wrap keywords in double brackets to highlight them, e.g. [[flat white]].',
    ];

    public const LABELS = [
        'caption' => 'Draft description (screen readers)',
        'keywordsLabel' => 'Keyword list description (screen readers)',
        'toWord' => 'Word between the slider ends (screen readers)',
        'ofTheWay' => 'Slider value suffix (screen readers)',
    ];

    public const DEFAULTS = [
        'hero' => [
            'file' => 'homepage_hero_v3.doc',
            'headline' => 'Coffee that tastes like Saturday morning.',
            'lead' => 'Fifth Sip',
            'struck' => 'is a leading provider of premium coffee solutions',
            'inserted' => 'the neighbourhood café',
            'body' => 'where every cup is roasted in-house, poured with care and served with a smile. Come for the',
            'keyword' => 'specialty coffee',
            'ending' => ', stay for the brunch.',
            'tone' => '¶  Tone: warm · witty · local',
            'stats' => 'Words: 42  ·  Reading level: easy  ·  SEO: ✓',
            'caption' => 'A homepage draft with a red-pen edit: “a leading provider of premium coffee solutions” becomes “the neighbourhood café”.',
            'notes' => [
                [
                    'note' => 'Too corporate! ✕',
                ],
                [
                    'note' => 'Keyword ✓',
                ],
                [
                    'note' => 'Punchier headline 🔥',
                ],
            ],
        ],
        'rewrite' => [
            'eyebrow' => 'The rewrite',
            'heading' => 'Same brand. Better words.',
            'text' => '',
            'beforeLabel' => 'BEFORE',
            'before' => 'We are a leading provider of innovative, best-in-class solutions for all of your coffee-related needs and requirements.',
            'beforeNote' => '38 words of nothing  ·  0 personality',
            'afterLabel' => 'AFTER',
            'after' => 'Coffee that tastes like Saturday. Every day.',
            'afterNote' => '8 words  ·  100% you',
            'sticker' => 'RE
WRITE
→',
        ],
        'tone' => [
            'eyebrow' => 'Tone of voice',
            'heading' => 'Find your
voice',
            'text' => 'Every brand sits somewhere on these dials. We find your spot, write it down, and make sure every word — from homepage to error message — sounds like you.',
            'profile' => 'Fifth Sip — voice profile',
            'sliders' => [
                [
                    'from' => 'Formal',
                    'to' => 'Casual',
                    'value' => '78',
                ],
                [
                    'from' => 'Serious',
                    'to' => 'Playful',
                    'value' => '70',
                ],
                [
                    'from' => 'Respectful',
                    'to' => 'Cheeky',
                    'value' => '55',
                ],
                [
                    'from' => 'Matter-of-fact',
                    'to' => 'Enthusiastic',
                    'value' => '82',
                ],
            ],
            'toWord' => 'to',
            'ofTheWay' => '% of the way',
        ],
        'post' => [
            'masthead' => 'Vol. 7  ·  October 2026  ·  Price: one good idea',
            'weather' => 'Weather: 100% chance of pop',
            'title' => 'The Poppin’ Post',
            'headline' => 'LOCAL CAFÉ’S WEBSITE COPY SO GOOD, CUSTOMERS READ IT TWICE',
            'standfirst' => 'Experts baffled as “About Us” page outperforms the brunch menu.',
            'columns' => [
                [
                    'text' => 'When Fifth Sip asked for “a few words for the website”, nobody expected the café’s homepage to become the most-shared link in the neighbourhood group chat. The secret? Copy that sounds like an actual person.',
                ],
                [
                    'text' => '“We stopped describing ourselves as a provider of coffee solutions,” says the founder. “Now we just say what we are: the place that makes your Saturday.” Bookings are up, and so is the brunch queue.',
                ],
                [
                    'text' => 'Pixel Popers’ writers spent a week listening before writing a single line — interviews, customer reviews, even the chalkboard specials. The result: a voice guide, 12 pages of web copy and a blog people actually finish.',
                ],
            ],
            'photoAlt' => 'A writer at a café table with a laptop and an iced latte',
            'issueTitle' => 'In this issue',
            'issue' => [
                [
                    'title' => 'Website copy',
                    'page' => 'p.2',
                ],
                [
                    'title' => 'Blog articles',
                    'page' => 'p.4',
                ],
                [
                    'title' => 'SEO content',
                    'page' => 'p.6',
                ],
                [
                    'title' => 'Social captions',
                    'page' => 'p.8',
                ],
                [
                    'title' => 'Video scripts',
                    'page' => 'p.10',
                ],
                [
                    'title' => 'Email newsletters',
                    'page' => 'p.12',
                ],
                [
                    'title' => 'Tone-of-voice guides',
                    'page' => 'p.14',
                ],
                [
                    'title' => 'Product descriptions',
                    'page' => 'p.16',
                ],
            ],
            'sticker' => 'EXTRA!
EXTRA!',
        ],
        'seo' => [
            'eyebrow' => 'SEO content',
            'heading' => 'Words that rank
(and read nicely)',
            'text' => '',
            'sample' => 'Looking for the best [[specialty coffee]] near you? Fifth Sip roasts [[single-origin beans]] in-house every morning, pairs them with an [[all-day brunch]] menu and serves the [[flat white]] locals queue for. [[Order online]], book a table, or grab a bag of [[freshly roasted beans]] to brew at home.',
            'sampleStats' => '6 keywords · readability: easy · 52 words',
            'keywordsLabel' => 'Target keywords and monthly searches',
            'keywords' => [
                [
                    'term' => 'specialty coffee',
                    'volume' => '12K/mo',
                ],
                [
                    'term' => 'brunch near me',
                    'volume' => '8.1K/mo',
                ],
                [
                    'term' => 'flat white',
                    'volume' => '5.4K/mo',
                ],
                [
                    'term' => 'coffee beans online',
                    'volume' => '3.2K/mo',
                ],
                [
                    'term' => 'best café in town',
                    'volume' => '2.9K/mo',
                ],
                [
                    'term' => 'single origin',
                    'volume' => '1.8K/mo',
                ],
                [
                    'term' => 'coffee subscription',
                    'volume' => '1.2K/mo',
                ],
            ],
            'stickies' => [
                [
                    'value' => '1,500',
                    'label' => 'Words per blog',
                ],
                [
                    'value' => '48h',
                    'label' => 'To a first draft',
                ],
                [
                    'value' => '2',
                    'label' => 'Rounds of edits',
                ],
                [
                    'value' => '500+',
                    'label' => 'Articles written',
                ],
            ],
        ],
    ];
}
