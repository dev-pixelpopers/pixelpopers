<?php

namespace App\Filament\Support;

use Filament\Schemas\Components as SchemaComponents;

/**
 * The admin form for every word on the Mobile App Development page's design
 * sections (Services → Mobile App Development → Page sections).
 *
 * DEFAULTS mirrors the website's own wording (frontend
 * src/components/inner/services/mobile-app-development/copy.ts), shown as
 * each field's placeholder; a field left empty keeps it. Everything saves to
 * the service's `copy` column. The "Five phases" steps themselves come from
 * the Process tab; the long copy, packages and FAQs from their own tabs.
 */
class MobileAppSections
{
    use BuildsPageSectionFields;

    public const DEFAULTS = [
        'hero' => [
            'badge' => 'iOS · Android · Cross-platform',
            'phone' => [
                'app' => 'Fifth Sip',
                'greeting' => 'Morning, Sara ☕',
                'item' => 'Oat flat white',
                'price' => '$4.20',
                'button' => 'Order again',
                'points' => '★ 120 pts',
                'tabs' => [
                    [
                        'label' => 'Home',
                    ],
                    [
                        'label' => 'Menu',
                    ],
                    [
                        'label' => 'Rewards',
                    ],
                    [
                        'label' => 'Profile',
                    ],
                ],
            ],
            'notifications' => [
                [
                    'app' => 'Fifth Sip',
                    'title' => 'Your order is ready',
                    'body' => 'Pick it up at the counter 🎉',
                ],
                [
                    'app' => 'App Store',
                    'title' => 'Fifth Sip 1.0 is live',
                    'body' => 'Approved and ready to download',
                ],
            ],
            'rating' => [
                'value' => '4.9',
                'label' => 'Store rating',
            ],
            'toast' => '✓ Build 1.0.4 shipped',
        ],
        'platforms' => [
            'eyebrow' => 'Every platform',
            'heading' => 'One crew.
Every app store.',
            'text' => '',
            'cards' => [
                [
                    'name' => 'iOS',
                    'tag' => 'Swift · SwiftUI',
                    'body' => 'Native iPhone and iPad apps that feel at home next to Apple’s own, from widgets to Face ID.',
                ],
                [
                    'name' => 'Android',
                    'tag' => 'Kotlin · Compose',
                    'body' => 'Fast, battery-friendly Android apps tested on the budget phones your customers really use.',
                ],
                [
                    'name' => 'Cross-platform',
                    'tag' => 'Flutter · React Native',
                    'body' => 'One codebase for both stores when time and budget matter, with native code where it counts.',
                ],
                [
                    'name' => 'Backend & cloud',
                    'tag' => 'APIs · Firebase · AWS',
                    'body' => 'The servers, sign-in, payments and admin panel that keep your app running behind the scenes.',
                ],
            ],
        ],
        'benefits' => [
            'eyebrow' => 'Why go mobile',
            'heading' => 'Right there on
their home screen',
            'text' => '',
            'items' => [
                [
                    'app' => 'Home screen',
                    'title' => 'One tap away',
                    'body' => 'Your icon lives next to their messages, and a well-timed push brings them back.',
                ],
                [
                    'app' => 'Offline',
                    'title' => 'Works on the train',
                    'body' => 'Apps keep working on patchy signal and sync quietly when the connection returns.',
                ],
                [
                    'app' => 'Device',
                    'title' => 'Uses the whole phone',
                    'body' => 'Camera, GPS, biometrics, Bluetooth and wallet payments turn ideas into features.',
                ],
                [
                    'app' => 'Insights',
                    'title' => 'Learns from every tap',
                    'body' => 'Event-level analytics show what people actually do, so every update is smarter.',
                ],
            ],
        ],
        'process' => [
            'eyebrow' => 'From idea to app store',
            'heading' => 'Five phases.
One launch.',
            'text' => '',
            'versions' => [
                [
                    'version' => 'Version 0.1',
                    'when' => 'Week 1',
                ],
                [
                    'version' => 'Version 0.3',
                    'when' => 'Weeks 1–3',
                ],
                [
                    'version' => 'Version 0.8',
                    'when' => 'Weeks 3–10',
                ],
                [
                    'version' => 'Version 0.9',
                    'when' => 'Weeks 8–11',
                ],
                [
                    'version' => 'Version 1.0',
                    'when' => 'Launch & beyond',
                ],
            ],
        ],
        'features' => [
            'eyebrow' => 'Built in',
            'heading' => 'Features we build every week',
            'text' => '',
            'items' => [
                [
                    'icon' => '👋',
                    'name' => 'Onboarding',
                ],
                [
                    'icon' => '🔐',
                    'name' => 'Face ID login',
                ],
                [
                    'icon' => '🔔',
                    'name' => 'Push alerts',
                ],
                [
                    'icon' => '📶',
                    'name' => 'Offline sync',
                ],
                [
                    'icon' => '💳',
                    'name' => 'Payments',
                ],
                [
                    'icon' => '📍',
                    'name' => 'Live maps',
                ],
                [
                    'icon' => '💬',
                    'name' => 'In-app chat',
                ],
                [
                    'icon' => '🔎',
                    'name' => 'Search & filters',
                ],
                [
                    'icon' => '📸',
                    'name' => 'Camera & uploads',
                ],
                [
                    'icon' => '🔗',
                    'name' => 'Deep links',
                ],
                [
                    'icon' => '📊',
                    'name' => 'Analytics',
                ],
                [
                    'icon' => '🌍',
                    'name' => 'Multi-language',
                ],
                [
                    'icon' => '🌙',
                    'name' => 'Dark mode',
                ],
                [
                    'icon' => '👥',
                    'name' => 'User roles',
                ],
                [
                    'icon' => '⬆️',
                    'name' => 'In-app updates',
                ],
                [
                    'icon' => '🛟',
                    'name' => 'Help & support',
                ],
                [
                    'icon' => '⭐',
                    'name' => 'Review prompts',
                ],
                [
                    'icon' => '♿',
                    'name' => 'Accessibility',
                ],
            ],
        ],
        'layers' => [
            'eyebrow' => 'Under the hood',
            'heading' => 'Built in layers
that last',
            'text' => 'Good apps are tidy on the inside. Each layer has one job, so new features slot in without breaking old ones — and your data stays locked down from the screen to the server.',
            'items' => [
                [
                    'name' => 'Interface',
                    'body' => 'Screens and components from one design system',
                ],
                [
                    'name' => 'App logic',
                    'body' => 'State and business rules, tested away from the UI',
                ],
                [
                    'name' => 'Offline storage',
                    'body' => 'A local database that syncs when signal returns',
                ],
                [
                    'name' => 'API & backend',
                    'body' => 'Versioned APIs, payments and third-party services',
                ],
                [
                    'name' => 'Security',
                    'body' => 'Encrypted data, short-lived tokens, server-side checks',
                ],
                [
                    'name' => 'Monitoring',
                    'body' => 'Crash reports and performance alerts from day one',
                ],
            ],
        ],
        'plan' => [
            'eyebrow' => 'Have an app idea?',
            'heading' => 'Get a clear plan
before you spend',
            'text' => 'Tell us the idea and we’ll come back with a scoped build plan — features, platform, timeline and a fixed budget. Free, with no obligation.',
            'button' => 'Get your build plan',
            'card' => 'Your build plan',
            'checklist' => [
                [
                    'label' => 'Feature list',
                ],
                [
                    'label' => 'iOS, Android or both',
                ],
                [
                    'label' => 'Week-by-week timeline',
                ],
                [
                    'label' => 'Fixed budget',
                ],
            ],
        ],
    ];

