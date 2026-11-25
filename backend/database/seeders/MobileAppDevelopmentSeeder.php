<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Service;
use Illuminate\Database\Seeder;

/**
 * Adds the Mobile App Development service on its own:
 *
 *     php artisan db:seed --class=MobileAppDevelopmentSeeder
 *
 * - Creates the service (/services/mobile-app-development) with all of its
 *   page content: hero, long copy, what's included, process, packages, FAQs
 *   and SEO. Its design sections (phone, platforms, features, layers…) show
 *   the design's wording until edited under Services → Mobile App
 *   Development → Page sections.
 * - Adds its row to the Services overview page (Pages → Services → rows).
 *
 * Safe to re-run: if the service already exists it is left exactly as edited
 * in the admin (deleted, it stays deleted only until this is run again), and
 * the Services page row is only added when missing. It doesn't need, or
 * touch, anything else the main DatabaseSeeder seeds.
 */
class MobileAppDevelopmentSeeder extends Seeder
{
    public const SLUG = 'mobile-app-development';

    public function run(): void
    {
        $this->seedService();
        $this->seedServicesPageRow();
    }

    private function seedService(): void
    {
        if (Service::where('slug', self::SLUG)->exists()) {
            $this->command?->info('Mobile App Development already exists — left as it is.');

            return;
        }

        Service::create([
            'slug' => self::SLUG,
            ...self::content(),
            // Listed after the existing services; not one of the home page's giant-letter tiles.
            'tile' => null,
            'sort_order' => (int) Service::max('sort_order') + 1,
        ]);

        $this->command?->info('Mobile App Development service created.');
    }

    /** The service's row on /services ("What we do best" list and "Every service, explained"). */
    private function seedServicesPageRow(): void
    {
        $section = Page::where('slug', 'services')->first()?->sections()->where('key', 'rows')->first();
        if (! $section) {
            $this->command?->warn('No Services page "rows" section found — run the main DatabaseSeeder first to list the service there.');

            return;
        }

        $content = $section->content ?? [];
        $items = $content['items'] ?? [];
        if (collect($items)->contains(fn ($row) => ($row['slug'] ?? null) === self::SLUG)) {
            return;
        }

        $items[] = self::servicesRow();
        $content['items'] = $items;
        $section->content = $content;
        $section->save();

        $this->command?->info('Added Mobile App Development to the Services page.');
    }

    public static function servicesRow(): array
    {
        return [
            'slug' => self::SLUG,
            'tone' => 'grape',
            'blurb' => 'Native and cross-platform apps for iOS and Android, from first idea to the app stores.',
            'tags' => ['iOS', 'Android', 'Flutter', 'React Native'],
            'image' => [
                'src' => '/assets/inner/mobile-app.webp',
                'w' => 1190,
                'h' => 1095,
                'alt' => 'A coffee ordering app on a phone with push notifications and a 4.9 store rating',
            ],
            'explained' => 'Mobile app development turns your idea into an app people keep on their home screen. We plan the product with you, design the screens, then build native iOS and Android apps or one cross-platform app in Flutter or React Native, along with the backend, sign-in, payments and admin panel behind it. We test on real devices, handle App Store and Google Play submission, and stay on after launch with updates, monitoring and new features.',
        ];
    }

