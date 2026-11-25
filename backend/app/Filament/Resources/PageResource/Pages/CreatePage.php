<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use App\Models\Page;
use App\Models\PageSection;
use App\Support\Navigation;
use App\Support\SectionLibrary;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * "New page": a custom page at /{slug}, starting with sections copied from
 * other pages (a whole page's and/or individual ones). Its sections are
 * then edited on the page's edit screen like any other page's.
 */
class CreatePage extends CreateRecord
{
    protected static string $resource = PageResource::class;

    protected static ?string $title = 'New page';

    protected function handleRecordCreation(array $data): Model
    {
        $copyPage = $data['copy_page'] ?? null;
        $copySections = $data['copy_sections'] ?? [];
        $nav = ['nav_main' => (bool) ($data['nav_in_main'] ?? false), 'nav_footer' => (bool) ($data['nav_in_footer'] ?? false)];
        $navLabel = trim((string) ($data['nav_label'] ?? ''));
        unset($data['copy_page'], $data['copy_sections'], $data['nav_in_main'], $data['nav_in_footer'], $data['nav_label']);

        return DB::transaction(function () use ($data, $copyPage, $copySections, $nav, $navLabel) {
            $page = Page::create($data + [
                'is_custom' => true,
                'is_published' => $data['is_published'] ?? true,
                'sort_order' => (int) Page::max('sort_order') + 1,
            ]);

            $sources = collect();
            if ($copyPage) {
                $sources = $sources->concat(Page::find($copyPage)?->sections ?? []);
            }
            foreach ($copySections as $id) {
                $sources->push(PageSection::find($id));
            }
            $sources->filter(fn (?PageSection $s) => $s && SectionLibrary::typeOf($s) !== null)
                ->each(fn (PageSection $s) => SectionLibrary::copyTo($page, $s));

            foreach ($nav as $menu => $show) {
                Navigation::toggle($menu, $page, $show, $navLabel);
            }

            return $page;
        });
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('edit', ['record' => $this->record]);
    }
}
