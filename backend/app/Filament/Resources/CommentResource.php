<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CommentResource\Pages;
use App\Filament\Support\Fields;
use App\Models\Comment;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

/** Reader comments. New ones arrive unapproved and appear on the site once approved. */
class CommentResource extends Resource
{
    protected static ?string $model = Comment::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-oval-left-ellipsis';

    protected static string|\UnitEnum|null $navigationGroup = 'Blog';

    protected static ?int $navigationSort = 3;

    public static function getNavigationBadge(): ?string
    {
        $pending = Comment::where('is_approved', false)->count();

        return $pending > 0 ? (string) $pending : null;
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'Waiting for approval';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Grid::make(2)->schema([
                Forms\Components\TextInput::make('name')->required(),
                Forms\Components\TextInput::make('email')->email(),
                Forms\Components\Textarea::make('body')->label('Comment')->required()->rows(4)->columnSpanFull(),
                Fields::tone('tone', 'Avatar colour'),
                Forms\Components\Toggle::make('is_approved')->label('Approved (shown on the site)')->inline(false),
            ]),
        ]);
    }

    public static function table(Table $table, bool $withPost = true): Table
    {
        $columns = [
            Tables\Columns\TextColumn::make('name')->searchable()->weight('bold')->description(fn (Comment $record) => $record->email),
            Tables\Columns\TextColumn::make('body')->label('Comment')->limit(90)->wrap()->searchable(),
            Tables\Columns\ToggleColumn::make('is_approved')->label('Approved'),
            Tables\Columns\TextColumn::make('created_at')->since()->label('Received')->sortable(),
        ];
        if ($withPost) {
            array_splice($columns, 2, 0, [Tables\Columns\TextColumn::make('post.title')->label('Post')->limit(40)]);
        }

        return $table
            ->columns($columns)
            ->filters([
                Tables\Filters\TernaryFilter::make('is_approved')->label('Approved'),
            ])
            ->recordActions([
                Actions\Action::make('approve')->icon('heroicon-o-check')->color('success')
                    ->visible(fn (Comment $record) => ! $record->is_approved)
                    ->action(fn (Comment $record) => $record->update(['is_approved' => true])),
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('approve')->label('Approve selected')->icon('heroicon-o-check')
                        ->action(fn (Collection $records) => $records->each->update(['is_approved' => true]))
                        ->deselectRecordsAfterCompletion(),
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
            'index' => Pages\ListComments::route('/'),
            'edit' => Pages\EditComment::route('/{record}/edit'),
        ];
    }
}
