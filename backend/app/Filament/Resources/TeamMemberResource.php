<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamMemberResource\Pages;
use App\Filament\Support\Fields;
use App\Models\TeamMember;
use App\Support\Media;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/** Founders / team: the home page's leadership cards and the blog's authors. */
class TeamMemberResource extends Resource
{
    protected static ?string $model = TeamMember::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-users';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Team & authors';

    protected static ?int $navigationSort = 8;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('name')->required(),
                Forms\Components\TextInput::make('role')->placeholder('Founder & Creative Director'),
                Fields::media('avatar', 'Photo')->columnSpanFull(),
                Fields::tone('accent', 'Ring colour'),
                Forms\Components\TextInput::make('rotate')->label('Card tilt (degrees)')->numeric()->step(0.1)->default(0),
                Forms\Components\Toggle::make('is_published')->label('Shown')->default(true),
            ]),
            SchemaComponents\Section::make('Author bio')->description('Shown on blog posts this person wrote.')->schema([
                Forms\Components\TextInput::make('bio_short')->label('Short bio')->maxLength(255),
                Forms\Components\Textarea::make('bio_long')->label('Long bio')->rows(5),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar_url')->label('')->circular()
                    ->state(fn (TeamMember $record) => Media::absolute($record->avatar)),
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold')->description(fn (TeamMember $record) => $record->role),
                Tables\Columns\TextColumn::make('posts_count')->counts('posts')->label('Posts'),
                Tables\Columns\ToggleColumn::make('is_published')->label('Shown'),
            ])
            ->recordActions([Actions\EditAction::make()])
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTeamMembers::route('/'),
            'create' => Pages\CreateTeamMember::route('/create'),
            'edit' => Pages\EditTeamMember::route('/{record}/edit'),
        ];
    }
}
