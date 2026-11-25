<?php

namespace App\Filament\Support;

use Filament\Schemas\Components as SchemaComponents;

/**
 * The "Section headings" tab on every service: the headings and small print
 * of the blocks all service pages share — the long copy, packages, FAQs,
 * "more services" and the closing call to action. Saved to `headings`.
 *
 * DEFAULTS mirrors the website's wording (frontend src/lib/service-headings.ts)
 * and shows as each field's placeholder; a field left empty keeps it.
 */
class ServiceHeadings
{
    use BuildsPageSectionFields;

    public const DEFAULTS = [
        'tools' => 'Tools we love',
        'included' => [
            'eyebrow' => 'What\'s included',
            'heading' => 'Everything in the box',
        ],
        'process' => [
            'eyebrow' => 'Step by step',
            'heading' => 'How the work gets done',
        ],
        'audience' => [
            'eyebrow' => 'Who it\'s for',
            'heading' => 'Made for brands like yours',
        ],
        'insights' => [
            'eyebrow' => 'Good to know',
            'heading' => 'The short guide',
        ],
        'packages' => [
            'eyebrow' => 'Pick your pop',
            'heading' => 'Packages',
            'note' => 'Prices are starting points — every project gets a fixed quote after a free 30-minute call.',
            'button' => 'Get a quote',
            'popular' => 'Most popular',
            'price' => 'Price',
            'timeline' => 'Timeline',
        ],
        'faqs' => [
            'eyebrow' => 'Good questions',
            'heading' => 'Asked &
answered',
        ],
        'more' => [
            'heading' => 'More ways to pop',
        ],
        'cta' => [
            'eyebrow' => 'Ready to pop?',
            'lead' => 'Let\'s talk',
            'text' => 'Tell us where you are and where you want to be — we reply within a day with next steps.',
        ],
    ];

    public static function schema(): array
    {
        return [
            SchemaComponents\Text::make('Headings of the shared blocks below this page’s design. Each box shows the default in grey — leave it empty to keep that, or type to replace it. A heading’s line breaks are kept.'),

            self::section('The full story', [
                self::input('tools', 'Label above the tools', 'headings'),
            ]),
            self::section('What’s included', self::pair('included'))
                ->description('On Mobile App Development this block is the Settings screen, worded under Page sections.'),
            self::section('Step by step', self::pair('process'))
                ->description('Pages that show the process in their own design skip this block.'),
            self::section('Who it’s for', self::pair('audience')),
            self::section('The short guide', self::pair('insights')),
            self::section('Packages', [
                ...self::pair('packages'),
                self::area('packages.note', 'Note under the packages', 'headings', 2)->columnSpanFull(),
                self::input('packages.button', 'Card button', 'headings'),
                self::input('packages.popular', '“Most popular” badge', 'headings'),
                self::input('packages.price', 'Price label (where shown)', 'headings'),
                self::input('packages.timeline', 'Timeline label (where shown)', 'headings'),
            ]),
            self::section('FAQs', self::pair('faqs')),
            self::section('More services', [
                self::input('more.heading', 'Heading', 'headings'),
            ]),
            self::section('Closing call to action', [
                self::input('cta.eyebrow', 'Eyebrow', 'headings'),
                self::input('cta.lead', 'First line of the heading', 'headings')
                    ->helperText('The second line is the CTA heading on the Content tab.'),
                self::area('cta.text', 'Text', 'headings', 2)->columnSpanFull(),
            ]),
        ];
    }

    /** Eyebrow + heading for one block. */
    private static function pair(string $key): array
    {
        return [
            self::input("$key.eyebrow", 'Eyebrow', 'headings'),
            self::area("$key.heading", 'Heading', 'headings', 2),
        ];
    }
}
