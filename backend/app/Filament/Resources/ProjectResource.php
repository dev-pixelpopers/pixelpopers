<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Filament\Support\Fields;
use App\Models\Project;
use App\Support\Media;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

/** A case study: its card on /work and its /work/{slug} page. */
class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Case studies';

    protected static ?string $modelLabel = 'case study';

    protected static ?int $navigationSort = 4;

    protected static ?string $recordTitleAttribute = 'name';

    public const CATEGORIES = [
        'branding' => 'Branding',
        'ui-ux' => 'UI/UX',
        'web' => 'Web',
        'motion' => 'Motion',
        'marketing' => 'Marketing',
    ];

    private static function galleryImage(): array
    {
        return [
            Fields::media('src', 'Image')->columnSpanFull(),
            Forms\Components\TextInput::make('alt')->label('Alt text')->columnSpanFull(),
            Forms\Components\TextInput::make('w')->label('Width (px)')->numeric(),
            Forms\Components\TextInput::make('h')->label('Height (px)')->numeric(),
            Forms\Components\TextInput::make('position')->label('Focal point')->placeholder('50% 50%'),
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Tabs::make('Case study')->persistTabInQueryString()->tabs([
                SchemaComponents\Tabs\Tab::make('Card')->icon('heroicon-o-rectangle-stack')->schema([
                    SchemaComponents\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('name')->required()->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true)->helperText('Lives at /work/{slug}.'),
                        Forms\Components\TextInput::make('client'),
                        Forms\Components\TextInput::make('year')->numeric()->minValue(2000)->maxValue(2100),
                        Forms\Components\Select::make('month')->native(false)
                            ->options(collect(range(1, 12))->mapWithKeys(fn ($m) => [$m => date('F', mktime(0, 0, 0, $m, 1))])->all())
                            ->helperText('Orders projects within a year.'),
                        Fields::tone('accent', 'Accent colour'),
                    ]),
                    Forms\Components\TextInput::make('tagline')->helperText('The small line under the card title, e.g. “Branding · Web · Motion”.'),
                    Forms\Components\Textarea::make('description')->rows(2),
                    Forms\Components\CheckboxList::make('categories')->options(self::CATEGORIES)->columns(5)
                        ->helperText('Which filters on /work show this project.'),
                    SchemaComponents\Grid::make(3)->schema([
                        Forms\Components\Toggle::make('featured')->helperText('Shown large at the top of /work.')->inline(false),
                        Forms\Components\Toggle::make('is_published')->label('Published')->default(true)->inline(false),
                        Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
                    ]),
                    SchemaComponents\Section::make('Cover')->columns(2)->schema([
                        ...Fields::image('cover', 'Cover image', withPosition: true),
                        Forms\Components\ColorPicker::make('cover_bg')->label('Background colour')->helperText('Behind the cover while it loads.'),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Story')->icon('heroicon-o-pencil')->schema([
                    SchemaComponents\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('discipline')->helperText('Big kicker above the title.'),
                        Forms\Components\TextInput::make('timeline')->placeholder('6 weeks'),
                        Forms\Components\TextInput::make('sticker')->placeholder('Live in 40+ stores'),
                    ]),
                    Forms\Components\TagsInput::make('services')->label('Services (meta row)')->reorderable(),
                    SchemaComponents\Section::make('Intro')->columns(2)->schema([
                        Forms\Components\Textarea::make('intro.challenge')->label('The challenge')->rows(4)->autosize(),
                        Forms\Components\Textarea::make('intro.approach')->label('The approach')->rows(4)->autosize(),
                    ]),
                    SchemaComponents\Section::make('The full story')->schema([
                        Forms\Components\Textarea::make('story.lead')->label('Lead')->rows(2),
                        Forms\Components\Textarea::make('story.challenge')->label('Challenge')->rows(6)->autosize(),
                        Forms\Components\Textarea::make('story.approach')->label('Approach')->rows(6)->autosize(),
                        Forms\Components\Textarea::make('story.results')->label('Results')->rows(6)->autosize(),
                        Forms\Components\Textarea::make('story.clientQuote')->label('Client quote (long)')->rows(3)->autosize(),
                    ]),
                    SchemaComponents\Section::make('Pull quote')->columns(2)->schema([
                        Forms\Components\Textarea::make('quote.text')->label('Quote')->rows(2)->columnSpanFull(),
                        Forms\Components\TextInput::make('quote.author')->label('Author'),
                        Forms\Components\TextInput::make('quote.since')->label('Client since')->placeholder('Client since 2025'),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Results')->icon('heroicon-o-chart-bar')->schema([
                    Forms\Components\Repeater::make('results')->label('')
                        ->schema([
                            Forms\Components\TextInput::make('value')->required()->placeholder('+180%'),
                            Forms\Components\TextInput::make('label')->required(),
                        ])->columns(2)->reorderable()->addActionLabel('Add result')->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('Brand')->icon('heroicon-o-swatch')->schema([
                    SchemaComponents\Section::make('Detail image')->columns(2)->schema(Fields::image('brand.detail', 'Detail image', withPosition: true)),
                    Forms\Components\Repeater::make('brand.swatches')->label('Colour swatches')
                        ->schema([
                            Forms\Components\TextInput::make('name')->required(),
                            Forms\Components\ColorPicker::make('hex')->required(),
                            Forms\Components\Toggle::make('dark')->label('Use dark text')->inline(false),
                        ])->columns(3)->reorderable()->addActionLabel('Add swatch')->columnSpanFull(),
                    SchemaComponents\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('brand.type.display')->label('Display typeface'),
                        Forms\Components\TextInput::make('brand.type.body')->label('Body typeface'),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Gallery')->icon('heroicon-o-photo')->schema([
                    Forms\Components\TextInput::make('gallery_heading')->label('Gallery heading'),
                    Forms\Components\Repeater::make('gallery')->label('Images')->helperText('The layout shows exactly three images.')
                        ->schema(self::galleryImage())->columns(3)->minItems(3)->maxItems(3)
                        ->itemLabel(fn (array $state) => $state['alt'] ?? null)
                        ->reorderable()->collapsible()->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('Delivered & team')->icon('heroicon-o-clipboard-document-check')->schema([
                    Forms\Components\Textarea::make('delivered.intro')->label('What we delivered — intro')->rows(2),
                    Forms\Components\TagsInput::make('delivered.items')->label('Deliverables')->reorderable(),
                    Forms\Components\Repeater::make('phases')->label('Timeline phases')->helperText('Weeks, counted from 0.')
                        ->schema([
                            Forms\Components\TextInput::make('label')->required(),
                            Forms\Components\TextInput::make('start')->numeric()->required(),
                            Forms\Components\TextInput::make('end')->numeric()->required(),
                            Fields::tone('color', 'Colour'),
                        ])->columns(4)->reorderable()->addActionLabel('Add phase')->columnSpanFull(),
                    Forms\Components\Repeater::make('team')->label('The team behind it')
                        ->schema([
                            Forms\Components\TextInput::make('name')->required(),
                            Forms\Components\TextInput::make('role')->required(),
                        ])->columns(2)->reorderable()->addActionLabel('Add person')->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('SEO')->icon('heroicon-o-magnifying-glass')->schema([
                    Fields::seo()->description('Leave empty to use the project name and description.'),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_url')->label('')
                    ->state(fn (Project $record) => Media::absolute($record->cover['src'] ?? null))
                    ->imageHeight(40)->extraImgAttributes(['class' => 'rounded-md object-cover']),
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold')->description(fn (Project $record) => $record->tagline),
                Tables\Columns\TextColumn::make('client')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('year')->sortable(),
                Tables\Columns\IconColumn::make('featured')->boolean(),
                Tables\Columns\ToggleColumn::make('is_published')->label('Published'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('featured'),
                Tables\Filters\TernaryFilter::make('is_published')->label('Published'),
            ])
            ->recordActions([
                Actions\EditAction::make(),
                Actions\ReplicateAction::make()->label('Duplicate')
                    ->beforeReplicaSaved(function (Project $replica): void {
                        // Slugs are unique; a copy starts as an unpublished draft.
                        $replica->slug = $replica->slug.'-copy-'.Str::lower(Str::random(4));
                        $replica->name = $replica->name.' (copy)';
                        $replica->is_published = false;
                    }),
            ])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->reorderable('sort_order')
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
