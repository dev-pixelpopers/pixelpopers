<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Setting;
use App\Support\Navigation;
use App\Support\SectionLibrary;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Edits a page and all of its sections at once: each section's copy is a tab
 * (see PageResource), loaded from and saved back to page_sections.
 *
 * Pages built in the CMS also get "Add section" (copy one from any page) and
 * "Arrange sections" (reorder, rename, remove).
 */
class EditPage extends EditRecord
{
    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        /** @var Page $page */
        $page = $this->record;
        $site = rtrim((string) Setting::get('site_url', 'https://www.pixelpopers.com'), '/');

        return [
            Actions\Action::make('view')->label('View page')->icon('heroicon-o-arrow-top-right-on-square')->color('gray')
                ->url($site.($page->slug === 'home' ? '/' : '/'.$page->slug), shouldOpenInNewTab: true),

            Actions\Action::make('addSection')
                ->label('Add section')
                ->icon('heroicon-o-plus')
                ->visible($page->is_custom)
                ->modalHeading('Add a section')
                ->modalDescription('Copies a section — its design and its current content — to the end of this page. Your unsaved changes are saved first.')
                ->schema([
                    Forms\Components\Select::make('source')
                        ->label('Copy from')
                        ->options(fn () => SectionLibrary::sources())
                        ->searchable()
                        ->required(),
                    Forms\Components\TextInput::make('label')
                        ->label('Tab name (optional)')
                        ->placeholder('Defaults to the original section’s name')
                        ->maxLength(80),
                ])
                ->action(function (array $data) use ($page): void {
                    $this->save(shouldRedirect: false, shouldSendSavedNotification: false);
                    $section = SectionLibrary::copyTo($page, PageSection::findOrFail($data['source']), $data['label'] ?? null);
                    Notification::make()->title("“{$section->label}” added")->success()->send();
                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $page]));
                }),

            Actions\Action::make('arrange')
                ->label('Arrange sections')
                ->icon('heroicon-o-arrows-up-down')
                ->color('gray')
                ->visible($page->is_custom && $page->sections()->exists())
                ->modalDescription('Drag to reorder, rename the tabs, or remove a section. Your unsaved changes are saved first.')
                ->fillForm(fn () => ['sections' => $page->sections()->get()->map(fn (PageSection $s) => [
                    'id' => $s->id,
                    'label' => $s->label,
                    'design' => SectionLibrary::label(SectionLibrary::typeOf($s)),
                ])->all()])
                ->schema([
                    Forms\Components\Repeater::make('sections')
                        ->hiddenLabel()
                        ->reorderable()
                        ->reorderableWithButtons()
                        ->addable(false)
                        ->deletable()
                        ->itemLabel(fn (array $state) => $state['design'] ?? null)
                        ->schema([
                            Forms\Components\Hidden::make('id'),
                            Forms\Components\Hidden::make('design'),
                            Forms\Components\TextInput::make('label')->label('Tab name')->required()->maxLength(80),
                        ]),
                ])
                ->action(function (array $data) use ($page): void {
                    $this->save(shouldRedirect: false, shouldSendSavedNotification: false);
                    $keep = collect($data['sections'] ?? [])->values();
                    DB::transaction(function () use ($page, $keep): void {
                        $page->sections()->whereNotIn('id', $keep->pluck('id')->filter()->all())->get()->each->delete();
                        $keep->each(function (array $row, int $i) use ($page): void {
                            $page->sections()->whereKey($row['id'])->first()?->update(['label' => $row['label'], 'sort_order' => $i + 1]);
                        });
                    });
                    Notification::make()->title('Sections updated')->success()->send();
                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $page]));
                }),

            PageResource::duplicateAction()->record($page),

            Actions\DeleteAction::make()
                ->visible($page->is_custom)
                ->modalDescription('The page and its sections are deleted. Its address will show “not found” — add a redirect under SEO → Redirects if it was shared or indexed.'),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $sections = $this->record->sections;
        $data['sections_content'] = $sections->mapWithKeys(fn ($s) => [$s->key => $s->content ?? []])->all();
        $data['sections_visible'] = $sections->mapWithKeys(fn ($s) => [$s->key => $s->is_published])->all();
        $data['nav_in_main'] = Navigation::contains('nav_main', $this->record->slug);
        $data['nav_in_footer'] = Navigation::contains('nav_footer', $this->record->slug);
        $data['nav_label'] = collect(Navigation::items('nav_main'))->firstWhere('page', $this->record->slug)['label'] ?? null;

        return $data;
    }

    /** @param  Page  $record */
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $content = $data['sections_content'] ?? [];
        $visible = $data['sections_visible'] ?? [];
        $nav = [
            'nav_main' => (bool) ($data['nav_in_main'] ?? false),
            'nav_footer' => (bool) ($data['nav_in_footer'] ?? false),
        ];
        $navLabel = trim((string) ($data['nav_label'] ?? ''));
        unset($data['sections_content'], $data['sections_visible'], $data['nav_in_main'], $data['nav_in_footer'], $data['nav_label']);

        DB::transaction(function () use ($record, $data, $content, $visible): void {
            $record->update($data);

            foreach ($record->sections as $section) {
                if (! array_key_exists($section->key, $content)) {
                    continue;
                }
                $section->content = $content[$section->key];
                $section->is_published = (bool) ($visible[$section->key] ?? $section->is_published);
                // Saves (and refreshes the website) only when something changed.
                $section->save();
            }
        });

        // The page's "Show in…" switches (after the update, so a new address is used).
        foreach ($nav as $menu => $show) {
            Navigation::toggle($menu, $record->fresh(), $show, $navLabel);
        }

        return $record;
    }
}
