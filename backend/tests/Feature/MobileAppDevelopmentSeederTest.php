<?php

namespace Tests\Feature;

use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Models\Page;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\MobileAppDevelopmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/** The standalone Mobile App Development seeder and its "Page sections" admin form. */
class MobileAppDevelopmentSeederTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    private function rows(): array
    {
        return Page::where('slug', 'services')->first()->sections()->where('key', 'rows')->first()->content['items'];
    }

    public function test_it_adds_the_service_and_its_services_row_once_and_keeps_admin_edits(): void
    {
        $before = count($this->rows());
        $this->seed(MobileAppDevelopmentSeeder::class);

        $service = Service::where('slug', 'mobile-app-development')->firstOrFail();
        $this->assertSame(Service::max('sort_order'), $service->sort_order);
        $this->assertNull($service->tile);
        $this->assertCount($before + 1, $this->rows());

        $this->getJson('/api/v1/services/mobile-app-development')->assertOk()
            ->assertJsonPath('data.name', 'Mobile App Development')
            ->assertJsonPath('data.heroLines.0', 'MOBILE APPS')
            ->assertJsonCount(5, 'data.process')
            ->assertJsonCount(3, 'data.packages')
            ->assertJsonPath('data.copy', null);

        // Re-running changes nothing an admin edited and doesn't duplicate the row.
        $service->update(['hero_intro' => 'Edited in the admin']);
        $this->seed(MobileAppDevelopmentSeeder::class);
        $this->assertSame('Edited in the admin', $service->fresh()->hero_intro);
        $this->assertSame(1, Service::where('slug', 'mobile-app-development')->count());
        $this->assertCount($before + 1, $this->rows());
    }

    public function test_page_sections_are_edited_in_the_admin(): void
    {
        $this->seed(MobileAppDevelopmentSeeder::class);
        $this->actingAs(User::first());
        $service = Service::where('slug', 'mobile-app-development')->firstOrFail();

        Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
            ->fillForm([
                'copy.platforms.heading' => "Every store.\nOne crew.",
                'copy.features.items.4.name' => 'Wallet pay',
                'copy.plan.button' => 'Plan my app',
                'copy.features.items.2.icon' => 'shield',
                'copy.included.heading' => 'All switched on',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $copy = $this->getJson('/api/v1/services/mobile-app-development')->json('data.copy');
        $this->assertSame("Every store.\nOne crew.", $copy['platforms']['heading']);
        $this->assertSame('Wallet pay', $copy['features']['items'][4]['name']);
        $this->assertCount(18, $copy['features']['items']);
        $this->assertSame('Plan my app', $copy['plan']['button']);
        $this->assertSame('shield', $copy['features']['items'][2]['icon']);
        $this->assertSame('All switched on', $copy['included']['heading']);
    }
}
