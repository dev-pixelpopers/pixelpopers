<?php

namespace Tests\Feature;

use App\Filament\Resources\ServiceResource\Pages\EditService;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Every bespoke service page's "Page sections" form (built from its DEFAULTS)
 * saves a top-level text, a nested text and a list item, and the API serves them.
 */
class ServicePageSectionsTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public static function pages(): array
    {
        return [
            'brand identity' => ['brand-identity', \App\Filament\Support\BrandIdentitySections::class],
            'ui/ux design' => ['ui-ux-design', \App\Filament\Support\UiUxSections::class],
            'web development' => ['web-development', \App\Filament\Support\WebDevelopmentSections::class],
            'motion graphic' => ['motion-graphic', \App\Filament\Support\MotionGraphicSections::class],
            'content writing' => ['content-writing', \App\Filament\Support\ContentWritingSections::class],
        ];
    }

    #[DataProvider('pages')]
    public function test_every_field_group_saves(string $slug, string $form): void
    {
        $this->actingAs(User::first());
        $service = Service::where('slug', $slug)->firstOrFail();

        // One string field, and one field inside the first list found, from the form's own defaults.
        [$plain, $listed] = self::samplePaths($form::DEFAULTS);
        $this->assertNotNull($plain);
        $this->assertNotNull($listed);

        Livewire::test(EditService::class, ['record' => $service->getRouteKey()])
            ->fillForm(["copy.$plain" => 'Plain edit', "copy.$listed" => 'List edit'])
            ->call('save')
            ->assertHasNoFormErrors();

        $copy = $this->getJson("/api/v1/services/$slug")->assertOk()->json('data.copy');
        $this->assertSame('Plain edit', data_get($copy, $plain));
        $this->assertSame('List edit', data_get($copy, $listed));
    }

    /** @return array{0: ?string, 1: ?string} */
    private static function samplePaths(array $defaults): array
    {
        $plain = $listed = null;
        $walk = function (array $node, string $path, bool $inList) use (&$walk, &$plain, &$listed): void {
            foreach ($node as $key => $value) {
                $at = $path === '' ? (string) $key : "$path.$key";
                if (is_string($value)) {
                    if ($inList) {
                        $listed ??= $at;
                    } elseif (substr_count($at, '.') >= 1) {
                        $plain ??= $at;
                    }
                } elseif (is_array($value)) {
                    $walk($value, $at, $inList || array_is_list($value));
                }
            }
        };
        $walk($defaults, '', false);

        return [$plain, $listed];
    }
}
