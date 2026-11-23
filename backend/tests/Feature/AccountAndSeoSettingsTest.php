<?php

namespace Tests\Feature;

use App\Filament\Pages\SiteSettings;
use App\Filament\Resources\PageResource\Pages\EditPage;
use App\Models\Page;
use App\Models\User;
use Filament\Auth\Pages\EditProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;
use Tests\TestCase;

/** The account page (change password) and the SEO settings screens. */
class AccountAndSeoSettingsTest extends TestCase
{
    use RefreshDatabase;

    /** Seeded like the other admin tests (the test database is migrated once per run). */
    protected bool $seed = true;

    public function test_an_admin_can_change_their_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old-password-1')]);
        $this->actingAs($user);

        Livewire::test(EditProfile::class)
            ->fillForm([
                'currentPassword' => 'old-password-1',
                'password' => 'new-password-2',
                'passwordConfirmation' => 'new-password-2',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertTrue(Hash::check('new-password-2', $user->fresh()->password));
        $this->assertTrue(Auth::check());
    }

    public function test_the_current_password_is_required_to_change_it(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old-password-1')]);
        $this->actingAs($user);

        Livewire::test(EditProfile::class)
            ->fillForm(['currentPassword' => 'wrong', 'password' => 'new-password-2', 'passwordConfirmation' => 'new-password-2'])
            ->call('save')
            ->assertHasFormErrors(['currentPassword']);

        $this->assertTrue(Hash::check('old-password-1', $user->fresh()->password));
    }

    public function test_seo_screens_render(): void
    {
        $this->actingAs(User::first());

        Livewire::test(SiteSettings::class)->assertOk()->assertSee('Fallback page title');
        Livewire::test(EditPage::class, ['record' => Page::where('slug', 'home')->first()->getRouteKey()])
            ->assertOk()->assertSee('home page’s own tags', false);
    }
}
