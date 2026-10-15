<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClientResource\Pages;
use App\Filament\Support\Fields;
use App\Models\Client;
use App\Support\Media;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/** Client logos: the cards that pile into the Agency folder on the home page. */
class ClientResource extends Resource
{
    protected static ?string $model = Client::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-storefront';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Client logos';

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('name')->required()->helperText('Used as the logo’s alt text.'),
                Forms\Components\Toggle::make('is_published')->label('Shown')->default(true)->inline(false),
                Fields::media('logo', 'Logo')->required()->columnSpanFull(),
                Forms\Components\TextInput::make('width')->label('Logo width (px)')->numeric()->required(),
                Forms\Components\TextInput::make('height')->label('Logo height (px)')->numeric()->required(),
                Forms\Components\ColorPicker::make('tint')
                    ->helperText('Only for white/light logos on transparent backgrounds: paints the mark in this colour so it reads on a white card. Leave empty otherwise.'),
                Forms\Components\TextInput::make('rotate')->label('Card tilt (degrees)')->numeric()->step(0.1)->default(0),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo_url')->label('')
                    ->state(fn (Client $record) => Media::absolute($record->logo))
                    ->imageHeight(32)->extraImgAttributes(['class' => 'bg-white p-1 rounded']),
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold'),
                Tables\Columns\ColorColumn::make('tint'),
                Tables\Columns\ToggleColumn::make('is_published')->label('Shown'),
            ])
            ->recordActions([Actions\EditAction::make()])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListClients::route('/'),
            'create' => Pages\CreateClient::route('/create'),
            'edit' => Pages\EditClient::route('/{record}/edit'),
        ];
    }
}
