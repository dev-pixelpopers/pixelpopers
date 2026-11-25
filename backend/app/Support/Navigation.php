<?php

namespace App\Support;

use App\Models\Page;
use App\Models\Setting;

/**
 * The website's two menus, edited on Settings → Navigation (and with the
 * "Show in…" switches on each page): the main menu (the full-screen menu
 * behind "Menu") and the footer's Navigation list.
 *
 * Each menu is an ordered list of items stored in a setting:
 *   page    a page's address ("about", "web-design-london", "home"), or empty for a custom link
 *   url     the custom link ("/about#studio", "https://…") when `page` is empty
 *   label   the text shown (empty = the page's title)
 *   pill    a small badge after it ("We’re hiring"); "{projects}" shows the number of case studies
 *   new_tab open in a new tab
 *
 * Until a menu is saved, the website shows the links it always had (DEFAULTS).
 */
class Navigation
{
    public const MENUS = [
        'nav_main' => 'Main menu',
        'nav_footer' => 'Footer · Navigation',
    ];

    public const DEFAULTS = [
        'nav_main' => [
            ['page' => 'home', 'url' => null, 'label' => 'Home', 'pill' => null, 'new_tab' => false],
            ['page' => 'work', 'url' => null, 'label' => 'Work', 'pill' => '{projects}', 'new_tab' => false],
            ['page' => 'services', 'url' => null, 'label' => 'Services', 'pill' => null, 'new_tab' => false],
            ['page' => 'about', 'url' => null, 'label' => 'About', 'pill' => null, 'new_tab' => false],
            ['page' => 'blog', 'url' => null, 'label' => 'Blog', 'pill' => null, 'new_tab' => false],
            ['page' => 'contact', 'url' => null, 'label' => 'Contact', 'pill' => null, 'new_tab' => false],
        ],
        'nav_footer' => [
            ['page' => 'work', 'url' => null, 'label' => 'Work', 'pill' => null, 'new_tab' => false],
            ['page' => 'services', 'url' => null, 'label' => 'Services', 'pill' => null, 'new_tab' => false],
            ['page' => 'about', 'url' => null, 'label' => 'About', 'pill' => null, 'new_tab' => false],
            ['page' => null, 'url' => '/about#studio', 'label' => 'Studio', 'pill' => null, 'new_tab' => false],
            ['page' => null, 'url' => '/about#careers', 'label' => 'Careers', 'pill' => 'We’re hiring', 'new_tab' => false],
            ['page' => 'blog', 'url' => null, 'label' => 'Blog', 'pill' => null, 'new_tab' => false],
        ],
    ];

    /** @return list<array{page: ?string, url: ?string, label: ?string, pill: ?string, new_tab: bool}> */
    public static function items(string $menu): array
    {
        $saved = Setting::get($menu);

        return is_array($saved) ? array_values($saved) : self::DEFAULTS[$menu];
    }

    public static function save(string $menu, array $items): void
    {
        Setting::set($menu, array_values(array_map(fn (array $item) => [
            'page' => ($item['page'] ?? null) ?: null,
            'url' => ($item['page'] ?? null) ? null : (trim((string) ($item['url'] ?? '')) ?: null),
            'label' => trim((string) ($item['label'] ?? '')) ?: null,
            'pill' => trim((string) ($item['pill'] ?? '')) ?: null,
            'new_tab' => (bool) ($item['new_tab'] ?? false),
        ], $items)));
    }

    public static function contains(string $menu, string $slug): bool
    {
        return collect(self::items($menu))->contains(fn ($item) => ($item['page'] ?? null) === $slug);
    }

    /** The page switches: adds the page at the end of a menu, or removes it (keeping everything else as it was). */
    public static function toggle(string $menu, Page $page, bool $show, ?string $label = null): void
    {
        $items = collect(self::items($menu));
        $has = $items->contains(fn ($item) => ($item['page'] ?? null) === $page->slug);
        if ($show && ! $has) {
            $items->push(['page' => $page->slug, 'url' => null, 'label' => $label ?: null, 'pill' => null, 'new_tab' => false]);
        } elseif (! $show && $has) {
            $items = $items->reject(fn ($item) => ($item['page'] ?? null) === $page->slug);
        } elseif ($show && $label !== null) {
            $items = $items->map(fn ($item) => ($item['page'] ?? null) === $page->slug ? ['label' => $label ?: null] + $item : $item);
        } else {
            return;
        }
        self::save($menu, $items->values()->all());
    }

    /** A page's address changed: its menu items follow it. */
    public static function renamePage(string $from, string $to): void
    {
        foreach (array_keys(self::MENUS) as $menu) {
            $items = self::items($menu);
            if (collect($items)->contains(fn ($item) => ($item['page'] ?? null) === $from)) {
                self::save($menu, array_map(fn ($item) => ($item['page'] ?? null) === $from ? ['page' => $to] + $item : $item, $items));
            }
        }
    }

    /** A page was deleted: its menu items go too. */
    public static function forgetPage(string $slug): void
    {
        foreach (array_keys(self::MENUS) as $menu) {
            $items = self::items($menu);
            if (collect($items)->contains(fn ($item) => ($item['page'] ?? null) === $slug)) {
                self::save($menu, array_values(array_filter($items, fn ($item) => ($item['page'] ?? null) !== $slug)));
            }
        }
    }

    /** Pages to link to, as address → "Title (/address)". */
    public static function pageOptions(): array
    {
        return Page::query()->orderBy('is_custom')->orderBy('sort_order')->get(['slug', 'title'])
            ->mapWithKeys(fn (Page $p) => [$p->slug => $p->title.' ('.($p->slug === 'home' ? '/' : '/'.$p->slug).')'])->all();
    }
}
