<?php

namespace Tests\Feature;

use App\Filament\Resources\PageResource\Pages\EditPage;
use App\Filament\Resources\PostResource\Pages\EditPost;
use App\Filament\Resources\ProjectResource\Pages\EditProject;
use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Filament\Resources\ShowreelItemResource\Pages\EditShowreelItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\ShowreelItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Opening a record in the admin and saving it without changes must leave its
 * content exactly as it was — the forms are partly generated from the data's
 * shape (page sections) or built over nested JSON (services, case studies,
 * post blocks), so this guards against silent reshaping on save.
 */
class AdminRoundTripTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::first());
    }

    /** Keys whose values the form legitimately normalises (none expected). */
    private function assertSameContent(mixed $before, mixed $after, string $label): void
    {
        $this->assertEquals(
            json_decode(json_encode($before), true),
            json_decode(json_encode($after), true),
            "$label changed after an unchanged save",
        );
    }

    public function test_every_page_and_its_section_tabs_survive_an_unchanged_save(): void
    {
        foreach (Page::with('sections')->get() as $page) {
            $before = $page->sections->mapWithKeys(fn ($s) => [$s->key => $s->content])->all();
            Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
                ->call('save')
                ->assertHasNoFormErrors();
            $after = $page->fresh('sections')->sections->mapWithKeys(fn ($s) => [$s->key => $s->content])->all();
            $this->assertSameContent($before, $after, "page {$page->slug}");
        }
    }

    public function test_a_section_tab_edit_is_saved_to_its_section_and_served_by_the_api(): void
    {
        $page = Page::where('slug', 'home')->firstOrFail();

        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->set('data.sections_content.agency.heading', 'Brands We Helped Pop')
            ->set('data.sections_visible.blog', false)
            ->call('save')
            ->assertHasNoFormErrors();

        $sections = $page->fresh('sections')->sections->keyBy('key');
        $this->assertSame('Brands We Helped Pop', $sections['agency']->content['heading']);
        $this->assertFalse($sections['blog']->is_published);

        $api = $this->getJson('/api/v1/pages/home')->assertOk()->json('data.sections');
        $this->assertSame('Brands We Helped Pop', $api['agency']['heading']);
        $this->assertArrayNotHasKey('blog', $api, 'A hidden section is left out of the API.');
    }

    public function test_every_service_survives_an_unchanged_save(): void
    {
        $fields = ['hero_lines', 'overview', 'included', 'process', 'audience', 'insights', 'why_us', 'tools', 'stats', 'packages', 'faqs', 'tile'];
        foreach (Service::all() as $service) {
            $before = $service->only($fields);
            Livewire::test(EditService::class, ['record' => $service->getRouteKey()])->call('save')->assertHasNoFormErrors();
            $this->assertSameContent($before, $service->fresh()->only($fields), "service {$service->slug}");
        }
    }

    public function test_a_service_image_upload_replaces_the_built_in_file(): void
    {
        $service = Service::where('slug', 'motion-graphic')->first();
        Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
            ->assertSee('Video in the player (MP4)')
            ->fillForm(['images.reel-2' => 'https://cms.test/storage/uploads/images/reel.webp'])
            ->call('save')->assertHasNoFormErrors();

        $this->assertSame(
            ['reel-2' => 'https://cms.test/storage/uploads/images/reel.webp'],
            $service->fresh()->imageOverrides(),
        );
        $this->assertSame(
            'https://cms.test/storage/uploads/images/reel.webp',
            $this->getJson('/api/v1/services/motion-graphic')->json('data.images')['reel-2'] ?? null,
        );
    }

    public function test_brand_identity_spots_are_replaced_one_by_one(): void
    {
        $service = Service::where('slug', 'brand-identity')->first();
        Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
            ->assertSee('Brand in the wild')->assertSee('Before photo (left side)')
            ->fillForm(['images.wild-merch' => 'https://cms.test/m.webp', 'images.before' => 'https://cms.test/b.webp'])
            ->call('save')->assertHasNoFormErrors();

        $this->assertSame(
            ['wild-merch' => 'https://cms.test/m.webp', 'before' => 'https://cms.test/b.webp'],
            $this->getJson('/api/v1/services/brand-identity')->json('data.images'),
        );
    }

    public function test_the_digital_marketing_social_account_is_editable(): void
    {
        $service = Service::where('slug', 'digital-marketing')->first();
        Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
            ->assertSee('Account name')->assertSee('Grid tile 2')
            ->fillForm(['social.handle' => 'pixel_popers', 'social.followers' => '12K', 'images.avatar' => 'https://cms.test/a.webp'])
            ->call('save')->assertHasNoFormErrors();

        $api = $this->getJson('/api/v1/services/digital-marketing')->json('data');
        $this->assertSame(['handle' => 'pixel_popers', 'followers' => '12K'], $api['social']);
        $this->assertSame(['avatar' => 'https://cms.test/a.webp'], $api['images']);
    }

    public function test_every_case_study_survives_an_unchanged_save(): void
    {
        $fields = ['cover', 'services', 'categories', 'intro', 'brand', 'results', 'quote', 'story', 'gallery', 'delivered', 'phases', 'team'];
        foreach (Project::all() as $project) {
            $before = $project->only($fields);
            Livewire::test(EditProject::class, ['record' => $project->getRouteKey()])->call('save')->assertHasNoFormErrors();
            $this->assertSameContent($before, $project->fresh()->only($fields), "project {$project->slug}");
        }
    }

    public function test_every_post_survives_an_unchanged_save(): void
    {
        foreach (Post::all() as $post) {
            $before = $post->only(['body', 'cover', 'tags']);
            Livewire::test(EditPost::class, ['record' => $post->getRouteKey()])->call('save')->assertHasNoFormErrors();
            $this->assertSameContent($before, $post->fresh()->only(['body', 'cover', 'tags']), "post {$post->slug}");
        }
    }

    public function test_showreel_posters_survive_an_unchanged_save(): void
    {
        foreach (ShowreelItem::all() as $item) {
            $before = $item->poster;
            Livewire::test(EditShowreelItem::class, ['record' => $item->getRouteKey()])->call('save')->assertHasNoFormErrors();
            $this->assertSameContent($before, $item->fresh()->poster, "showreel {$item->slug}");
        }
    }
}
