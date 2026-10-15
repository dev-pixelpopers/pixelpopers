<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\Support\Fields;
use App\Models\Service;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

/**
 * A service: its /services/{slug} page (hero, overview, what's included,
 * process, audience, insights, why us, tools, stats, packages, FAQs, CTA)
 * and its giant-letter tile on the home page.
 */
class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-sparkles';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'name';

    /** A section's show/hide switch; a service without a saved choice shows everything. */
    private static function visible(string $key): Forms\Components\Toggle
    {
        return Forms\Components\Toggle::make("visibility.{$key}")
            ->label('Show “'.Service::SECTIONS[$key].'” on the page')
            ->formatStateUsing(fn ($state) => $state ?? true)
            ->default(true)
            ->onColor('success')
            ->columnSpanFull();
    }

    /** Title + body pairs (included, process, audience, insights). */
    private static function items(string $name, string $label, string $help): Forms\Components\Repeater
    {
        return Forms\Components\Repeater::make($name)->label($label)->helperText($help)
            ->schema([
                Forms\Components\TextInput::make('title')->required(),
                Forms\Components\Textarea::make('body')->rows(3)->autosize()->required(),
            ])
            ->itemLabel(fn (array $state) => $state['title'] ?? null)
            ->reorderable()->cloneable()->collapsible()->collapsed()
            ->addActionLabel('Add item')
            ->columnSpanFull();
    }

    private static function paragraphs(string $name): Forms\Components\Repeater
    {
        return Forms\Components\Repeater::make($name)->label('Paragraphs')
            ->simple(Forms\Components\Textarea::make('value')->rows(4)->autosize()->required())
            ->reorderable()->addActionLabel('Add paragraph')->columnSpanFull();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Tabs::make('Service')->persistTabInQueryString()->tabs([
                SchemaComponents\Tabs\Tab::make('Basics')->icon('heroicon-o-identification')->schema([
                    SchemaComponents\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('name')->required()->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true)
                            ->helperText('The page lives at /services/{slug}.'),
                        Fields::tone('accent', 'Accent colour'),
                    ]),
                    Forms\Components\TagsInput::make('hero_lines')->label('Hero headline lines')
                        ->helperText('Three lines, in order (e.g. BRAND / IDENTITY / THAT STICKS).')->reorderable(),
                    Forms\Components\Textarea::make('hero_intro')->label('Hero intro')->rows(2),
                    SchemaComponents\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('hero_cta')->label('Hero button label'),
                        Forms\Components\Toggle::make('is_published')->label('Published')->inline(false)->default(true),
                        Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Overview')->icon('heroicon-o-book-open')->schema([
                    self::visible('overview'),
                    SchemaComponents\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('overview.eyebrow')->label('Eyebrow'),
                        Forms\Components\TextInput::make('overview.heading')->label('Heading'),
                    ]),
                    self::paragraphs('overview.paragraphs'),
                ]),
                SchemaComponents\Tabs\Tab::make('Included & process')->icon('heroicon-o-list-bullet')->schema([
                    self::visible('included'),
                    self::items('included', 'What’s included', 'The cards under “Everything in the box”.'),
                    self::visible('process'),
                    self::items('process', 'Process steps', 'Shown as numbered chapters, in this order.'),
                ]),
                SchemaComponents\Tabs\Tab::make('Audience & insights')->icon('heroicon-o-user-group')->schema([
                    self::visible('audience'),
                    self::items('audience', 'Who it’s for', 'The “Made for brands like yours” cards.'),
                    self::visible('insights'),
                    self::items('insights', 'Short guide', 'Three explainers answering common searches about this service.'),
                ]),
                SchemaComponents\Tabs\Tab::make('Why us, tools & stats')->icon('heroicon-o-trophy')->schema([
                    self::visible('why_us'),
                    Forms\Components\TextInput::make('why_us.heading')->label('Why us heading'),
                    self::paragraphs('why_us.paragraphs'),
                    Forms\Components\TagsInput::make('tools')->label('Tools we use')->reorderable(),
                    Forms\Components\Repeater::make('stats')->label('Stats')
                        ->schema([
                            Forms\Components\TextInput::make('value')->required()->placeholder('120+'),
                            Forms\Components\TextInput::make('label')->required(),
                        ])->columns(2)->reorderable()->addActionLabel('Add stat')->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('Packages')->icon('heroicon-o-currency-dollar')->schema([
                    self::visible('packages'),
                    Forms\Components\Repeater::make('packages')->label('')
                        ->schema([
                            Forms\Components\TextInput::make('name')->required(),
                            Forms\Components\TextInput::make('price')->required()->placeholder('From $1,500'),
                            Forms\Components\TextInput::make('timeline')->placeholder('2–3 weeks'),
                            Forms\Components\Toggle::make('popular')->label('Most popular')->inline(false),
                            Forms\Components\Textarea::make('summary')->rows(2)->columnSpanFull(),
                            Forms\Components\TagsInput::make('features')->reorderable()->columnSpanFull(),
                        ])
                        ->columns(2)
                        ->itemLabel(fn (array $state) => trim(($state['name'] ?? '').' · '.($state['price'] ?? ''), ' ·'))
                        ->reorderable()->cloneable()->collapsible()->addActionLabel('Add package')->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('FAQs & CTA')->icon('heroicon-o-question-mark-circle')->schema([
                    self::visible('faqs'),
                    Forms\Components\Repeater::make('faqs')->label('FAQs')
                        ->schema([
                            Forms\Components\TextInput::make('q')->label('Question')->required(),
                            Forms\Components\Textarea::make('a')->label('Answer')->rows(3)->autosize()->required(),
                        ])
                        ->itemLabel(fn (array $state) => $state['q'] ?? null)
                        ->reorderable()->collapsible()->collapsed()->addActionLabel('Add question')->columnSpanFull(),
                    self::visible('more'),
                    self::visible('cta'),
                    SchemaComponents\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('cta_heading')->label('Closing heading'),
                        Forms\Components\TextInput::make('cta_button')->label('Closing button label'),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Home tile')->icon('heroicon-o-squares-plus')->schema([
                    SchemaComponents\Section::make('Giant letter on the home page')
                        ->description('Positions are fractions of the tile (0–1), taken from the design. Leave them unless the letter changes.')
                        ->schema([
                            SchemaComponents\Grid::make(2)->schema([
                                Forms\Components\TextInput::make('tile.letter')->label('Letter')->maxLength(1),
                                Forms\Components\Select::make('tile.fill')->label('Letter fill')->native(false)->options([
                                    'outline' => 'Outline', 'grape' => 'Grape', 'sunbeam' => 'Sunbeam', 'photo' => 'Photo (shows media on hover)',
                                ]),
                                Forms\Components\TextInput::make('tile.label.x')->label('Label X')->numeric()->step(0.001),
                                Forms\Components\TextInput::make('tile.label.y')->label('Label Y')->numeric()->step(0.001),
                                Forms\Components\TextInput::make('tile.dot.x')->label('Dot X')->numeric()->step(0.001),
                                Forms\Components\TextInput::make('tile.dot.y')->label('Dot Y')->numeric()->step(0.001),
                            ]),
                            SchemaComponents\Grid::make(2)->schema([
                                Forms\Components\Select::make('tile.media.type')->label('Hover media type')->native(false)
                                    ->options(['image' => 'Image', 'video' => 'Video']),
                                Fields::media('tile.media.src', 'Hover media'),
                            ]),
                        ]),
                ]),
                SchemaComponents\Tabs\Tab::make('SEO')->icon('heroicon-o-magnifying-glass')->schema([
                    Fields::seo('meta_title', 'meta_description'),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold')
                    ->description(fn (Service $record) => '/services/'.$record->slug),
                Tables\Columns\TextColumn::make('tile.letter')->label('Tile')->badge(),
                Tables\Columns\TextColumn::make('accent')->badge(),
                Tables\Columns\ToggleColumn::make('is_published')->label('Published'),
                Tables\Columns\TextColumn::make('updated_at')->since()->label('Updated'),
            ])
            ->recordActions([Actions\EditAction::make()])
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->paginated(false);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