    /** The tab's contents: one collapsible block per page section, top to bottom. */
    public static function schema(): array
    {
        return [
            SchemaComponents\Text::make('Every word in the page’s design sections. Each box shows the design’s wording in grey — leave it empty to keep that, or type to replace it. The photo inside the phone is on the Images tab.'),

            self::section('Hero — phone app & notifications', [
                self::input('hero.badge', 'Badge under the button')->columnSpanFull(),
                self::input('hero.phone.app', 'App name'),
                self::input('hero.phone.greeting', 'Greeting'),
                self::input('hero.phone.item', 'Product name'),
                self::input('hero.phone.price', 'Price'),
                self::input('hero.phone.button', 'Button'),
                self::input('hero.phone.points', 'Points badge'),
                ...self::items('hero.phone.tabs', 4, 'Tab', ['label' => 'Label']),
                ...self::items('hero.notifications', 2, 'Notification', ['app' => 'App', 'title' => 'Title', 'body' => 'Message']),
                self::input('hero.rating.value', 'Rating sticker: number'),
                self::input('hero.rating.label', 'Rating sticker: label'),
                self::input('hero.toast', 'Build toast')->columnSpanFull(),
            ], collapsed: true),

            self::section('Platforms — “One crew. Every app store.”', [
                ...self::titleFields('platforms'),
                ...self::items('platforms.cards', 4, 'Platform card', ['name' => 'Name', 'tag' => 'Tag', 'body' => 'Text']),
            ]),

            self::section('Benefits — lock screen notifications', [
                ...self::titleFields('benefits'),
                ...self::items('benefits.items', 4, 'Notification', ['app' => 'Label', 'title' => 'Title', 'body' => 'Message']),
            ]),

            self::section('Process — version history', [
                ...self::titleFields('process'),
                SchemaComponents\Text::make('Each step’s title and text come from the Process tab; set its version label and timing here.')->columnSpanFull(),
                ...self::items('process.versions', 5, 'Step', ['version' => 'Version label', 'when' => 'Timing']),
            ]),

            self::section('Features — home screen icons', [
                ...self::titleFields('features'),
                SchemaComponents\Text::make('The icon is an emoji (paste one, e.g. 🔔).')->columnSpanFull(),
                ...self::items('features.items', 18, 'App icon', ['icon' => 'Icon (emoji)', 'name' => 'Name']),
            ]),

            self::section('Under the hood — layers', [
                ...self::titleFields('layers'),
                ...self::items('layers.items', 6, 'Layer', ['name' => 'Name', 'body' => 'Text']),
            ]),

            self::section('Build plan offer', [
                ...self::titleFields('plan'),
                self::input('plan.button', 'Button'),
                self::input('plan.card', 'Card title'),
                ...self::items('plan.checklist', 4, 'Checklist item', ['label' => 'Text']),
            ]),
        ];
    }
}
