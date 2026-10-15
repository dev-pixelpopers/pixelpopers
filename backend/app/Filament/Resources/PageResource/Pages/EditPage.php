<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use App\Models\Page;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Edits a page and all of its sections at once: each section's copy is a tab
 * (see PageResource), loaded from and saved back to page_sections.
 */
class EditPage extends EditRecord
{
    protected static string $resource = PageResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $sections = $this->record->sections;
        $data['sections_content'] = $sections->mapWithKeys(fn ($s) => [$s->key => $s->content ?? []])->all();
        $data['sections_visible'] = $sections->mapWithKeys(fn ($s) => [$s->key => $s->is_published])->all();

        return $data;
    }

    /** @param  Page  $record */
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $content = $data['sections_content'] ?? [];
        $visible = $data['sections_visible'] ?? [];
        unset($data['sections_content'], $data['sections_visible']);

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

        return $record;
    }
}
