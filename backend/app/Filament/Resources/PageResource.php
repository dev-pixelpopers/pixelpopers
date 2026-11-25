<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Filament\Support\ContentForm;
use App\Filament\Support\Fields;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Setting;
use App\Support\Navigation;
use App\Support\SectionLibrary;
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
 * The site's own pages map to routes the frontend already has, so they're
 * edited here, never created or deleted. Pages built here ("New page") are
 * custom: a list of sections copied from other pages (see SectionLibrary),
 * shown on the website at /{slug}; they can be renamed, rearranged and deleted.
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
                        ->label('Address')
                        ->prefix('/')
                        ->disabled(fn (?Page $record) => $record && ! $record->is_custom)
                        ->dehydrated(fn (?Page $record) => ! $record || $record->is_custom)
                        ->required(fn (?Page $record) => ! $record || $record->is_custom)
                        ->maxLength(80)
                        // Only a custom page's address is checked; the site's own are fixed.
                        ->rules(fn (?Page $record) => $record && ! $record->is_custom ? [] : [
                            'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                            \Illuminate\Validation\Rule::notIn(SectionLibrary::RESERVED_SLUGS),
                            \Illuminate\Validation\Rule::unique('pages', 'slug')->ignore($record?->getKey()),
                        ])
                        ->validationMessages([
                            'regex' => 'Use lowercase letters, numbers and single hyphens, e.g. web-design-london.',
                            'not_in' => 'That address belongs to one of the site’s own pages.',
                        ])
                        ->helperText(fn (?Page $record) => $record && ! $record->is_custom
                            ? 'Matches a route on the website, so it can’t be changed here.'
                            : 'Lowercase words joined by hyphens. Changing it later breaks old links — add a redirect under SEO → Redirects if you do.'),
                    Forms\Components\Toggle::make('is_published')->label('Published')->default(true)->inline(false)
                        ->helperText('Off: the page is removed from the header menu, footer and sitemap, and its address shows “not found”.')
                        ->disabled(fn (?Page $record) => $record?->slug === 'home'),
                ]),
                SchemaComponents\Section::make('Start with')
                    ->description('Pick the sections this page starts with — each is copied with its content, which you then edit on its own tab. You can add more, reorder and remove them after saving.')
                    ->visibleOn('create')
                    ->schema([
                        Forms\Components\Select::make('copy_page')
                            ->label('Every section of a page')
                            ->options(fn () => Page::where('slug', '!=', 'home')->orderBy('is_custom')->orderBy('sort_order')->pluck('title', 'id')->all())
                            ->placeholder('— none —')
                            ->helperText('E.g. start from About and change what you need.'),
                        Forms\Components\Select::make('copy_sections')
                            ->label('…and/or individual sections')
                            ->multiple()
                            ->searchable()
                            ->options(fn () => SectionLibrary::sources())
                            ->helperText('Added in the order you pick them, after the whole page’s sections.'),
                    ])->columns(2),
                SchemaComponents\Section::make('Navigation')
                    ->description('Where links to this page appear. Arrange the menus under Settings → Navigation.')
                    ->columns(3)
                    ->schema([
                        Forms\Components\Toggle::make('nav_in_main')->label('Show in the main menu')->inline(false),
                        Forms\Components\Toggle::make('nav_in_footer')->label('Show in the footer')->inline(false),
                        Forms\Components\TextInput::make('nav_label')->label('Link text (optional)')->placeholder('The page’s title')->maxLength(60)
                            ->helperText('Leave empty to use the title.'),
                    ]),
                Fields::seo()->description(fn (?Page $record) => $record?->slug === 'home'
                    ? 'These are the home page’s own tags — what Google shows for www.pixelpopers.com. Leave a field empty to use Site settings → SEO defaults instead.'
                    : ($record?->is_custom || ! $record
                        ? 'This page’s own tags. Empty title: the page name + “| Pixel Popers”; empty description: Site settings → SEO defaults.'
                        : 'This page’s own tags. Leave a field empty to use the built-in text for this page.')),
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

        $design = $section->page?->is_custom ? SectionLibrary::label(SectionLibrary::typeOf($section)) : null;

        return SchemaComponents\Tabs\Tab::make($section->label)
            ->key('section-'.$section->key)
            ->icon($section->is_published ? 'heroicon-o-eye' : 'heroicon-o-eye-slash')
            ->schema([
                ...($design ? [SchemaComponents\Text::make("Design: {$design}. Rename, reorder or remove sections with “Arrange sections” at the top.")->color('gray')] : []),
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

    /** "Duplicate": a new page (built here) with a copy of this page's sections and tags. */
    public static function duplicateAction(): Actions\Action
    {
        return Actions\Action::make('duplicate')
            ->label('Duplicate')
            ->icon('heroicon-o-document-duplicate')
            ->color('gray')
            ->visible(fn (Page $record) => $record->slug !== 'home')
            ->modalHeading(fn (Page $record) => "Duplicate “{$record->title}”")
            ->modalDescription(function (Page $record) {
                $skipped = SectionLibrary::notCopyable($record);

                return 'A new page with a copy of every section and its search & sharing tags (except the meta title — give the copy its own). The copy is edited separately from the original.'
                    .($skipped ? ' Not copied, as they only work on their own page: '.implode(', ', $skipped).'.' : '');
            })
            ->modalSubmitActionLabel('Duplicate')
            ->fillForm(fn (Page $record) => ['title' => $record->title.' (copy)', 'slug' => \Illuminate\Support\Str::slug($record->title.' copy'), 'published' => false])
            ->schema([
                Forms\Components\TextInput::make('title')->required()->maxLength(255),
                Forms\Components\TextInput::make('slug')->label('Address')->prefix('/')->required()->maxLength(80)
                    ->rules([
                        'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                        \Illuminate\Validation\Rule::notIn(SectionLibrary::RESERVED_SLUGS),
                        \Illuminate\Validation\Rule::unique('pages', 'slug'),
                    ])
                    ->validationMessages([
                        'regex' => 'Use lowercase letters, numbers and single hyphens, e.g. web-design-london.',
                        'not_in' => 'That address belongs to one of the site’s own pages.',
                    ]),
                Forms\Components\Toggle::make('published')->label('Publish straight away')
                    ->helperText('Off: edit the copy first, then switch on Published.'),
            ])
            ->action(function (Page $record, array $data, $livewire): void {
                $copy = SectionLibrary::duplicate($record, $data['title'], $data['slug'], (bool) ($data['published'] ?? false));
                \Filament\Notifications\Notification::make()->title("“{$copy->title}” created")->success()->send();
                $livewire->redirect(static::getUrl('edit', ['record' => $copy]));
            });
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('slug')->label('Address')->badge()->color('gray')->formatStateUsing(fn (string $state) => $state === 'home' ? '/' : '/'.$state),
                Tables\Columns\TextColumn::make('is_custom')->label('Type')->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'Built here' : 'Site page')
                    ->color(fn (bool $state) => $state ? 'info' : 'gray'),
                Tables\Columns\TextColumn::make('sections_count')->counts('sections')->label('Sections'),
                Tables\Columns\ToggleColumn::make('is_published')->label('Published')
                    ->tooltip('Off hides the page and its menu links on the website.')
                    ->disabled(fn (Page $record) => $record->slug === 'home'),
                Tables\Columns\TextColumn::make('updated_at')->since()->label('Updated')->sortable(),
            ])
            ->recordActions([
                Actions\Action::make('view')->label('View')->icon('heroicon-o-arrow-top-right-on-square')->color('gray')
                    ->url(fn (Page $record) => rtrim((string) Setting::get('site_url', 'https://www.pixelpopers.com'), '/').($record->slug === 'home' ? '/' : '/'.$record->slug), shouldOpenInNewTab: true),
                Actions\EditAction::make(),
                self::duplicateAction(),
                Actions\DeleteAction::make()->visible(fn (Page $record) => $record->is_custom)
                    ->modalDescription('The page and its sections are deleted. Its address will show “not found” — add a redirect under SEO → Redirects if it was shared or indexed.'),
            ])
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function canCreate(): bool
    {
        return true;
    }

    /** Only pages built here; the site's own pages always exist. */
    public static function canDelete($record): bool
    {
        return (bool) $record?->is_custom;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
