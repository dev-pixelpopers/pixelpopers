<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RedirectResource\Pages;
use App\Models\Redirect;
use App\Models\Setting;
use App\Support\SitePaths;
use Closure;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/**
 * Redirects for the website: send old or never-existing addresses that
 * search engines indexed to a real page (301), or tell Google they're gone
 * for good (410). The website checks these before showing any page.
 */
class RedirectResource extends Resource
{
    protected static ?string $model = Redirect::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-arrow-uturn-right';

    protected static string|\UnitEnum|null $navigationGroup = 'SEO';

    protected static ?string $navigationLabel = 'Redirects';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make()
                ->description('Changes reach the website within about a minute.')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('from_path')
                        ->label('Old address')
                        ->placeholder('/old-page  or  https://www.pixelpopers.com/old-page')
                        ->helperText('Paste the address Google shows — the domain is removed for you. End with /* to cover a whole folder (e.g. /old-blog/*).')
                        ->required()
                        ->maxLength(500)
                        ->columnSpanFull()
                        ->rules([
                            fn (?Redirect $record): Closure => function (string $attribute, $value, Closure $fail) use ($record) {
                                $path = Redirect::normalisePath($value);
                                if ($path === '/' || $path === '/*') {
                                    $fail('The home page can’t be redirected.');
                                }
                                if (Redirect::where('from_path', $path)->when($record, fn ($q) => $q->whereKeyNot($record->getKey()))->exists()) {
                                    $fail("There is already a redirect for $path.");
                                }
                            },
                        ]),
                    Forms\Components\Select::make('status_code')
                        ->label('Type')
                        ->options(Redirect::STATUSES)
                        ->default(301)
                        ->selectablePlaceholder(false)
                        ->live()
                        ->required(),
                    Forms\Components\TextInput::make('to_url')
                        ->label('Send visitors to')
                        ->placeholder('/services  or  https://…')
                        ->datalist(array_keys(SitePaths::all()))
                        ->helperText('A page on this site (start typing for suggestions) or a full address.')
                        ->maxLength(1000)
                        ->hidden(fn (Get $get) => (int) $get('status_code') === 410)
                        ->required(fn (Get $get) => (int) $get('status_code') !== 410)
                        ->rules([
                            fn (Get $get): Closure => function (string $attribute, $value, Closure $fail) use ($get) {
                                $target = Redirect::normaliseTarget($value);
                                if ($target !== null && ! str_starts_with($target, 'http') && Redirect::normalisePath($target) === Redirect::normalisePath($get('from_path'))) {
                                    $fail('A page can’t redirect to itself.');
                                }
                            },
                        ]),
                    Forms\Components\Toggle::make('is_active')->label('Active')->default(true)->inline(false),
                    Forms\Components\TextInput::make('notes')->placeholder('Why this redirect exists (optional)')->maxLength(500),
                ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        $site = rtrim((string) Setting::get('site_url', 'https://www.pixelpopers.com'), '/');

        return $table
            ->columns([
                Tables\Columns\TextColumn::make('from_path')->label('Old address')->searchable()->weight('bold')->copyable()
                    ->description(fn (Redirect $record) => $record->notes),
                Tables\Columns\TextColumn::make('to_url')->label('Goes to')->searchable()->placeholder('— gone (410)')
                    ->formatStateUsing(fn (?string $state) => $state ? '→ '.$state : null),
                Tables\Columns\TextColumn::make('status_code')->label('Type')->badge()
                    ->color(fn (int $state) => match ($state) { 301 => 'success', 302 => 'warning', default => 'gray' }),
                Tables\Columns\ToggleColumn::make('is_active')->label('Active'),
                Tables\Columns\TextColumn::make('updated_at')->label('Updated')->since()->sortable()->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status_code')->label('Type')->options(Redirect::STATUSES),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->recordActions([
                Actions\Action::make('test')->label('Test')->icon('heroicon-o-arrow-top-right-on-square')->color('gray')
                    ->url(fn (Redirect $record) => $record->isWildcard() ? null : $site.$record->from_path, shouldOpenInNewTab: true)
                    ->hidden(fn (Redirect $record) => $record->isWildcard()),
                Actions\EditAction::make(),
            ])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->defaultSort('from_path')
            ->emptyStateHeading('No redirects yet')
            ->emptyStateDescription('Add old addresses that Google still lists, one at a time or many at once with “Add many”.');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRedirects::route('/'),
            'create' => Pages\CreateRedirect::route('/create'),
            'edit' => Pages\EditRedirect::route('/{record}/edit'),
        ];
    }
}
