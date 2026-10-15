<?php

namespace App\Filament\Resources\NewsletterSubscriberResource\Pages;

use App\Filament\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListNewsletterSubscribers extends ListRecords
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('export')
                ->label('Export active (CSV)')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn (): StreamedResponse => response()->streamDownload(function (): void {
                    $out = fopen('php://output', 'w');
                    fputcsv($out, ['email', 'source', 'signed_up']);
                    NewsletterSubscriber::whereNull('unsubscribed_at')->orderBy('created_at')
                        ->each(fn (NewsletterSubscriber $s) => fputcsv($out, [$s->email, $s->source, $s->created_at?->toDateTimeString()]));
                    fclose($out);
                }, 'newsletter-subscribers-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv'])),
        ];
    }
}
