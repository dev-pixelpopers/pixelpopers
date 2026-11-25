<?php

namespace Tests\Feature;

use App\Filament\Pages\Navigation as NavigationPage;
use App\Filament\Resources\PageResource\Pages\CreatePage;
use App\Filament\Resources\PageResource\Pages\EditPage;
use App\Filament\Resources\PageResource\Pages\ListPages;
use App\Models\Page;
use App\Models\User;
use App\Support\Navigation;
use App\Support\SectionLibrary;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** "Duplicate" on pages, and the menus (Settings → Navigation + each page's switches). */
class DuplicateAndNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::first());
    }

    public function test_a_site_page_is_duplicated_into_a_new_page(): void
    {
        $contact = Page::where('slug', 'contact')->first();
        $contact->sections()->where('key', 'where_when')->update(['is_published' => false]);

        Livewire::test(ListPages::class)
            ->callTableAction('duplicate', $contact, ['title' => 'Contact London', 'slug' => 'contact-london', 'published' => true])
            ->assertHasNoTableActionErrors();

        $copy = Page::where('slug', 'contact-london')->firstOrFail();
        $this->assertTrue($copy->is_custom);
        $this->assertTrue($copy->is_published);
        $this->assertNull($copy->seo_title);
        $this->assertSame($contact->seo_description, $copy->seo_description);
        // Every section that works on its own, same order, labels and show/hide; the form's field copy and info stay behind.
        $expected = $contact->sections->filter(fn ($s) => SectionLibrary::typeOf($s))->values();
        $this->assertSame($expected->pluck('label')->all(), $copy->sections->pluck('label')->all());
        $this->assertSame($expected->pluck('content')->all(), $copy->sections->pluck('content')->all());
        $this->assertFalse($copy->sections->firstWhere('type', 'contact:where_when')->is_published);
        $this->assertNotContains('contact:form', $copy->sections->pluck('type')->all());

        // Editing the copy leaves the original alone.
        $copy->sections->first()->update(['content' => ['lines' => ['Changed']]]);
        $this->assertNotSame(['lines' => ['Changed']], $contact->sections()->first()->content);
    }

    public function test_a_built_page_is_duplicated_from_its_edit_screen_and_addresses_are_checked(): void
    {
        $page = Page::create(['slug' => 'landing', 'title' => 'Landing', 'is_custom' => true]);
        SectionLibrary::copyTo($page, Page::where('slug', 'services')->first()->sections()->where('key', 'faq')->first());

        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->callAction('duplicate', ['title' => 'Landing B', 'slug' => 'landing'])
            ->assertHasActionErrors(['slug']);
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->callAction('duplicate', ['title' => 'Landing B', 'slug' => 'landing-b'])
            ->assertHasNoActionErrors()
            ->assertRedirect();

        $this->assertSame(['faq'], Page::where('slug', 'landing-b')->first()->sections->pluck('key')->all());
        $this->assertFalse(Page::where('slug', 'landing-b')->first()->is_published);
        Livewire::test(EditPage::class, ['record' => Page::where('slug', 'home')->first()->getRouteKey()])->assertActionHidden('duplicate');
    }

    public function test_menus_start_as_the_original_links_and_are_edited_on_the_navigation_screen(): void
    {
        $this->assertSame(['home', 'work', 'services', 'about', 'blog', 'contact'], array_column(Navigation::items('nav_main'), 'page'));

        $page = Page::create(['slug' => 'pricing', 'title' => 'Pricing', 'is_custom' => true]);
        Livewire::test(NavigationPage::class)->assertOk()
            ->fillForm([
                'nav_main' => [
                    ['kind' => 'page', 'page' => 'pricing', 'label' => 'Our prices', 'pill' => 'New', 'new_tab' => false],
                    ['kind' => 'link', 'url' => 'https://dribbble.com/pixelpopers', 'label' => 'Dribbble', 'new_tab' => true],
                    ['kind' => 'page', 'page' => 'contact', 'label' => null],
                ],
                'nav_footer' => [['kind' => 'link', 'url' => '/about#studio', 'label' => 'Studio']],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $site = $this->getJson('/api/v1/site')->json('data');
        $this->assertSame([
            ['page' => 'pricing', 'url' => null, 'label' => 'Our prices', 'pill' => 'New', 'new_tab' => false],
            ['page' => null, 'url' => 'https://dribbble.com/pixelpopers', 'label' => 'Dribbble', 'pill' => null, 'new_tab' => true],
            ['page' => 'contact', 'url' => null, 'label' => null, 'pill' => null, 'new_tab' => false],
        ], $site['nav_main']);
        $this->assertSame('/about#studio', $site['nav_footer'][0]['url']);

        Livewire::test(NavigationPage::class)->fillForm(['nav_main' => [['kind' => 'link', 'url' => 'no-slash', 'label' => 'X']]])
            ->call('save')->assertHasFormErrors();
        Livewire::test(NavigationPage::class)->call('resetMenus');
        $this->assertSame(Navigation::DEFAULTS['nav_main'], Navigation::items('nav_main'));
    }

    public function test_a_pages_switches_add_it_to_the_menus_and_its_links_follow_renames_and_deletion(): void
    {
        Livewire::test(CreatePage::class)
            ->fillForm(['title' => 'Pricing', 'slug' => 'pricing', 'nav_in_main' => true, 'nav_in_footer' => true, 'nav_label' => 'Prices'])
            ->call('create')->assertHasNoFormErrors();
        $this->assertSame(['page' => 'pricing', 'label' => 'Prices'], array_intersect_key(collect(Navigation::items('nav_main'))->last(), ['page' => 1, 'label' => 1]));
        $this->assertTrue(Navigation::contains('nav_footer', 'pricing'));

        $page = Page::where('slug', 'pricing')->first();
        Livewire::test(EditPage::class, ['record' => $page->getRouteKey()])
            ->assertFormSet(['nav_in_main' => true, 'nav_in_footer' => true, 'nav_label' => 'Prices'])
            ->fillForm(['slug' => 'our-prices', 'nav_in_footer' => false])
            ->call('save')->assertHasNoFormErrors();
        $this->assertTrue(Navigation::contains('nav_main', 'our-prices'));
        $this->assertFalse(Navigation::contains('nav_main', 'pricing'));
        $this->assertFalse(Navigation::contains('nav_footer', 'our-prices'));
        // Everything else in the menus is untouched.
        $this->assertSame(['home', 'work', 'services', 'about', 'blog', 'contact', 'our-prices'], array_column(Navigation::items('nav_main'), 'page'));

        $page->fresh()->delete();
        $this->assertFalse(Navigation::contains('nav_main', 'our-prices'));
        $this->assertCount(6, Navigation::items('nav_main'));

        // A site page can be taken out of the menu too.
        $about = Page::where('slug', 'about')->first();
        Livewire::test(EditPage::class, ['record' => $about->getRouteKey()])
            ->assertFormSet(['nav_in_main' => true])
            ->fillForm(['nav_in_main' => false])->call('save')->assertHasNoFormErrors();
        $this->assertFalse(Navigation::contains('nav_main', 'about'));
        $this->assertTrue(Navigation::contains('nav_footer', 'about'));
    }
}
