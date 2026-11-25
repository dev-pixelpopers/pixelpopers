<?php

namespace App\Filament\Support;

/**
 * Services → Brand Identity → Page sections. DEFAULTS mirrors the website's
 * frontend src/components/inner/services/brand-identity/copy.ts; the form is
 * built from it (see BuildsPageSectionsFromDefaults).
 */
class BrandIdentitySections
{
    use BuildsPageSectionsFromDefaults;

    public const SECTIONS = [
        'hero' => 'Hero — brand book stack',
        'contents' => 'Brand book contents strip',
        'logo' => 'Logo anatomy — “Every curve has a reason”',
        'colour' => 'Colour system — swatches',
        'type' => 'Typography specimen',
        'wild' => 'Brand in the wild — photos',
        'kit' => 'Stationery kit (dark desk)',
        'glow' => 'The glow-up — before & after slider',
        'chapters' => 'Four chapters (process books)',
    ];

    public const NOTES = [
        'colour' => 'Each swatch is painted with the hex code you type (e.g. #F27793).',
        'wild' => 'The photos themselves are on the Images tab.',
        'glow' => 'Upload the before and after photos on the Images tab; without a before photo the left side shows the placeholder text.',
        'chapters' => 'Each chapter’s title and page text come from the Process tab.',
    ];

