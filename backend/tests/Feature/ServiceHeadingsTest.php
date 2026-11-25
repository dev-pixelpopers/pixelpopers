<?php

namespace Tests\Feature;

use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** Services → <service> → Section headings: the shared blocks' headings, per service. */
class ServiceHeadingsTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_every_service_can_reword_its_shared_headings(): void
    {
        $this->actingAs(User::first());

        foreach (['brand-identity', 'web-development'] as $slug) {
            $service = Service::where('slug', $slug)->firstOrFail();
            $this->getJson("/api/v1/services/$slug")->assertJsonPath('data.headings', null);

            Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
                ->fillForm([
                    'headings.included.heading' => "All of it,\nin one box",
                    'headings.packages.button' => 'Book a call',
                    'headings.faqs.eyebrow' => 'Questions',
                    'headings.cta.text' => 'Say hello.',
                ])
                ->call('save')
                ->assertHasNoFormErrors();

            $this->getJson("/api/v1/services/$slug")
                ->assertJsonPath('data.headings.included.heading', "All of it,\nin one box")
                ->assertJsonPath('data.headings.packages.button', 'Book a call')
                ->assertJsonPath('data.headings.faqs.eyebrow', 'Questions')
                ->assertJsonPath('data.headings.cta.text', 'Say hello.');
        }

        // Each service keeps its own wording.
        $this->assertNull(Service::where('slug', 'motion-graphic')->first()->headings);
    }
}
