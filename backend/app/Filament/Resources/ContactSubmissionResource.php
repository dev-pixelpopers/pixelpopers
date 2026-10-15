<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactSubmissionResource\Pages;
use App\Models\ContactSubmission;
use Filament\Actions;
use Filament\Infolists;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/** Project enquiries from the contact form. */
class ContactSubmissionResource extends Resource
{
    protected static ?string $model = ContactSubmission::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-inbox-arrow-down';

    protected static string|\UnitEnum|null $navigationGroup = 'Inbox';

    protected static ?string $navigationLabel = 'Enquiries';

    protected static ?string $modelLabel = 'enquiry';

    protected static ?string $pluralModelLabel = 'enquiries';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $new = ContactSubmission::where('status', 'new')->count();

        return $new > 0 ? (string) $new : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make('From')->columns(2)->schema([
                Infolists\Components\TextEntry::make('name'),
                Infolists\Components\TextEntry::make('email')->copyable()->url(fn (ContactSubmission $record) => 'mailto:'.$record->email),
                Infolists\Components\TextEntry::make('company')->placeholder('—'),
                Infolists\Components\TextEntry::make('website')->placeholder('—')
                    ->url(fn (ContactSubmission $record) => $record->website ? (str_starts_with($record->website, 'http') ? $record->website : 'https://'.$record->website) : null, true),
            ]),
            SchemaComponents\Section::make('Project')->columns(2)->schema([
                Infolists\Components\TextEntry::make('services')->badge()->placeholder('Not sure yet'),
                Infolists\Components\TextEntry::make('budget')->placeholder('Not sure yet'),
                Infolists\Components\TextEntry::make('details')->columnSpanFull()->prose()->placeholder('—'),
            ]),
            SchemaComponents\Section::make('Meta')->columns(3)->collapsed()->schema([
                Infolists\Components\TextEntry::make('created_at')->dateTime()->label('Received'),
                Infolists\Components\TextEntry::make('ip_address')->label('IP'),
                Infolists\Components\TextEntry::make('user_agent')->label('Browser')->limit(60),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold')->description(fn (ContactSubmission $record) => $record->email),
                Tables\Columns\TextColumn::make('company')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('services')->badge()->toggleable(),
                Tables\Columns\TextColumn::make('budget')->toggleable(),
                Tables\Columns\SelectColumn::make('status')->options(ContactSubmission::STATUSES)->selectablePlaceholder(false),
                Tables\Columns\TextColumn::make('created_at')->since()->label('Received')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options(ContactSubmission::STATUSES),
            ])
            ->recordActions([
                Actions\ViewAction::make(),
                Actions\Action::make('reply')->icon('heroicon-o-envelope')->color('gray')
                    ->url(fn (ContactSubmission $record) => 'mailto:'.$record->email.'?subject='.rawurlencode('Re: your project with Pixel Popers')),
            ])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->defaultSort('created_at', 'desc');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactSubmissions::route('/'),
            'view' => Pages\ViewContactSubmission::route('/{record}'),
        ];
    }
}
