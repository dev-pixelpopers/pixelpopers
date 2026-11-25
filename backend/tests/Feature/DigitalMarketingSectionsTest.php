<?php

namespace Tests\Feature;

use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** Services → Digital Marketing → Page sections: every design section's words. */
class DigitalMarketingSectionsTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_section_copy_is_saved_and_served_with_list_positions_kept(): void
    {
        $this->actingAs(User::first());
        $dm = Service::where('slug', 'digital-marketing')->firstOrFail();

        $this->getJson('/api/v1/services/digital-marketing')->assertJsonPath('data.copy', null);

        Livewire::test(EditService::class, ['record' => $dm->getRouteKey()])
            ->fillForm([
                'engine.channels.1.name' => 'Search',
                'copy.funnel.stages.2.result' => '15K leads',
                'copy.social.text' => 'Social description.',
                'copy.results.stickers.0.value' => '+200%',
                'copy.seo.subheading' => 'SEO services heading',
                'copy.seo.text' => 'SEO description.',
                'copy.ads.stories.3.cta' => 'Visit now',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $data = $this->getJson('/api/v1/services/digital-marketing')->assertOk()->json('data');

        // Untouched items stay as empty placeholders so later items keep their place.
        $this->assertSame('Search', $data['engine']['channels'][1]['name']);
        $this->assertSame('15K leads', $data['copy']['funnel']['stages'][2]['result']);
        $this->assertCount(5, $data['copy']['funnel']['stages']);
        $this->assertSame('+200%', $data['copy']['results']['stickers'][0]['value']);
        $this->assertSame('Social description.', $data['copy']['social']['text']);
        $this->assertSame('SEO services heading', $data['copy']['seo']['subheading']);
        $this->assertSame('Visit now', $data['copy']['ads']['stories'][3]['cta']);
    }

    public function test_the_tab_is_only_on_digital_marketing(): void
    {
        $this->actingAs(User::first());
        $web = Service::where('slug', 'web-development')->firstOrFail();

        Livewire::test(EditService::class, ['record' => $web->getRouteKey()])
            ->assertDontSee('Feeds that actually pop')
            ->call('save')->assertHasNoFormErrors();
        $this->assertNull($web->fresh()->copy);
    }
}
