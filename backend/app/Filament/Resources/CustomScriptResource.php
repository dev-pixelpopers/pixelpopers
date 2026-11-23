<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomScriptResource\Pages;
use App\Models\CustomScript;
use App\Support\SitePaths;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

/**
 * Code added to the website's pages: tracking tags, chat widgets,
 * verification <meta> tags, structured data — on every page or on one
 * page, in the <head> or at the end of the <body>.
 */
class CustomScriptResource extends Resource
{
    protected static ?string $model = CustomScript::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-code-bracket';

    protected static string|\UnitEnum|null $navigationGroup = 'SEO';

    protected static ?string $navigationLabel = 'Scripts & tags';

    protected static ?string $modelLabel = 'script';

    protected static ?int $navigationSort = 2;

    /** All pages first, then every page of the site. */
    private static function targets(): array
    {
        return [CustomScript::EVERY_PAGE => 'All pages'] + collect(SitePaths::all())->map(fn ($label, $path) => "$label ($path)")->all();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            SchemaComponents\Section::make()->columns(2)->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('e.g. Hotjar, LinkedIn Insight Tag, Calendly widget')
                    ->helperText('Just for you — never shown on the website.'),
                Forms\Components\Toggle::make('is_active')->label('Active')->default(true)->inline(false),
                Forms\Components\Select::make('target')
                    ->label('Add to')
                    ->options(self::targets())
                    ->default(CustomScript::EVERY_PAGE)
                    ->searchable()
                    ->selectablePlaceholder(false)
                    ->required()
                    // Typing a path that isn't listed (e.g. a page added later) offers it as an option.
                    ->getSearchResultsUsing(function (string $search): array {
                        $matches = collect(self::targets())->filter(fn ($label) => Str::contains(Str::lower($label), Str::lower($search)))->all();
                        $typed = trim($search);
                        if (str_starts_with($typed, '/')) {
                            $path = CustomScript::normaliseTarget($typed);
                            $matches = [$path => "Other page: $path"] + $matches;
                        }

                        return array_slice($matches, 0, 50, true);
                    })
                    ->getOptionLabelUsing(fn ($value) => SitePaths::label($value))
                    ->helperText('“All pages”, or one page. Search by name or type a path such as /about.'),
                Forms\Components\Radio::make('location')
                    ->label('Where on the page')
                    ->options(CustomScript::LOCATIONS)
                    ->descriptions([
                        'head' => 'Most tracking tags, verification <meta> tags and fonts go here.',
                        'body' => 'Chat widgets and anything the provider says to put “before </body>”.',
                    ])
                    ->default('head')
                    ->required(),
                Forms\Components\Textarea::make('code')
                    ->label('Code')
                    ->required()
                    ->rows(14)
                    ->columnSpanFull()
                    ->placeholder("<!-- Paste the snippet exactly as the provider gives it -->\n<script async src=\"https://example.com/tag.js\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n</script>")
                    ->helperText('Paste it exactly as the provider gives it. In the <head>: <script>, <noscript>, <meta>, <link> and <style> tags. At the end of the <body>: any HTML (a widget’s <div> too). Code here runs on the live site — only paste snippets from providers you trust.')
                    ->extraInputAttributes(['spellcheck' => 'false', 'style' => 'font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.6']),
            ]),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('target')->label('Added to')
                    ->formatStateUsing(fn (string $state) => SitePaths::label($state))
                    ->badge()->color(fn (string $state) => $state === CustomScript::EVERY_PAGE ? 'info' : 'gray'),
                Tables\Columns\TextColumn::make('location')->label('Where')
                    ->formatStateUsing(fn (string $state) => $state === 'body' ? 'End of body' : 'Head'),
                Tables\Columns\ToggleColumn::make('is_active')->label('Active'),
                Tables\Columns\TextColumn::make('updated_at')->label('Updated')->since()->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('location')->options(CustomScript::LOCATIONS),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->recordActions([
                Actions\ReplicateAction::make()->label('Duplicate')->icon('heroicon-o-document-duplicate')
                    ->mutateRecordDataUsing(fn (array $data) => ['name' => $data['name'].' (copy)', 'is_active' => false] + $data),
                Actions\EditAction::make(),
            ])
            ->toolbarActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])])
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->paginated(false)
            ->emptyStateHeading('No scripts yet')
            ->emptyStateDescription('Add tracking tags, widgets or verification tags to every page or to one page.');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomScripts::route('/'),
            'create' => Pages\CreateCustomScript::route('/create'),
            'edit' => Pages\EditCustomScript::route('/{record}/edit'),
        ];
    }
}
