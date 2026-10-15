<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostCategoryResource\Pages;
use App\Filament\Support\Fields;
use App\Models\PostCategory;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

/** Blog categories and the brand colour their tags use. */
class PostCategoryResource extends Resource
{
    protected static ?string $model = PostCategory::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-tag';

    protected static string|\UnitEnum|null $navigationGroup = 'Blog';

    protected static ?string $navigationLabel = 'Categories';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('name')->required()->unique(ignoreRecord: true)->live(onBlur: true)
                ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
            Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
            Fields::tone('tone', 'Tag colour'),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->weight('bold'),
                Tables\Columns\TextColumn::make('tone')->badge(),
                Tables\Columns\TextColumn::make('posts_count')->counts('posts')->label('Posts'),
            ])
            ->recordActions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make()->disabled(fn (PostCategory $record) => $record->posts()->exists())
                    ->tooltip(fn (PostCategory $record) => $record->posts()->exists() ? 'Move its posts to another category first.' : null),
            ])
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPostCategories::route('/'),
            'create' => Pages\CreatePostCategory::route('/create'),
            'edit' => Pages\EditPostCategory::route('/{record}/edit'),
        ];
    }
}
