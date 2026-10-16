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

    /** The keys the web development page shows until the stack is edited (matches the website's defaults). */
    private const DEFAULT_STACK_KEYS = [
        ['label' => 'Next.js', 'tone' => 'white'],
        ['label' => 'React', 'tone' => 'lagoon'],
        ['label' => 'TypeScript', 'tone' => 'grape'],
        ['label' => 'Tailwind', 'tone' => 'lagoon'],
        ['label' => 'Webflow', 'tone' => 'blush', 'pressed' => true],
        ['label' => 'Shopify', 'tone' => 'sunbeam'],
        ['label' => 'WordPress', 'tone' => 'grape'],
        ['label' => 'Node.js', 'tone' => 'white'],
        ['label' => 'Sanity', 'tone' => 'blush'],
        ['label' => 'Vercel', 'tone' => 'white'],
        ['label' => 'Figma', 'tone' => 'sunbeam'],
        ['label' => 'GSAP', 'tone' => 'lagoon'],
    ];

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
                SchemaComponents\Tabs\Tab::make('Stack')->icon('heroicon-o-command-line')
                    ->visible(fn (?Service $record) => $record?->slug === 'web-development')
                    ->schema([
                        SchemaComponents\Text::make('The “The stack” section: the heading beside the keyboard and its keys. Empty text fields keep the design’s wording.'),
                        SchemaComponents\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('stack.eyebrow')->label('Eyebrow')->placeholder('The stack'),
                            Forms\Components\Textarea::make('stack.heading')->label('Heading')->rows(2)->placeholder("Modern tools.\nNo duct tape.")->helperText('Each line shows on its own line.'),
                            Forms\Components\Textarea::make('stack.intro')->label('Intro')->rows(2)->columnSpanFull()
                                ->placeholder('We pick the right tool for the job — not the trendiest one — so your site is fast today and easy to grow tomorrow.'),
                        ]),
                        Forms\Components\Repeater::make('stack.keys')->label('Keys')
                            ->helperText('One key per tool, in order (four per row on wide screens). The icon is optional: a square PNG, SVG or WebP with a transparent background works best.')
                            ->formatStateUsing(fn ($state) => $state ?: self::DEFAULT_STACK_KEYS)
                            ->schema([
                                Forms\Components\TextInput::make('label')->label('Name')->required(),
                                Forms\Components\Select::make('tone')->label('Colour')->native(false)->default('white')->options([
                                    'white' => 'White', 'lagoon' => 'Lagoon (teal)', 'grape' => 'Grape (purple)', 'blush' => 'Blush (pink)', 'sunbeam' => 'Sunbeam (yellow)',
                                ]),
                                Fields::media('icon', 'Icon')->columnSpanFull(),
                                Forms\Components\Toggle::make('pressed')->label('Show pressed down')->inline(false),
                            ])
                            ->columns(2)
                            ->itemLabel(fn (array $state) => $state['label'] ?? null)
                            ->reorderable()->cloneable()->collapsible()->collapsed()
                            ->addActionLabel('Add key')
                            ->columnSpanFull(),
                    ]),
                SchemaComponents\Tabs\Tab::make('Social account')->icon('heroicon-o-at-symbol')
                    ->visible(fn (?Service $record) => $record?->slug === 'digital-marketing')
                    ->schema([
                        SchemaComponents\Text::make('The account shown on the phone mock-ups (the sponsored post in the hero and the profile in “Social media”). Leave a field empty to keep the design’s text. The profile picture and grid photos are in the Images tab.'),
                        SchemaComponents\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('social.handle')->label('Account name')->placeholder('fifthsip.cafe'),
                            Forms\Components\TextInput::make('social.followLabel')->label('Profile button')->placeholder('Follow'),
                            Forms\Components\Textarea::make('social.bio')->label('Bio')->rows(3)->placeholder('Coffee that tastes like Saturday ☕️')->columnSpanFull(),
                        ]),
                        SchemaComponents\Grid::make(3)->schema([
                            Forms\Components\TextInput::make('social.posts')->label('Posts')->placeholder('248'),
                            Forms\Components\TextInput::make('social.followers')->label('Followers')->placeholder('32.1K'),
                            Forms\Components\TextInput::make('social.following')->label('Following')->placeholder('180'),
                        ]),
                        SchemaComponents\Section::make('Sponsored post (hero)')->schema([
                            SchemaComponents\Grid::make(2)->schema([
                                Forms\Components\TextInput::make('social.likes')->label('Likes line')->placeholder('12,480 likes'),
                                Forms\Components\TextInput::make('social.ctaLabel')->label('Post button')->placeholder('Shop now'),
                                Forms\Components\TextInput::make('social.caption')->label('Caption (after the account name)')->placeholder('the 5th sip hits different ☕️ #newdrop')->columnSpanFull(),
                            ]),
                        ]),
                    ]),
                SchemaComponents\Tabs\Tab::make('Images')->icon('heroicon-o-photo')->schema(fn (?Service $record) => self::imageSlots($record)),
                SchemaComponents\Tabs\Tab::make('SEO')->icon('heroicon-o-magnifying-glass')->schema([
                    Fields::seo('meta_title', 'meta_description'),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    /** One upload per picture in the page's design, grouped by page section; an empty slot keeps the built-in image. */
    private static function imageSlots(?Service $record): array
    {
        $slots = Service::IMAGE_SLOTS[$record?->slug] ?? [];
        if ($slots === []) {
            return [SchemaComponents\Text::make('This service uses the standard layout, which has no design images to replace.')];
        }

        $site = rtrim((string) config('app.frontend_url'), '/');
        $groups = [];
        foreach ($slots as $slot => [$default, $label, $section]) {
            $groups[$section][] = Fields::media("images.{$slot}", $label, str_ends_with($default, '.mp4') ? 'video' : 'image')
                ->placeholder($default === '' ? 'Not set' : 'Original: '.$default)
                ->helperText($default === ''
                    ? 'Optional. Use Upload to add one; empty keeps the design’s placeholder.'
                    : new \Illuminate\Support\HtmlString('Empty = original (<a href="'.e($site.$default).'" target="_blank" rel="noopener" class="underline">view</a>). Use Upload to replace it.'));
        }

        return [
            SchemaComponents\Text::make('Upload a replacement for any picture on this service’s page, section by section. Leave a slot empty to keep the original. Use the same proportions as the original for the best fit.'),
            ...array_map(
                fn (string $section, array $fields) => SchemaComponents\Section::make($section)->collapsible()->schema([SchemaComponents\Grid::make(2)->schema($fields)]),
                array_keys($groups),
                $groups,
            ),
        ];
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
