<?php

namespace App\Filament\Resources\RedirectResource\Pages;

use App\Filament\Resources\RedirectResource;
use App\Models\Redirect;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListRedirects extends ListRecords
{
    protected static string $resource = RedirectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('addMany')
                ->label('Add many')
                ->icon('heroicon-o-queue-list')
                ->color('gray')
                ->modalHeading('Add many redirects')
                ->modalDescription('One per line: old address, new address, and optionally the type (301, 302 or 410). Separate them with spaces, tabs or commas — a CSV or a copy from Google Sheets works. A line with only an old address is marked as gone (410). Existing redirects for the same address are updated.')
                ->schema([
                    Forms\Components\Textarea::make('list')
                        ->hiddenLabel()
                        ->rows(12)
                        ->required()
                        ->placeholder("/old-services-page   /services\n/2019/blog-post   /blog   301\nhttps://www.pixelpopers.com/portfolio/*   /work\n/test-page   410")
                        ->extraInputAttributes(['spellcheck' => 'false', 'style' => 'font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.6']),
                ])
                ->action(function (array $data): void {
                    ['rows' => $rows, 'skipped' => $skipped] = Redirect::parseList($data['list']);
                    $saved = 0;
                    foreach ($rows as $row) {
                        if ($row['from_path'] === '/' || $row['from_path'] === $row['to_url']) {
                            $skipped[] = $row['from_path'];

                            continue;
                        }
                        Redirect::updateOrCreate(['from_path' => $row['from_path']], $row + ['is_active' => true]);
                        $saved++;
                    }
                    Notification::make()
                        ->title("$saved redirect".($saved === 1 ? '' : 's').' saved')
                        ->body($skipped ? 'Skipped (couldn’t read): '.implode(' · ', array_slice($skipped, 0, 8)).(count($skipped) > 8 ? ' …' : '') : null)
                        ->{$skipped ? 'warning' : 'success'}()
                        ->persistent($skipped !== [])
                        ->send();
                }),
            Actions\Action::make('export')
                ->label('Export CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('gray')
                ->action(fn (): StreamedResponse => response()->streamDownload(function (): void {
                    $out = fopen('php://output', 'w');
                    fputcsv($out, ['from', 'to', 'type', 'active', 'notes']);
                    Redirect::orderBy('from_path')->each(fn (Redirect $r) => fputcsv($out, [$r->from_path, $r->to_url, $r->status_code, $r->is_active ? 'yes' : 'no', $r->notes]));
                    fclose($out);
                }, 'redirects-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv'])),
            Actions\CreateAction::make()->label('New redirect'),
        ];
    }
}
