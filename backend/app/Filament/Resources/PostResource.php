<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Filament\Resources\PostResource\RelationManagers\CommentsRelationManager;
use App\Filament\Support\Fields;
use App\Models\Post;
use App\Support\Media;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Components\Builder\Block;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Blog posts. The article body is a list of typed blocks edited with a block
 * builder. The site stores blocks flat ({type, text, …}); Filament's builder
 * keeps each block's fields under `data`, so the Create/Edit pages convert
 * with toBuilder() / fromBuilder().
 */
class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-newspaper';

    protected static string|\UnitEnum|null $navigationGroup = 'Blog';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    /** @param  array<int, array<string, mixed>>|null  $blocks */
    public static function toBuilder(?array $blocks): array
    {
        return collect($blocks ?? [])
            ->map(fn (array $block) => ['type' => $block['type'] ?? 'p', 'data' => Arr::except($block, 'type')])
            ->all();
    }

    /** @param  array<int|string, array<string, mixed>>|null  $state */
    public static function fromBuilder(?array $state): array
    {
        return collect($state ?? [])
            ->values()
            ->map(fn (array $item) => ['type' => $item['type']] + ($item['data'] ?? []))
            ->all();
    }

    private static function preview(string $label, ?array $state, string $field = 'text'): string
    {
        $text = is_string($state[$field] ?? null) ? Str::limit(strip_tags($state[$field]), 70) : '';

        return $text === '' ? $label : $label.' — '.$text;
    }

    private static function blocks(): array
    {
        $tone = Fields::tone('tone', 'Colour');

        return [
            Block::make('p')->label(fn (?array $state) => self::preview('Paragraph', $state))->icon('heroicon-o-bars-3-bottom-left')
                ->schema([Forms\Components\Textarea::make('text')->hiddenLabel()->rows(4)->autosize()->required()]),
            Block::make('h2')->label(fn (?array $state) => self::preview('Heading', $state))->icon('heroicon-o-h2')
                ->schema([Forms\Components\TextInput::make('text')->hiddenLabel()->required()]),
            Block::make('list')->label('Bulleted list')->icon('heroicon-o-list-bullet')
                ->schema([Forms\Components\Repeater::make('items')->hiddenLabel()
                    ->simple(Forms\Components\Textarea::make('value')->rows(2)->autosize()->required())
                    ->reorderable()->addActionLabel('Add point')]),
            Block::make('steps')->label('Numbered steps')->icon('heroicon-o-numbered-list')
                ->schema([Forms\Components\Repeater::make('items')->hiddenLabel()
                    ->simple(Forms\Components\Textarea::make('value')->rows(2)->autosize()->required())
                    ->reorderable()->addActionLabel('Add step')]),
            Block::make('quote')->label(fn (?array $state) => self::preview('Pull quote', $state))->icon('heroicon-o-chat-bubble-bottom-center-text')
                ->schema([Forms\Components\Textarea::make('text')->hiddenLabel()->rows(2)->required()]),
            Block::make('stats')->label('Stat cards')->icon('heroicon-o-chart-bar')
                ->schema([Forms\Components\Repeater::make('items')->hiddenLabel()
                    ->schema([
                        Forms\Components\TextInput::make('value')->required()->placeholder('2.4×'),
                        Forms\Components\TextInput::make('label')->required(),
                        $tone,
                    ])->columns(3)->reorderable()->addActionLabel('Add stat')]),
            Block::make('image')->label(fn (?array $state) => self::preview('Image', $state, 'alt'))->icon('heroicon-o-photo')
                ->schema([
                    Fields::media('src', 'Image')->required()->columnSpanFull(),
                    Forms\Components\TextInput::make('alt')->label('Alt text')->required()->columnSpanFull(),
                    Forms\Components\TextInput::make('width')->label('Width (px)')->numeric()->required(),
                    Forms\Components\TextInput::make('height')->label('Height (px)')->numeric()->required(),
                    Forms\Components\TextInput::make('caption')->columnSpanFull(),
                ])->columns(2),
            Block::make('callout')->label(fn (?array $state) => self::preview('Call-out box', $state, 'title'))->icon('heroicon-o-megaphone')
                ->schema([
                    Forms\Components\TextInput::make('eyebrow')->required(),
                    Forms\Components\TextInput::make('title')->required(),
                    Forms\Components\TextInput::make('label')->label('Button label')->required(),
                    Forms\Components\TextInput::make('href')->label('Button link')->required()->placeholder('/contact'),
                ])->columns(2),
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Tabs::make('Post')->persistTabInQueryString()->tabs([
                SchemaComponents\Tabs\Tab::make('Post')->icon('heroicon-o-document-text')->schema([
                    SchemaComponents\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('title')->required()->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true)->helperText('Lives at /blog/{slug}.'),
                        Forms\Components\Select::make('post_category_id')->label('Category')->relationship('category', 'name')->required()->native(false)
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')->required(),
                                Forms\Components\TextInput::make('slug')->required(),
                                Fields::tone('tone'),
                            ]),
                        Forms\Components\Select::make('author_id')->label('Author')->relationship('author', 'name')->native(false),
                        Forms\Components\DatePicker::make('published_at')->label('Publish date')->default(now())->native(false)->required(),
                        Forms\Components\TextInput::make('read_time')->label('Read time (minutes)')->numeric()->default(5)->minValue(1),
                        Forms\Components\TagsInput::make('tags')->reorderable(),
                    ]),
                    Forms\Components\Textarea::make('excerpt')->rows(2)->helperText('One or two lines for post cards.'),
                    Forms\Components\Textarea::make('description')->rows(3)->helperText('A longer summary: the featured card and the meta description.'),
                    SchemaComponents\Grid::make(2)->schema([
                        Forms\Components\Toggle::make('featured')->helperText('Shown as the big card at the top of /blog.'),
                        Forms\Components\Toggle::make('is_published')->label('Published')->default(true),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('Article')->icon('heroicon-o-pencil-square')->schema([
                    Forms\Components\Builder::make('body')->hiddenLabel()
                        ->blocks(self::blocks())
                        ->blockNumbers(false)
                        ->collapsible()
                        ->cloneable()
                        ->reorderableWithButtons()
                        ->addActionLabel('Add block')
                        ->columnSpanFull(),
                ]),
                SchemaComponents\Tabs\Tab::make('Cover')->icon('heroicon-o-photo')->schema([
                    SchemaComponents\Grid::make(2)->schema([
                        ...Fields::image('cover', 'Cover image', w: 'width', h: 'height'),
                        Fields::tone('cover.bg', 'Background behind cut-out artwork')->placeholder('None')->default(null),
                    ]),
                ]),
                SchemaComponents\Tabs\Tab::make('SEO')->icon('heroicon-o-magnifying-glass')->schema([
                    SchemaComponents\Section::make('Search & sharing')->description('The description field doubles as the meta description.')->schema([
                        Forms\Components\TextInput::make('seo_title')->label('Meta title')->maxLength(150)->helperText('Leave empty to use the post title.'),
                        Fields::media('og_image', 'Share image (1200 × 630)')->helperText('Leave empty to use the cover.'),
                    ]),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_url')->label('')
                    ->state(fn (Post $record) => Media::absolute($record->cover['src'] ?? null))
                    ->imageHeight(40)->extraImgAttributes(['class' => 'rounded-md object-cover']),
                Tables\Columns\TextColumn::make('title')->searchable()->weight('bold')->wrap()
                    ->description(fn (Post $record) => $record->author?->name),
                Tables\Columns\TextColumn::make('category.name')->badge(),
                Tables\Columns\TextColumn::make('published_at')->date()->sortable()->label('Date'),
                Tables\Columns\TextColumn::make('comments_count')->counts('comments')->label('Comments'),
                Tables\Columns\IconColumn::make('featured')->boolean(),
                Tables\Columns\ToggleColumn::make('is_published')->label('Published'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
                Tables\Filters\SelectFilter::make('author')->relationship('author', 'name'),
                Tables\Filters\TernaryFilter::make('is_published')->label('Published'),
            ])
            ->recordActions([Actions\EditAction::make()])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->defaultSort('published_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [CommentsRelationManager::class];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
