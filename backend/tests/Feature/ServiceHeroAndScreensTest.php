<?php

namespace Tests\Feature;

use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** The optional hero subheading on service pages, and Web Development's "One site. Every screen." copy. */
class ServiceHeroAndScreensTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_subheading_and_screens_copy_are_saved_and_served(): void
    {
        $this->actingAs(User::first());
        $web = Service::where('slug', 'web-development')->firstOrFail();

        $this->getJson('/api/v1/services/web-development')->assertJsonPath('data.heroSubheading', null)->assertJsonPath('data.screens', null);

        Livewire::test(EditService::class, ['record' => $web->getRouteKey()])
            ->fillForm([
                'hero_subheading' => 'Web development agency for fast, responsive websites',
                'screens' => ['eyebrow' => 'Responsive', 'heading' => "One site.\nEvery screen.", 'text' => 'We build responsive websites.'],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->getJson('/api/v1/services/web-development')
            ->assertJsonPath('data.heroSubheading', 'Web development agency for fast, responsive websites')
            ->assertJsonPath('data.screens.heading', "One site.\nEvery screen.")
            ->assertJsonPath('data.screens.text', 'We build responsive websites.');

        // The Screens tab is only on Web Development; the subheading on every service.
        $brand = Service::where('slug', 'brand-identity')->firstOrFail();
        Livewire::test(EditService::class, ['record' => $brand->getRouteKey()])
            ->fillForm(['hero_subheading' => 'Brand identity design'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Brand identity design', $brand->fresh()->hero_subheading);
    }

    public function test_growth_engine_copy_is_saved_and_served(): void
    {
        $this->actingAs(User::first());
        $dm = Service::where('slug', 'digital-marketing')->firstOrFail();

        Livewire::test(EditService::class, ['record' => $dm->getRouteKey()])
            ->fillForm(['engine' => ['heading' => 'One brand. Six channels.', 'text' => 'Six channels, one strategy.']])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->getJson('/api/v1/services/digital-marketing')
            ->assertJsonPath('data.engine.text', 'Six channels, one strategy.')
            ->assertJsonPath('data.screens', null);
    }
}
