<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Filament\Support\Fields;
use App\Models\Testimonial;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/** Client quotes, shown in the "Kind words" sections across the site. */
class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 7;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make()->columns(2)->schema([
                Forms\Components\Textarea::make('quote')->required()->rows(3)->columnSpanFull(),
                Forms\Components\TextInput::make('role')->placeholder('Founder'),
                Forms\Components\TextInput::make('company')->placeholder('Fifth Sip Café'),
                Forms\Components\TextInput::make('initial')->label('Avatar letter')->maxLength(2),
                Fields::tone('tone', 'Card colour'),
                Forms\Components\Toggle::make('is_published')->label('Shown')->default(true),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('quote')->limit(80)->wrap()->searchable(),
                Tables\Columns\TextColumn::make('company')->description(fn (Testimonial $record) => $record->role)->searchable(),
                Tables\Columns\TextColumn::make('tone')->badge(),
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
