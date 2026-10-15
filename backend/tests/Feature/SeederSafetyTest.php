<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\PageSection;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Re-running the seeder must never undo work done in the admin. */
class SeederSafetyTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_reseeding_keeps_admin_edits_and_deletions(): void
    {
        $studio = PageSection::whereHas('page', fn ($q) => $q->where('slug', 'home'))->where('key', 'studio')->firstOrFail();
        $content = $studio->content;
        $content['badges'][] = 'Web';
        $studio->update(['content' => $content]);

        $deleted = Client::first();
        $deleted->delete();

        $this->seed(DatabaseSeeder::class);

        $this->assertSame(['Strategy', 'Branding', 'Motion', 'Web'], $studio->fresh()->content['badges']);
        $this->assertNull(Client::find($deleted->id));
        $this->assertFalse(Client::where('name', $deleted->name)->exists(), 'A deleted client came back.');
    }
}