    /** Everything on the page apart from the design sections' wording. */
    public static function content(): array
    {
        return [
            'name' => 'Mobile App Development',
            'accent' => 'grape',
            'hero_lines' => ['MOBILE APPS', 'PEOPLE', 'KEEP OPENING'],
            'hero_subheading' => 'Mobile app development for iOS, Android and cross-platform',
            'hero_intro' => 'Native and cross-platform apps for iPhone and Android — planned, designed, built, launched on the stores and looked after long after launch day.',
            'hero_cta' => 'Start your app',
            'meta_title' => 'Mobile App Development — iOS, Android & Flutter Apps',
            'meta_description' => 'Pixel Popers builds mobile apps people love: native iOS and Android, Flutter and React Native, app UI/UX design, backend and APIs, MVPs and App Store launch.',

            'overview' => [
                'eyebrow' => 'THE FULL STORY',
                'heading' => 'AN APP LIVES IN THEIR POCKET',
                'paragraphs' => [
                    'A website waits to be visited. An app sits on someone’s home screen, a thumb’s reach away, between their messages and their music. That is a privileged spot — and people are quick to delete anything that wastes it. Mobile app development is how we make sure your app earns its place: fast to open, obvious to use and genuinely useful every time it is tapped.',
                    'At Pixel Popers we build apps the way we build brands: strategy first. Before anyone writes code, we work out who the app is for, the one job it must do brilliantly and the features that can wait for version two. That scoping turns a big idea into a clear plan with a timeline and a fixed budget, so you know exactly what you are getting before the build begins.',
                    'Then our designers and developers work as one team. We design the journeys and screens, test them as clickable prototypes, and build them as native iOS and Android apps or one cross-platform app in Flutter or React Native — whichever suits your audience, budget and plans. Behind the screens we build what makes an app work in the real world: secure sign-in, payments, push notifications, offline sync, an admin panel your team can run, and the APIs that connect it all.',
                    'Every two weeks you get a new build on your own phone, so you see real progress rather than status reports. We test on real devices, run a beta with your first users, handle App Store and Google Play submission, and keep watching crash reports and reviews after launch. Whether you are a start-up proving an idea with an MVP, a business putting its services in customers’ pockets or a team replacing an app that has fallen behind, we build apps people keep opening.',
                ],
            ],

            'included' => [
                ['title' => 'iOS app development', 'body' => 'Native iPhone and iPad apps in Swift and SwiftUI that feel at home on Apple devices, with Face ID, widgets, Apple Pay and everything else your users expect.'],
                ['title' => 'Android app development', 'body' => 'Native Android apps in Kotlin and Jetpack Compose, tuned for the huge range of Android phones and tested on the budget devices many of your customers really use.'],
                ['title' => 'Cross-platform apps', 'body' => 'One codebase for iOS and Android in Flutter or React Native when speed and budget matter most, with native code added wherever the experience needs it.'],
                ['title' => 'App UI/UX design', 'body' => 'User journeys, wireframes and polished screens built on a reusable design system, tested as clickable prototypes on real phones before development starts.'],
                ['title' => 'Backend, APIs & admin panel', 'body' => 'Secure sign-in, databases, APIs, payments and an admin panel your team can use, hosted on Firebase, AWS or your own cloud and built to grow with your users.'],
                ['title' => 'MVP development', 'body' => 'A focused first version that tests your idea with real users in weeks, with analytics from day one and a codebase strong enough to build the next version on.'],
                ['title' => 'App modernisation', 'body' => 'An audit of your existing app, then a step-by-step upgrade or rebuild that fixes crashes and slow screens without losing your users, reviews or data.'],
                ['title' => 'Store launch & care', 'body' => 'App Store and Google Play listings, submission and review, then ongoing updates for new OS versions, monitoring, bug fixes and new features.'],
            ],

            'process' => [
                ['title' => 'Discovery', 'body' => 'We define your users, goals, features and platforms, then agree a scoped plan with a timeline and a fixed price. You know exactly what will be built before development starts.'],
                ['title' => 'UX & design', 'body' => 'We map the user journeys, sketch wireframes and design every screen, then test a clickable prototype on real phones so the app feels right before it is built.'],
                ['title' => 'Build', 'body' => 'We develop the app and its backend in two-week sprints. After each sprint you install the latest build on your own phone and tell us what you think.'],
                ['title' => 'Test & beta', 'body' => 'We test on a range of real devices and screen sizes, fix what we find, then run a TestFlight and Google Play beta with your first users.'],
                ['title' => 'Launch & grow', 'body' => 'We prepare the store listings, submit to the App Store and Google Play, monitor crashes and reviews after launch, and plan the next version with you.'],
            ],

            'audience' => [
                ['title' => 'Start-ups with an idea', 'body' => 'Founders who need an MVP in users’ hands quickly, built well enough to grow into a real product.'],
                ['title' => 'Brands with loyal customers', 'body' => 'Shops, cafés and service businesses ready for ordering, bookings and rewards in their customers’ pockets.'],
                ['title' => 'Teams with a dated app', 'body' => 'Businesses whose current app is slow, crashing or hard to update and needs a modern rebuild.'],
                ['title' => 'Operations on the move', 'body' => 'Companies giving field teams, drivers or staff an app that replaces paper, spreadsheets and phone calls.'],
            ],

            'insights' => [
                ['title' => 'Native or cross-platform?', 'body' => 'Native apps, built separately in Swift for iOS and Kotlin for Android, get the best performance and the newest platform features. Cross-platform apps in Flutter or React Native share one codebase, so they are usually faster and cheaper to build and maintain. Most business apps do very well cross-platform; we recommend native when an app leans hard on the camera, graphics or hardware.'],
                ['title' => 'How much does an app cost?', 'body' => 'It depends on the number of screens, features and platforms, and on what the app connects to. A focused MVP costs far less than a full product with payments, chat and an admin panel. We give you a fixed price after a free scoping call, and our packages below show typical starting points so you can plan your budget.'],
                ['title' => 'What happens after launch?', 'body' => 'Launch is the start, not the finish. Apple and Google release new operating systems every year, so apps need regular updates to keep working well. After launch we monitor crashes and reviews, ship fixes, keep your app compliant with store policies and help you plan new features based on how people actually use it.'],
            ],

            'why_us' => [
                'heading' => 'WHY TEAMS BUILD APPS WITH US',
                'paragraphs' => [
                    'Our designers and developers sit on the same team, so the details that make an app feel great — the smooth animations, the clear buttons, the satisfying little moments — make it all the way from the prototype into the stores.',
                    'You see progress, not promises: a new build on your phone every two weeks, a shared channel with the people actually building your app, and honest advice about what to build now and what can wait.',
                    'And the app is yours. You own the code, the store accounts and the backend from day one, with documentation that lets any developer pick it up.',
                ],
            ],

            'tools' => ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Firebase', 'Node.js'],

            'stats' => [
                ['value' => '2 wks', 'label' => 'between test builds'],
                ['value' => '8–12', 'label' => 'weeks to a launch-ready MVP'],
                ['value' => '100%', 'label' => 'code & accounts yours'],
            ],

            'packages' => [
                [
                    'name' => 'Starter',
                    'summary' => 'MVP app',
                    'price' => 'From $6,000',
                    'timeline' => '6–8 weeks',
                    'features' => ['Cross-platform app', 'Up to 8 core screens', 'Sign-up & push notifications', 'App Store & Play submission'],
                ],
                [
                    'name' => 'Growth',
                    'summary' => 'Full product',
                    'price' => 'From $15,000',
                    'timeline' => '10–14 weeks',
                    'features' => ['Everything in Starter', 'Custom UI/UX design', 'Backend & admin panel', 'Payments & analytics'],
                    'popular' => true,
                ],
                [
                    'name' => 'Full Pop',
                    'summary' => 'Custom platform',
                    'price' => 'From $30,000',
                    'timeline' => '4–6 months',
                    'features' => ['Everything in Growth', 'Native iOS & Android', 'Integrations & offline sync', '6-month care plan'],
                ],
            ],

            'faqs' => [
                ['q' => 'How much does it cost to build a mobile app?', 'a' => 'It depends on the features, the number of screens, the platforms and the integrations. Our MVP apps start from $6,000, full products from $15,000 and custom platforms from $30,000. After a free scoping call we give you a fixed price, so there are no surprises.'],
                ['q' => 'How long does mobile app development take?', 'a' => 'A focused MVP usually takes 8–12 weeks from kick-off to store submission, and a full product 3–6 months. You get a working build on your phone every two weeks along the way, so you can see and test progress as it happens.'],
                ['q' => 'Should we build a native or a cross-platform app?', 'a' => 'Cross-platform (Flutter or React Native) suits most business apps: one codebase, faster delivery and lower maintenance. Native iOS and Android apps make sense when the app relies heavily on the camera, graphics, hardware or the newest platform features. We recommend the right option during discovery.'],
                ['q' => 'Flutter or React Native — which do you use?', 'a' => 'Both. Flutter is great for pixel-perfect custom designs and smooth animation; React Native is a strong fit when your team already works in JavaScript or shares code with a website. We pick based on your design, team and long-term plans, not habit.'],
                ['q' => 'Do you publish the app on the App Store and Google Play?', 'a' => 'Yes. We prepare the store listings, screenshots and privacy details, submit the app and handle any questions from Apple or Google during review. The app is published under your own developer accounts, so you stay in control.'],
                ['q' => 'Do you build the backend and admin panel too?', 'a' => 'Yes. We build the APIs, database, sign-in, payments and an admin panel for your team, or connect the app to the systems you already use, such as your website, CRM or ERP.'],
                ['q' => 'What support do you offer after launch?', 'a' => 'We offer monthly care plans covering OS and library updates, crash monitoring, bug fixes, store policy changes and a bank of hours for new features, so your app keeps working well as phones and platforms change.'],
                ['q' => 'Who owns the app and its code?', 'a' => 'You do. You own the source code, designs, store listings and backend from day one, and we are happy to sign an NDA before we hear your idea.'],
                ['q' => 'Can you take over or rebuild our existing app?', 'a' => 'Yes. We start with an audit of the code, performance and reviews, then recommend whether to improve the current app step by step or rebuild it — always keeping your users, ratings and data safe during the move.'],
            ],

            'cta_heading' => 'MOBILE APPS',
            'cta_button' => 'Start your app',
        ];
    }
}
