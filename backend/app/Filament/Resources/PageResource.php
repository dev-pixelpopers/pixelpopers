<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Filament\Support\ContentForm;
use App\Filament\Support\Fields;
use App\Models\Page;
use App\Models\PageSection;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

/**
 * The site's pages. Each page is edited on one screen: a "Page & SEO" tab,
 * then one tab per section of that page (Hero, Values, FAQ, …) in page
 * order — the same layout as the logo-bloom CMS.
 *
 * Section fields are generated from each section's stored schema (see
 * ContentForm) and live in the form under `sections_content.{key}`, with
 * `sections_visible.{key}` for the "show this section" switch. EditPage
 * loads them from and saves them back to the page_sections table, so every
 * tab is connected to the section the website renders.
 *
 * Pages map to routes the frontend already has, so they're edited here,
 * never created or deleted.
 */
class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Tabs::make('Page')
                ->vertical()
                ->persistTabInQueryString()
                ->tabs(fn (?Page $record): array => [
                    self::pageTab(),
                    ...($record?->sections ?? collect())->map(fn (PageSection $section) => self::sectionTab($section))->all(),
                ])
                ->columnSpanFull(),
        ]);
    }

    private static function pageTab(): SchemaComponents\Tabs\Tab
    {
        return SchemaComponents\Tabs\Tab::make('Page & SEO')
            ->icon('heroicon-o-cog-6-tooth')
            ->schema([
                SchemaComponents\Grid::make(3)->schema([
                    Forms\Components\TextInput::make('title')->required()->maxLength(255),
                    Forms\Components\TextInput::make('slug')
                        ->disabled()
                        ->dehydrated(false)
                        ->helperText('Matches a route on the website, so it can’t be changed here.'),
                    Forms\Components\Toggle::make('is_published')->label('Published')->inline(false),
                ]),
                Fields::seo(),
                SchemaComponents\Section::make('Indexing')->collapsed()->schema([
                    Forms\Components\TextInput::make('seo_keywords')->label('Meta keywords')->helperText('Comma-separated. Search engines mostly ignore these.'),
                    Forms\Components\Select::make('robots')->options([
                        'index, follow' => 'Index, follow (recommended)',
                        'noindex, follow' => 'No index, follow',
                        'index, nofollow' => 'Index, no follow',
                        'noindex, nofollow' => 'No index, no follow',
                    ])->default('index, follow')->native(false),
                ]),
            ]);
    }

    private static function sectionTab(PageSection $section): SchemaComponents\Tabs\Tab
    {
        $fields = $section->schema['fields'] ?? ContentForm::infer($section->content ?? [])['fields'] ?? [];

        return SchemaComponents\Tabs\Tab::make($section->label)
            ->key('section-'.$section->key)
            ->icon($section->is_published ? 'heroicon-o-eye' : 'heroicon-o-eye-slash')
            ->schema([
                Forms\Components\Toggle::make("sections_visible.{$section->key}")
                    ->label('Show this section on the website')
                    ->disabled(self::isLocked($section))
                    ->helperText(self::isLocked($section)
                        ? 'This section is part of the home page’s scroll animation (each one tucks under the one before), so it always shows. Its content is fully editable below.'
                        : null),
                SchemaComponents\Grid::make(2)->schema(ContentForm::components($fields, "sections_content.{$section->key}")),
            ]);
    }

    /** Home page sections chained into one scroll choreography can't be hidden. */
    private static function isLocked(PageSection $section): bool
    {
        return $section->page?->slug === 'home' && $section->key !== 'blog';
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('slug')->badge()->color('gray'),
                Tables\Columns\TextColumn::make('sections_count')->counts('sections')->label('Sections'),
                Tables\Columns\IconColumn::make('is_published')->boolean()->label('Published'),
                Tables\Columns\TextColumn::make('updated_at')->since()->label('Updated')->sortable(),
            ])
            ->recordActions([Actions\EditAction::make()])
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
