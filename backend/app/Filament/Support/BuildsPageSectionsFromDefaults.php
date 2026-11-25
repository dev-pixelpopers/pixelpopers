<?php

namespace App\Filament\Support;

use Filament\Schemas\Components as SchemaComponents;
use Illuminate\Support\Str;

/**
 * Builds a bespoke service page's whole "Page sections" form from its
 * DEFAULTS (the design's own words, mirrored from the page's copy.ts on the
 * website), so every word on the page gets a field without a hand-written form:
 *
 * - each top-level key is a collapsible section (titled by SECTIONS);
 * - each text is a field showing the design's wording as its placeholder
 *   (long text and anything with line breaks becomes a textarea);
 * - each list is a fixed number of small groups, one per item in the design;
 * - nested groups (e.g. a mock-up's labels) become a titled fieldset.
 *
 * Using classes define DEFAULTS and SECTIONS (key => title), and may define
 * NOTES (section key => description) and LABELS (field key => label).
 * Everything saves under `copy`; empty fields keep the design's wording.
 */
trait BuildsPageSectionsFromDefaults
{
    use BuildsPageSectionFields;

    public static function schema(): array
    {
        $notes = defined(static::class.'::NOTES') ? static::NOTES : [];
        $out = [
            SchemaComponents\Text::make('Every word in this page’s design sections. Each box shows the design’s wording in grey — leave it empty to keep that, or type to replace it. Photos are on the Images tab; process steps, packages and FAQs on their own tabs.'),
        ];

        foreach (static::DEFAULTS as $key => $value) {
            $section = self::section(static::SECTIONS[$key] ?? self::human($key), self::fieldsFor($key, $value), collapsed: true);
            if (isset($notes[$key])) {
                $section->description($notes[$key]);
            }
            $out[] = $section;
        }

        return $out;
    }

    private static function fieldsFor(string $path, array $value): array
    {
        $fields = [];
        foreach ($value as $key => $item) {
            $key = (string) $key;
            $at = "$path.$key";

            if (is_string($item)) {
                $label = self::label($key);
                $long = str_contains($item, "\n") || mb_strlen($item) > 70 || in_array($key, ['text', 'body', 'description', 'caption'], true);
                $field = $long
                    ? self::area($at, $label, 'copy', str_contains($item, "\n") || mb_strlen($item) < 120 ? 2 : 3)->columnSpanFull()
                    : self::input($at, $label);
                if ($key === 'heading') {
                    $field->helperText('Each line shows on its own line.');
                }
                if ($key === 'text') {
                    $field->helperText('Shown with the section (only when it has words).');
                }
                $fields[] = $field;
            } elseif (is_array($item) && array_is_list($item)) {
                foreach ($item as $i => $entry) {
                    $fields[] = SchemaComponents\Fieldset::make(self::itemName($key).' '.($i + 1))
                        ->columns(min(3, max(1, count($entry))))
                        ->columnSpanFull()
                        ->schema(self::fieldsFor("$at.$i", $entry));
                }
            } elseif (is_array($item)) {
                $fields[] = SchemaComponents\Fieldset::make(self::label($key))
                    ->columns(2)
                    ->columnSpanFull()
                    ->schema(self::fieldsFor($at, $item));
            }
        }

        return $fields;
    }

    private static function label(string $key): string
    {
        $labels = defined(static::class.'::LABELS') ? static::LABELS : [];

        return $labels[$key] ?? match ($key) {
            'text' => 'Description',
            'alt' => 'Image description (alt text)',
            default => self::human($key),
        };
    }

    /** "swatches" → "Swatch", "stories" → "Story". */
    private static function itemName(string $key): string
    {
        return Str::singular(self::human($key));
    }

    /** "bookLink" → "Book link". */
    private static function human(string $key): string
    {
        return Str::ucfirst(Str::lower(Str::headline($key)));
    }
}
