<?php

namespace App\Filament\Support;

use Filament\Forms;
use Filament\Schemas\Components as SchemaComponents;

/**
 * Field builders for a bespoke service page's "Page sections" admin tab
 * (DigitalMarketingSections, MobileAppSections).
 *
 * The using class defines DEFAULTS: the design's own words, mirrored from the
 * page's copy.ts on the website. Each field shows its default as a grey
 * placeholder, and a field left empty keeps it. Fields save under `copy.*`
 * unless a store is named (the digital marketing growth engine saves to
 * `engine.*`). Lists are fixed-length, one small group per item.
 */
trait BuildsPageSectionFields
{
    /** The design default for a dotted key inside DEFAULTS, e.g. "funnel.stages.0.stage". */
    public static function default(string $key): string
    {
        return (string) data_get(static::DEFAULTS, $key, '');
    }

    /** Eyebrow, heading and description (plus an optional description heading) for one section. */
    protected static function titleFields(string $key, string $store = 'copy', bool $withSubheading = false): array
    {
        return array_values(array_filter([
            self::input("$key.eyebrow", 'Eyebrow', $store),
            self::area("$key.heading", 'Heading', $store, 2)->helperText('Each line shows on its own line.'),
            $withSubheading ? self::input("$key.subheading", 'Description heading', $store)->columnSpanFull() : null,
            self::area("$key.text", 'Description', $store, 4)->columnSpanFull()
                ->helperText('Shown with the section (only when it has words).'),
        ]));
    }

    /** One fixed list as a small group per item. */
    protected static function items(string $key, int $count, string $noun, array $fields, string $store = 'copy'): array
    {
        $out = [];
        for ($i = 0; $i < $count; $i++) {
            $out[] = SchemaComponents\Fieldset::make("$noun ".($i + 1))
                ->columns(count($fields) > 2 ? 3 : count($fields))
                ->columnSpanFull()
                ->schema(array_map(
                    fn ($f, $label) => self::input("$key.$i.$f", $label, $store),
                    array_keys($fields),
                    $fields,
                ));
        }

        return $out;
    }

    protected static function section(string $title, array $schema, bool $collapsed = false): SchemaComponents\Section
    {
        return SchemaComponents\Section::make($title)->collapsible()->collapsed($collapsed)->columns(2)->schema($schema);
    }

    protected static function input(string $key, string $label, string $store = 'copy'): Forms\Components\TextInput
    {
        return Forms\Components\TextInput::make(self::path($key, $store))->label($label)
            ->placeholder(self::default($key))->maxLength(300);
    }

    protected static function area(string $key, string $label, string $store = 'copy', int $rows = 3): Forms\Components\Textarea
    {
        return Forms\Components\Textarea::make(self::path($key, $store))->label($label)->rows($rows)
            ->placeholder(self::default($key));
    }

    /**
     * Where a field saves: under `copy` by default; `headings` puts it under
     * `headings`; any other store (e.g. `engine`) is the key's own first part.
     */
    private static function path(string $key, string $store): string
    {
        return match ($store) {
            'copy', 'headings' => "$store.$key",
            default => $key,
        };
    }
}
