<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ShowreelItemResource\Pages;
use App\Filament\Support\Fields;
use App\Models\ShowreelItem;
use App\Support\Media;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/** The clips in the home page's video carousel (and the Studio cube it folds into). */
class ShowreelItemResource extends Resource
{
    protected static ?string $model = ShowreelItem::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-film';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Showreel';

    protected static ?string $modelLabel = 'showreel clip';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make('Clip')
                ->description('The carousel shows every published clip; the first six also become the six faces of the Studio cube it folds into, so keep six for the full effect.')
                ->columns(2)->schema([
                Forms\Components\TextInput::make('title')->required()->helperText('Used as the accessible label and the caption under the carousel.'),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Fields::media('video', 'Video', 'video')->required()->columnSpanFull()
                    ->helperText('MP4, 720p, no audio, ideally under 3 MB (it plays on phones too).'),
                Forms\Components\Toggle::make('is_published')->label('Published')->default(true),
            ]),
            SchemaComponents\Section::make('Poster')->description('A still shown before the clip plays and on tiles that aren’t playing.')->columns(2)->schema([
                Fields::media('poster.src', 'Poster (about 960 px wide)')->columnSpanFull(),
                Fields::media('poster.small', 'Small poster (about 540 px wide)')->columnSpanFull(),
                Forms\Components\TextInput::make('poster.width')->label('Width (px)')->numeric(),
                Forms\Components\TextInput::make('poster.height')->label('Height (px)')->numeric(),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('poster_url')->label('')
                    ->state(fn (ShowreelItem $record) => Media::absolute($record->poster['small'] ?? $record->poster['src'] ?? null))
                    ->imageHeight(40)->extraImgAttributes(['class' => 'rounded-md']),
                Tables\Columns\TextColumn::make('title')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('video')->color('gray')->limit(40),
                Tables\Columns\ToggleColumn::make('is_published')->label('Published'),
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
            'index' => Pages\ListShowreelItems::route('/'),
            'create' => Pages\CreateShowreelItem::route('/create'),
            'edit' => Pages\EditShowreelItem::route('/{record}/edit'),
        ];
    }
}
