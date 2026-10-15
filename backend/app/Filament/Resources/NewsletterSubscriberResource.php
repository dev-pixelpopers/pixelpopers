<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Actions;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/** Newsletter sign-ups from the footer and the blog. */
class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope-open';

    protected static string|\UnitEnum|null $navigationGroup = 'Inbox';

    protected static ?string $navigationLabel = 'Newsletter';

    protected static ?string $modelLabel = 'subscriber';

    protected static ?int $navigationSort = 2;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')->searchable()->copyable()->weight('bold'),
                Tables\Columns\TextColumn::make('source')->badge()->color('gray'),
                Tables\Columns\IconColumn::make('active')->boolean()
                    ->state(fn (NewsletterSubscriber $record) => $record->unsubscribed_at === null),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->label('Signed up')->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('active')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNull('unsubscribed_at'),
                        false: fn (Builder $query) => $query->whereNotNull('unsubscribed_at'),
                    )->default(true),
                Tables\Filters\SelectFilter::make('source')->options(['footer' => 'Footer', 'blog' => 'Blog']),
            ])
            ->recordActions([
                Actions\Action::make('unsubscribe')->icon('heroicon-o-no-symbol')->color('danger')->requiresConfirmation()
                    ->visible(fn (NewsletterSubscriber $record) => $record->unsubscribed_at === null)
                    ->action(fn (NewsletterSubscriber $record) => $record->update(['unsubscribed_at' => now()])),
            ])
            ->toolbarActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('unsubscribe')->label('Unsubscribe selected')->icon('heroicon-o-no-symbol')->requiresConfirmation()
                        ->action(fn (Collection $records) => $records->each->update(['unsubscribed_at' => now()])),
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
        ];
    }
}
