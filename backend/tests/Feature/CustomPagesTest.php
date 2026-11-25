<?php

namespace Tests\Feature;

use App\Filament\Resources\PageResource\Pages\CreatePage;
use App\Filament\Resources\PageResource\Pages\EditPage;
use App\Filament\Resources\PageResource\Pages\ListPages;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use App\Support\SectionLibrary;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** Pages built in the CMS from sections copied off other pages. */
class CustomPagesTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::first());
    }

    private function section(string $page, string $key): PageSection
    {
        return Page::where('slug', $page)->firstOrFail()->sections()->where('key', $key)->firstOrFail();
    }

    public function test_every_offered_section_type_exists_on_the_site(): void
    {
        foreach (array_keys(SectionLibrary::TYPES) as $type) {
            [$page, $key] = explode(':', $type);
            $this->assertNotNull(Page::where('slug', $page)->first()?->sections()->where('key', $key)->first(), "$type has no section to copy");
        }
        $offered = collect(SectionLibrary::sources())->flatten()->count();
        $this->assertSame(count(SectionLibrary::TYPES), $offered);
    }

    public function test_a_new_page_starts_with_a_whole_page_plus_single_sections(): void
    {
        Livewire::test(ListPages::class)->assertOk();
        Livewire::test(CreatePage::class)->assertOk()
            ->fillForm([
                'title' => 'Web design in London',
                'slug' => 'web-design-london',
                'is_published' => true,
                'copy_page' => Page::where('slug', 'contact')->value('id'),
                'copy_sections' => [$this->section('services', 'faq')->id, $this->section('about', 'values')->id],
                'seo_title' => 'Web design in London | Pixel Popers',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $page = Page::where('slug', 'web-design-london')->firstOrFail();
        $this->assertTrue($page->is_custom);
        $contactKeys = Page::where('slug', 'contact')->first()->sections->filter(fn ($s) => SectionLibrary::typeOf($s))->pluck('key')->map(fn ($k) => str_replace('_', '-', $k))->all();
        $this->assertSame([...$contactKeys, 'faq', 'values'], $page->sections->pluck('key')->all());
        $this->assertSame($this->section('services', 'faq')->content, $page->sections->firstWhere('key', 'faq')->content);

        $json = $this->getJson('/api/v1/pages/web-design-london')->assertOk()->json('data');
        $this->assertTrue($json['custom']);
        $this->assertSame('services:faq', collect($json['blocks'])->firstWhere('key', 'faq')['type']);
        $this->assertSame(Page::where('slug', 'contact')->first()->sections->first()->content, $json['blocks'][0]['content']);
        $this->assertTrue(collect($this->getJson('/api/v1/pages')->json('data'))->firstWhere('slug', 'web-design-london')['custom']);
        $this->assertContains('/web-design-london', collect($this->getJson('/api/v1/sitemap')->json('data'))->pluck('path')->all());
    }

    public function test_addresses_of_the_sites_own_pages_and_bad_slugs_are_refused(): void
    {
        foreach (['about', 'Has Spaces', 'api', 'contact'] as $slug) {
            Livewire::test(CreatePage::class)
                ->fillForm(['title' => 'X', 'slug' => $slug])
                ->call('create')
                ->assertHasFormErrors(['slug']);
        }
    }

    public function test_copied_content_is_edited_independently_and_sections_can_be_added_arranged_and_removed(): void
    {
        $page = Page::create(['slug' => 'landing', 'title' => 'Landing', 'is_custom' => true]);
        SectionLibrary::copyTo($page, $this->section('services', 'faq'));
        $original = $this->section('services', 'faq')->content;

        // Edit the copy: the original stays as it was.
        $edit = Livewire::test(EditPage::class, ['record' => $page->getRouteKey()]);
        $content = $page->sections()->first()->content;
        $content[array_key_first($content)] = 'Changed on the landing page';
        $edit->fillForm(['sections_content' => ['faq' => $content]])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Changed on the landing page', $page->sections()->first()->content[array_key_first($content)]);
        $this->assertSame($original, $this->section('services', 'faq')->content);

        // Add the same design twice, then a section copied from this page itself.
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->callAction('addSection', ['source' => $this->section('services', 'faq')->id, 'label' => 'Pricing FAQ'])
            ->assertHasNoActionErrors();
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->callAction('addSection', ['source' => $this->section('about', 'cta')->id])
            ->assertHasNoActionErrors();
        $this->assertSame(['faq', 'faq-2', 'cta'], $page->fresh()->sections->pluck('key')->all());
        $this->assertSame('Pricing FAQ', $page->fresh()->sections->firstWhere('key', 'faq-2')->label);

        // Arrange: CTA first, renamed; first FAQ removed.
        $s = $page->fresh()->sections->keyBy('key');
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->callAction('arrange', ['sections' => [
                ['id' => $s['cta']->id, 'label' => 'Get in touch', 'design' => 'x'],
                ['id' => $s['faq-2']->id, 'label' => 'Pricing FAQ', 'design' => 'x'],
            ]])
            ->assertHasNoActionErrors();
        $this->assertSame(['cta', 'faq-2'], $page->fresh()->sections->pluck('key')->all());
        $this->assertSame('Get in touch', $page->fresh()->sections->first()->label);
        $this->assertSame(['about:cta', 'services:faq'], collect($this->getJson('/api/v1/pages/landing')->json('data.blocks'))->pluck('type')->all());
    }

    public function test_only_custom_pages_can_be_deleted_and_their_address_changed(): void
    {
        $about = Page::where('slug', 'about')->first();
        Livewire::test(EditPage::class, ['record' => $about->getRouteKey()])
            ->assertActionHidden('delete')->assertActionHidden('addSection')
            ->call('save')->assertHasNoFormErrors();
        $this->assertSame('about', $about->fresh()->slug);

        $page = Page::create(['slug' => 'old-name', 'title' => 'Promo', 'is_custom' => true]);
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->fillForm(['slug' => 'new-name'])->call('save')->assertHasNoFormErrors()
            ->callAction('delete');
        $this->assertNull(Page::find($page->id));
        $this->getJson('/api/v1/pages/new-name')->assertNotFound();
    }
}