    public const DEFAULTS = [
        'hero' => [
            'bookLink' => 'See the brand book ↓',
            'bookTitle' => 'BRAND GUIDELINES',
            'bookVolume' => 'VOL. 01 · 2026',
            'sticker' => 'LOGO TO LAUNCH ✦',
            'photoAlt' => 'Fifth Sip packaging design by Pixel Popers',
            'logoAlt' => 'Pixel Popers logo',
        ],
        'contents' => [
            'title' => 'Contents',
            'items' => [
                [
                    'label' => 'Strategy',
                ],
                [
                    'label' => 'Logo',
                ],
                [
                    'label' => 'Colour',
                ],
                [
                    'label' => 'Type',
                ],
                [
                    'label' => 'Applications',
                ],
                [
                    'label' => 'Guidelines',
                ],
            ],
        ],
        'logo' => [
            'eyebrow' => 'Logo anatomy',
            'heading' => 'Every curve
has a reason',
            'text' => 'We design marks on a grid, test them at 16px and on a billboard, and document every rule so your logo never gets squished again.',
            'rules' => [
                [
                    'title' => 'Clear space',
                    'body' => 'Keep one “P-height” free around the mark.',
                ],
                [
                    'title' => 'Minimum size',
                    'body' => '24px on screen · 10mm in print.',
                ],
                [
                    'title' => 'The don’ts',
                    'body' => 'No stretching, recolouring or outlining.',
                ],
            ],
            'gridLabel' => 'Grid 50px',
            'markLabel' => 'Mark · v3 final',
            'caption' => 'Construction grid for the Pixel Popers “P” mark, showing clear space, construction circles and the diagonal guide.',
        ],
        'colour' => [
            'eyebrow' => 'Colour system',
            'heading' => 'Palettes that feel like you',
            'text' => '',
            'rgbLabel' => 'RGB',
            'cmykLabel' => 'CMYK',
            'swatches' => [
                [
                    'role' => 'Primary',
                    'name' => 'Pop Pink',
                    'hex' => '#F27793',
                    'rgb' => '242 · 119 · 147',
                    'cmyk' => '0 · 51 · 39 · 5',
                ],
                [
                    'role' => 'Primary',
                    'name' => 'Grape',
                    'hex' => '#6A4B97',
                    'rgb' => '106 · 75 · 151',
                    'cmyk' => '30 · 50 · 0 · 41',
                ],
                [
                    'role' => 'Accent',
                    'name' => 'Fizz',
                    'hex' => '#3FB7C7',
                    'rgb' => '63 · 183 · 199',
                    'cmyk' => '68 · 8 · 0 · 22',
                ],
                [
                    'role' => 'Accent',
                    'name' => 'Sunny',
                    'hex' => '#F5C255',
                    'rgb' => '245 · 194 · 85',
                    'cmyk' => '0 · 21 · 65 · 4',
                ],
                [
                    'role' => 'Text',
                    'name' => 'Midnight',
                    'hex' => '#220128',
                    'rgb' => '34 · 1 · 40',
                    'cmyk' => '15 · 98 · 0 · 84',
                ],
            ],
        ],
        'type' => [
            'heading' => 'Typography',
            'displayLabel' => 'Display — Nevera',
            'displaySample' => 'Pop! Wow. Yes.',
            'bodyLabel' => 'Body — Haas Grot Disp',
            'bodySample' => 'A typeface pairing with attitude: loud, rounded headlines meet a crisp, friendly grotesk that stays readable at every size.',
            'copyLabel' => 'Running copy — Archivo',
            'weights' => [
                [
                    'label' => 'Light',
                ],
                [
                    'label' => 'Regular',
                ],
                [
                    'label' => 'Medium',
                ],
                [
                    'label' => 'Bold',
                ],
                [
                    'label' => 'ExtraBold',
                ],
            ],
            'alphabet' => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ  abcdefghijklm  0123456789  !?&@',
            'scale' => 'H1 120 · H2 76 · Body 22 / 36',
        ],
        'wild' => [
            'eyebrow' => 'Brand in the wild',
            'heading' => 'Every touchpoint, on brand',
            'text' => '',
            'photos' => [
                [
                    'label' => 'Packaging',
                    'alt' => 'Fifth Sip coffee packaging: branded cups, tray, carrier bag, coffee pouch and menus',
                ],
                [
                    'label' => 'Merch',
                    'alt' => 'Fifth Sip carrier bag and decaf coffee pouch',
                ],
                [
                    'label' => 'Social',
                    'alt' => 'Kern café social media grid with branded cups and aprons',
                ],
            ],
        ],
        'kit' => [
            'caption' => 'Stationery kit',
            'description' => 'Stationery kit: letterhead, envelope, business cards, social post, app icon and sticker sheet',
            'brand' => 'PIXEL POPERS',
            'name' => 'Barry Allen',
            'role' => 'Founder & Creative Director',
            'email' => 'hello@pixelpopers.com',
            'phone' => '+00 000 000 000',
            'website' => 'pixelpopers.com',
            'socialWord' => 'POP!',
            'socialLine' => 'NEW DROP · FRIDAY',
            'stickerSheet' => 'STICKER SHEET',
            'labels' => [
                [
                    'label' => 'Letterhead',
                ],
                [
                    'label' => 'Envelope',
                ],
                [
                    'label' => 'Business cards',
                ],
                [
                    'label' => 'Social',
                ],
                [
                    'label' => 'App icon',
                ],
                [
                    'label' => 'Stickers',
                ],
            ],
        ],
        'glow' => [
            'eyebrow' => 'The glow-up',
            'heading' => 'Before & after',
            'text' => '',
            'beforeLabel' => 'Before',
            'afterLabel' => 'After',
            'placeholder' => 'fifth sip coffee co.',
            'placeholderNote' => '(generic font, no system, no story)',
            'beforeAlt' => 'The brand before the redesign',
            'afterAlt' => 'Fifth Sip coffee identity applied to cups, a tray, a bag, a coffee pouch and menus',
            'sliderLabel' => 'Drag to compare the old and new Fifth Sip branding',
            'caption' => 'Before and after: a generic text logo for Fifth Sip Coffee Co. next to the finished identity system on packaging.',
        ],
        'chapters' => [
            'eyebrow' => 'How we do it',
            'heading' => 'Four chapters to a brand',
            'text' => '',
            'hintHover' => 'Hover',
            'hintTap' => 'Tap',
            'hint' => 'a chapter to flip it open',
            'prefix' => 'CH.',
            'chapterWord' => 'Chapter',
            'flipLabel' => 'flip to read',
            'flipBack' => '↺ flip back',
            'chapters' => [
                [
                    'word' => 'one',
                    'blurb' => 'Brand workshop, competitor scan & audience deep-dive.',
                ],
                [
                    'word' => 'two',
                    'blurb' => 'Story, voice & the one idea your brand owns.',
                ],
                [
                    'word' => 'three',
                    'blurb' => 'Three routes, refined into one bold identity.',
                ],
                [
                    'word' => 'four',
                    'blurb' => 'Guidelines, assets & launch support.',
                ],
            ],
        ],
    ];
}
