<?php

namespace Database\Seeders;

use App\Filament\Support\ContentForm;
use App\Models\Client;
use App\Models\Comment;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\ShowreelItem;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Seeds the CMS with the site's current content, exported from the Next.js
 * app by scripts/export-frontend-content.mjs into data/content.json.
 *
 * Safe to re-run: it never changes or restores anything edited in the
 * admin. Pages and their sections only gain entries that are missing (so a
 * section added to the website later shows up in the CMS); every other
 * collection is seeded only while its table is still empty, so deleted items
 * don't come back; settings only fill keys that have no value yet.
 */
class DatabaseSeeder extends Seeder
{
    /** @var array<string, mixed> */
    private array $data;

    public function run(): void
    {
        $this->data = json_decode(file_get_contents(__DIR__.'/data/content.json'), true, flags: JSON_THROW_ON_ERROR);

        $this->seedAdmin();
        $this->seedSettings();
        $this->seedPages();
        $this->seedServices();
        $this->seedProjects();
        $this->seedShowreel();
        $this->seedClients();
        $this->seedTestimonials();
        $team = $this->seedTeam();
        $this->seedBlog($team);
    }

    private function seedAdmin(): void
    {
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@pixelpopers.com')],
            ['name' => env('ADMIN_NAME', 'Pixel Popers Admin'), 'password' => env('ADMIN_PASSWORD', 'ChangeMe123!')],
        );
    }

    private function seedSettings(): void
    {
        $defaults = $this->data['settings'] + [
            'site_keywords' => 'creative agency, brand identity, UI/UX design, web development, motion design, digital marketing, content writing',
            'default_og_image' => '/opengraph-image',
            'company_phone' => '',
            'company_address' => '',
            'company_hours' => 'Mon – Fri · Remote-first studio',
            'social_instagram' => 'https://instagram.com/',
            'social_behance' => 'https://behance.net/',
            'social_linkedin' => 'https://linkedin.com/',
            'social_dribbble' => 'https://dribbble.com/',
            'footer_tagline' => 'A funky creative studio making brands impossible to scroll past — from strategy to the last pixel.',
            'availability_label' => 'Available for new projects',
            'smtp_mailer' => 'smtp',
            'smtp_port' => 587,
            'smtp_encryption' => 'tls',
            'notify_on_contact' => true,
            'notify_on_comment' => true,
        ];

        foreach ($defaults as $key => $value) {
            if (Setting::get($key) === null) {
                Setting::set($key, $value);
            }
        }
    }

    private function seedPages(): void
    {
        foreach ($this->data['pages'] as $order => $page) {
            $record = Page::firstOrCreate(['slug' => $page['slug']], [
                'title' => $page['title'],
                'seo_title' => $page['seo_title'] ?? null,
                'seo_description' => $page['seo_description'] ?? null,
                'sort_order' => $order,
                'is_published' => true,
            ]);

            foreach ($page['sections'] as $sectionOrder => $section) {
                PageSection::firstOrCreate(['page_id' => $record->id, 'key' => $section['key']], [
                    'label' => $section['label'],
                    'content' => $section['content'],
                    'schema' => ContentForm::infer($section['content']),
                    'sort_order' => $sectionOrder,
                    'is_published' => true,
                ]);
            }
        }
    }

    private function seedServices(): void
    {
        if (Service::exists()) {
            return;
        }

        foreach ($this->data['services'] as $order => $s) {
            Service::firstOrCreate(['slug' => $s['slug']], [
                'name' => $s['name'],
                'accent' => $s['accent'],
                'hero_lines' => $s['heroLines'],
                'hero_intro' => $s['heroIntro'],
                'hero_cta' => $s['heroCta'],
                'meta_title' => $s['metaTitle'],
                'meta_description' => $s['metaDescription'],
                'overview' => $s['overview'],
                'included' => $s['included'],
                'process' => $s['process'],
                'audience' => $s['audience'],
                'insights' => $s['insights'],
                'why_us' => $s['whyUs'],
                'tools' => $s['tools'],
                'stats' => $s['stats'],
                'packages' => $s['packages'],
                'faqs' => $s['faqs'],
                'cta_heading' => $s['ctaHeading'],
                'cta_button' => $s['ctaButton'],
                'tile' => $s['tile'] ? Arr::except($s['tile'], ['id', 'title']) : null,
                'sort_order' => $order,
            ]);
        }
    }

    private function seedProjects(): void
    {
        if (Project::exists()) {
            return;
        }

        foreach ($this->data['projects'] as $order => $p) {
            Project::firstOrCreate(['slug' => $p['slug']], [
                'name' => $p['name'],
                'client' => $p['client'],
                'year' => $p['year'],
                'month' => $p['month'],
                'tagline' => $p['tagline'],
                'discipline' => $p['discipline'],
                'accent' => $p['accent'],
                'description' => $p['description'],
                'featured' => (bool) ($p['featured'] ?? false),
                'timeline' => $p['timeline'],
                'sticker' => $p['sticker'],
                'cover' => $p['cover'],
                'cover_bg' => $p['coverBg'],
                'services' => $p['services'],
                'categories' => $p['categories'],
                'intro' => $p['intro'],
                'brand' => $p['brand'],
                'results' => $p['results'],
                'quote' => $p['quote'],
                'story' => $p['story'],
                'gallery' => $p['gallery'],
                'gallery_heading' => $p['galleryHeading'],
                'delivered' => $p['delivered'],
                'phases' => $p['phases'],
                'team' => $p['team'],
                'sort_order' => $order,
            ]);
        }
    }

    private function seedShowreel(): void
    {
        if (ShowreelItem::exists()) {
            return;
        }

        foreach ($this->data['showreel'] as $order => $item) {
            ShowreelItem::firstOrCreate(['slug' => $item['id']], [
                'title' => $item['title'],
                'video' => $item['video'],
                'poster' => $item['poster'] ?? null,
                'sort_order' => $order,
            ]);
        }
    }

    private function seedClients(): void
    {
        if (Client::exists()) {
            return;
        }

        foreach ($this->data['clients'] as $order => $c) {
            Client::firstOrCreate(['name' => $c['name']], [
                'logo' => $c['src'],
                'width' => $c['width'],
                'height' => $c['height'],
                'tint' => $c['tint'] ?? null,
                'rotate' => $c['rotate'],
                'sort_order' => $order,
            ]);
        }
    }

    private function seedTestimonials(): void
    {
        if (Testimonial::exists()) {
            return;
        }

        foreach ($this->data['testimonials'] as $order => $t) {
            Testimonial::firstOrCreate(['company' => $t['company'], 'role' => $t['role']], [
                'quote' => $t['quote'],
                'initial' => $t['initial'],
                'tone' => $t['tone'],
                'sort_order' => $order,
            ]);
        }
    }

    /** @return array<string, int> team member ids by name */
    private function seedTeam(): array
    {
        if (TeamMember::exists()) {
            return TeamMember::pluck('id', 'name')->all();
        }

        $ids = [];
        foreach ($this->data['team'] as $order => $m) {
            $ids[$m['name']] = TeamMember::firstOrCreate(['name' => $m['name']], [
                'role' => $m['role'],
                'avatar' => $m['avatar'],
                'accent' => $m['accent'],
                'rotate' => $m['rotate'],
                'bio_short' => $m['bio_short'],
                'bio_long' => $m['bio_long'],
                'sort_order' => $order,
            ])->id;
        }

        return $ids;
    }

    /** @param  array<string, int>  $team */
    private function seedBlog(array $team): void
    {
        if (Post::exists() || PostCategory::exists()) {
            return;
        }

        $categories = [];
        foreach ($this->data['categories'] as $order => $c) {
            $categories[$c['name']] = PostCategory::firstOrCreate(['name' => $c['name']], [
                'slug' => Str::slug($c['name']),
                'tone' => $c['tone'],
                'sort_order' => $order,
            ])->id;
        }

        foreach ($this->data['posts'] as $p) {
            $post = Post::firstOrCreate(['slug' => $p['slug']], [
                'title' => $p['title'],
                'post_category_id' => $categories[$p['category']] ?? null,
                'author_id' => $team[$p['author']] ?? null,
                'published_at' => $p['date'],
                'read_time' => $p['readTime'],
                'cover' => $p['cover'],
                'excerpt' => $p['excerpt'],
                'description' => $p['description'],
                'tags' => $p['tags'],
                'featured' => (bool) ($p['featured'] ?? false),
                'body' => $p['body'],
            ]);

            foreach ($p['comments'] as $c) {
                Comment::firstOrCreate(['post_id' => $post->id, 'name' => $c['name'], 'body' => $c['text']], [
                    'tone' => $c['tone'],
                    'display_when' => $c['when'],
                    'is_approved' => true,
                ]);
            }
        }
    }
}
