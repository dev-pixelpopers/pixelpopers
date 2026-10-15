<?php

namespace App\Filament\Support;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Fieldset;
use Illuminate\Support\Str;

/**
 * Builds an admin form from the shape of a piece of content.
 *
 * Page copy comes in dozens of shapes (a hero's lines, a list of values with
 * tilts, FAQ pairs, stats…). Rather than hand-write a form for each, a
 * section's shape is inferred once from the content it was seeded with
 * (`infer`) and stored as its `schema`; `components` turns that schema into
 * Filament fields:
 *
 *   short text → text input        long text   → textarea
 *   number     → numeric input     true/false  → toggle
 *   short word list → tags         paragraphs  → list of textareas
 *   list of objects → repeater (add / remove / reorder / duplicate)
 *   nested object   → fieldset
 *
 * The stored schema — not the current content — drives the form, so emptying
 * a list never loses the fields its items need.
 */
class ContentForm
{
    /** Strings longer than this (or with line breaks) get a textarea. */
    private const LONG_TEXT = 90;

    /** Lists of strings longer than this are paragraphs, not tags. */
    private const TAG_MAX = 60;

    /** Keys holding presentation (Tailwind classes) rather than copy. */
    private const STYLE_KEYS = ['card', 'mark', 'avatar', 'tilt', 'offset', 'dot', 'color', 'bg', 'tone', 'class', 'classname', 'accent', 'fill', 'position'];

    /**
     * @return array{type: string, fields?: array<string, array>, item?: array}
     */
    public static function infer(mixed $value): array
    {
        if (is_bool($value)) {
            return ['type' => 'bool'];
        }
        if (is_int($value) || is_float($value)) {
            return ['type' => 'number'];
        }
        if (is_string($value) || $value === null) {
            return ['type' => self::isLong($value) ? 'text' : 'string'];
        }
        if (! is_array($value)) {
            return ['type' => 'string'];
        }

        if (! array_is_list($value)) {
            return ['type' => 'object', 'fields' => array_map([self::class, 'infer'], $value)];
        }

        if ($value === []) {
            return ['type' => 'tags'];
        }

        if (collect($value)->every(fn ($item) => is_scalar($item) || $item === null)) {
            $longest = collect($value)->map(fn ($item) => mb_strlen((string) $item))->max();

            return $longest > self::TAG_MAX ? ['type' => 'list', 'item' => ['type' => 'text']] : ['type' => 'tags'];
        }

        if (collect($value)->every(fn ($item) => is_array($item) && ! array_is_list($item))) {
            $merged = array_reduce($value, fn (?array $carry, array $item) => self::merge($carry, self::infer($item)), null);

            return ['type' => 'repeater', 'fields' => $merged['fields'] ?? []];
        }

        return ['type' => 'json'];
    }

    /**
     * Form components for the fields of an object schema.
     *
     * @param  array<string, array>  $fields
     * @return array<int, \Filament\Schemas\Components\Component|\Filament\Forms\Components\Field>
     */
    public static function components(array $fields, string $prefix = ''): array
    {
        $components = [];
        foreach ($fields as $key => $node) {
            $components[] = self::component((string) $key, $node, $prefix === '' ? (string) $key : $prefix.'.'.$key);
        }

        return $components;
    }

    private static function component(string $key, array $node, string $name): mixed
    {
        $label = Str::headline($key);
        $isStyle = in_array(Str::lower($key), self::STYLE_KEYS, true);

        $field = match ($node['type'] ?? 'string') {
            'bool' => Toggle::make($name)->label($label),
            'number' => TextInput::make($name)->label($label)->numeric(),
            'text' => Textarea::make($name)->label($label)->rows(4)->autosize()->columnSpanFull(),
            'tags' => TagsInput::make($name)->label($label)->reorderable()->splitKeys(['Tab'])
                ->helperText('Press Enter after each item; drag to reorder.')->columnSpanFull(),
            'list' => Repeater::make($name)->label($label)
                ->simple(Textarea::make('value')->rows(3)->autosize()->required())
                ->reorderable()->addActionLabel('Add paragraph')->columnSpanFull(),
            'repeater' => self::repeater($name, $label, $node['fields'] ?? []),
            'object' => Fieldset::make($label)->schema(self::components($node['fields'] ?? [], $name))->columns(2)->columnSpanFull(),
            'json' => Textarea::make($name)->label($label.' (JSON)')->rows(6)->columnSpanFull()
                ->formatStateUsing(fn ($state) => json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
                ->dehydrateStateUsing(fn ($state) => json_decode((string) $state, true))
                ->rule('json'),
            default => TextInput::make($name)->label($label),
        };

        if ($isStyle && method_exists($field, 'helperText')) {
            $field->helperText('Styling value used by the design (e.g. a colour or Tailwind class) — change with care.');
        }

        return $field;
    }

    private static function repeater(string $name, string $label, array $fields): Repeater
    {
        $titleKey = collect($fields)
            ->filter(fn ($node, $key) => in_array($node['type'] ?? '', ['string', 'text'], true)
                && ! in_array(Str::lower((string) $key), self::STYLE_KEYS, true))
            ->keys()
            ->first();

        return Repeater::make($name)->label($label)
            ->schema(self::components($fields))
            ->columns(2)
            ->reorderable()
            ->cloneable()
            ->collapsible()
            ->itemLabel(fn (array $state): ?string => $titleKey !== null && is_string($state[$titleKey] ?? null)
                ? Str::limit(strip_tags($state[$titleKey]), 60)
                : null)
            ->addActionLabel('Add '.Str::singular(Str::lower($label)))
            ->columnSpanFull();
    }

    /** Combines two schemas for the same slot (e.g. two items of one list). */
    private static function merge(?array $a, array $b): array
    {
        if ($a === null) {
            return $b;
        }
        if ($a['type'] === 'object' && $b['type'] === 'object' || $a['type'] === 'repeater' && $b['type'] === 'repeater') {
            $fields = $a['fields'] ?? [];
            foreach ($b['fields'] ?? [] as $key => $node) {
                $fields[$key] = isset($fields[$key]) ? self::merge($fields[$key], $node) : $node;
            }

            return ['type' => $a['type'], 'fields' => $fields];
        }
        // Long text wins over short; anything structured wins over a stray null.
        if (in_array($a['type'], ['string', 'text'], true) && in_array($b['type'], ['string', 'text'], true)) {
            return ['type' => $a['type'] === 'text' || $b['type'] === 'text' ? 'text' : 'string'];
        }
        if ($a['type'] === 'tags' && $b['type'] === 'list' || $a['type'] === 'list' && $b['type'] === 'tags') {
            return ['type' => 'list', 'item' => ['type' => 'text']];
        }

        return $a['type'] === 'string' ? $b : $a;
    }

    private static function isLong(?string $value): bool
    {
        return $value !== null && (mb_strlen($value) > self::LONG_TEXT || str_contains($value, "\n"));
    }
}
