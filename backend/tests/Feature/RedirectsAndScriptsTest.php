<?php

namespace Tests\Feature;

use App\Filament\Resources\CustomScriptResource\Pages\CreateCustomScript;
use App\Filament\Resources\CustomScriptResource\Pages\ListCustomScripts;
use App\Filament\Resources\RedirectResource\Pages\CreateRedirect;
use App\Filament\Resources\RedirectResource\Pages\ListRedirects;
use App\Models\CustomScript;
use App\Models\Redirect;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** SEO → Redirects and SEO → Scripts & tags: admin screens, cleanup of what's typed, and the API the website reads. */
class RedirectsAndScriptsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_addresses_are_normalised_however_they_are_pasted(): void
    {
        $this->assertSame('/old-page', Redirect::normalisePath('https://www.pixelpopers.com/Old-Page/?utm=1'));
        $this->assertSame('/old-page', Redirect::normalisePath('old-page/'));
        $this->assertSame('/old-blog/*', Redirect::normalisePath('/old-blog/*'));
        $this->assertSame('/old blog', Redirect::normalisePath('/old%20blog'));
        $this->assertSame('/services', Redirect::normaliseTarget('services'));
        $this->assertSame('https://example.com/x', Redirect::normaliseTarget('https://example.com/x'));
        $this->assertSame('*', CustomScript::normaliseTarget(''));
        $this->assertSame('/about', CustomScript::normaliseTarget('https://www.pixelpopers.com/About/'));
    }

    public function test_a_pasted_list_becomes_redirects(): void
    {
        $parsed = Redirect::parseList("from,to,type\n/a  /services\nhttps://www.pixelpopers.com/b\t/work\t302\n/c\n/d 410\n/e /x 999\n# comment");
        $this->assertSame([
            ['from_path' => '/a', 'to_url' => '/services', 'status_code' => 301],
            ['from_path' => '/b', 'to_url' => '/work', 'status_code' => 302],
            ['from_path' => '/c', 'to_url' => null, 'status_code' => 410],
            ['from_path' => '/d', 'to_url' => null, 'status_code' => 410],
        ], $parsed['rows']);
        $this->assertSame(['from,to,type', '/e /x 999'], $parsed['skipped']);
    }

    public function test_admin_creates_a_redirect_and_the_api_serves_it(): void
    {
        Livewire::test(ListRedirects::class)->assertOk();

        Livewire::test(CreateRedirect::class)
            ->fillForm(['from_path' => 'https://www.pixelpopers.com/Old-Services/', 'status_code' => 301, 'to_url' => 'services'])
            ->call('create')
            ->assertHasNoFormErrors();

        Redirect::create(['from_path' => '/portfolio/*', 'to_url' => '/work', 'status_code' => 301]);
        Redirect::create(['from_path' => '/gone', 'status_code' => 410, 'to_url' => '/ignored']);
        Redirect::create(['from_path' => '/off', 'to_url' => '/', 'status_code' => 301, 'is_active' => false]);

        $this->getJson('/api/v1/redirects')->assertOk()->assertExactJson(['data' => [
            ['from' => '/old-services', 'to' => '/services', 'status' => 301],
            ['from' => '/gone', 'to' => null, 'status' => 410],
            ['from' => '/portfolio/*', 'to' => '/work', 'status' => 301],
        ]]);
    }

    public function test_redirect_form_rejects_duplicates_loops_and_the_home_page(): void
    {
        Redirect::create(['from_path' => '/taken', 'to_url' => '/work', 'status_code' => 301]);

        Livewire::test(CreateRedirect::class)
            ->fillForm(['from_path' => '/Taken/', 'status_code' => 301, 'to_url' => '/about'])
            ->call('create')->assertHasFormErrors(['from_path']);
        Livewire::test(CreateRedirect::class)
            ->fillForm(['from_path' => '/loop', 'status_code' => 301, 'to_url' => '/loop/'])
            ->call('create')->assertHasFormErrors(['to_url']);
        Livewire::test(CreateRedirect::class)
            ->fillForm(['from_path' => 'https://www.pixelpopers.com/', 'status_code' => 301, 'to_url' => '/about'])
            ->call('create')->assertHasFormErrors(['from_path']);
        Livewire::test(CreateRedirect::class)
            ->fillForm(['from_path' => '/never-existed', 'status_code' => 410])
            ->call('create')->assertHasNoFormErrors();
    }

    public function test_add_many_upserts_from_a_pasted_list(): void
    {
        Redirect::create(['from_path' => '/a', 'to_url' => '/old', 'status_code' => 302]);

        Livewire::test(ListRedirects::class)
            ->callAction('addMany', ['list' => "/a /services\n/b /work 302\n/c"])
            ->assertHasNoActionErrors();

        $this->assertSame(3, Redirect::count());
        $this->assertSame(['/services', 301], [Redirect::firstWhere('from_path', '/a')->to_url, Redirect::firstWhere('from_path', '/a')->status_code]);
        $this->assertSame(410, Redirect::firstWhere('from_path', '/c')->status_code);
    }

    public function test_admin_adds_scripts_for_every_page_and_for_one_page(): void
    {
        Livewire::test(ListCustomScripts::class)->assertOk();
        Livewire::test(CreateCustomScript::class)->assertOk();

        Livewire::test(CreateCustomScript::class)
            ->fillForm(['name' => 'Hotjar', 'target' => '*', 'location' => 'head', 'code' => '<script>window.hj=1</script>'])
            ->call('create')->assertHasNoFormErrors();
        Livewire::test(CreateCustomScript::class)
            ->fillForm(['name' => 'About schema', 'target' => '/about', 'location' => 'body', 'code' => '<script type="application/ld+json">{}</script>'])
            ->call('create')->assertHasNoFormErrors();
        CustomScript::create(['name' => 'Off', 'target' => '*', 'location' => 'head', 'code' => '<script></script>', 'is_active' => false]);

        $this->getJson('/api/v1/scripts')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.target', '*')
            ->assertJsonPath('data.0.code', '<script>window.hj=1</script>')
            ->assertJsonPath('data.1.target', '/about')
            ->assertJsonPath('data.1.location', 'body');
    }

    public function test_saving_drops_the_cached_api_response(): void
    {
        $this->getJson('/api/v1/redirects')->assertExactJson(['data' => []]);
        Redirect::create(['from_path' => '/x', 'to_url' => '/y', 'status_code' => 301]);
        $this->getJson('/api/v1/redirects')->assertJsonCount(1, 'data');
    }
}
