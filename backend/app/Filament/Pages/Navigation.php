<?php

namespace App\Filament\Pages;

use App\Support\Navigation as Menus;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

/**
 * The website's menus: the full-screen main menu and the footer's Navigation
 * list. Each is an ordered list of pages (any page, including ones built in
 * the CMS) and custom links. Pages that are switched off are left out on the
 * website automatically.
 */
class Navigation extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-bars-3';

    protected static string|\UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Navigation';

    protected static ?string $title = 'Navigation';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.navigation';

    /** @var array<string, mixed> */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(collect(array_keys(Menus::MENUS))->mapWithKeys(fn ($menu) => [$menu => array_map(
            fn ($item) => ['kind' => ($item['page'] ?? null) ? 'page' : 'link'] + $item,
            Menus::items($menu),
        )])->all());
    }

    private static function menu(string $key, string $label, string $description): SchemaComponents\Section
    {
        return SchemaComponents\Section::make($label)->description($description)->schema([
            Forms\Components\Repeater::make($key)
                ->hiddenLabel()
                ->reorderable()
                ->reorderableWithButtons()
                ->cloneable()
                ->collapsible()
                ->addActionLabel('Add a link')
                ->defaultItems(0)
                ->itemLabel(function (array $state): ?string {
                    $pages = Menus::pageOptions();
                    $text = ($state['label'] ?? null) ?: (($state['page'] ?? null) ? strtok($pages[$state['page']] ?? $state['page'], '(') : ($state['url'] ?? null));
                    $to = ($state['kind'] ?? 'page') === 'page' ? (($state['page'] ?? null) === 'home' ? '/' : '/'.($state['page'] ?? '')) : ($state['url'] ?? '');

                    return trim((string) $text).($to ? "  →  $to" : '');
                })
                ->columns(4)
                ->schema([
                    Forms\Components\ToggleButtons::make('kind')->label('Links to')->inline()->grouped()
                        ->options(['page' => 'A page', 'link' => 'Custom link'])->default('page')->live()->columnSpan(1),
                    Forms\Components\Select::make('page')->label('Page')->options(fn () => Menus::pageOptions())->searchable()
                        ->visible(fn (Get $get) => $get('kind') !== 'link')->required(fn (Get $get) => $get('kind') !== 'link')->columnSpan(3),
                    Forms\Components\TextInput::make('url')->label('Address')->placeholder('/about#studio  or  https://…')
                        ->visible(fn (Get $get) => $get('kind') === 'link')->required(fn (Get $get) => $get('kind') === 'link')
                        ->regex('/^(\/|#|https?:\/\/|mailto:|tel:)/')
                        ->validationMessages(['regex' => 'Start with /, #, https://, mailto: or tel:'])
                        ->columnSpan(3),
                    Forms\Components\TextInput::make('label')->label('Text')
                        ->placeholder(fn (Get $get) => $get('kind') === 'link' ? 'Required for a custom link' : 'The page’s title')
                        ->required(fn (Get $get) => $get('kind') === 'link')->maxLength(60)->columnSpan(2),
                    Forms\Components\TextInput::make('pill')->label('Badge (optional)')->placeholder('e.g. We’re hiring')
                        ->helperText('{projects} shows the number of case studies.')->maxLength(30),
                    Forms\Components\Toggle::make('new_tab')->label('Open in a new tab')->inline(false),
                ]),
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form->schema([
            self::menu('nav_main', 'Main menu', 'The big menu that opens from “Menu” at the top of every page. Numbered in this order.'),
            self::menu('nav_footer', 'Footer · Navigation', 'The first list of links in the footer. (The footer’s Services list follows Services automatically.)'),
        ])->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();
        foreach (array_keys(Menus::MENUS) as $menu) {
            Menus::save($menu, array_map(fn ($item) => [
                'page' => ($item['kind'] ?? 'page') === 'page' ? ($item['page'] ?? null) : null,
                'url' => ($item['kind'] ?? 'page') === 'link' ? ($item['url'] ?? null) : null,
            ] + $item, array_values($state[$menu] ?? [])));
        }
        Notification::make()->title('Navigation saved')->body('The website shows it within a minute (straight away with instant updates on).')->success()->send();
    }

    public function resetMenus(): void
    {
        foreach (array_keys(Menus::MENUS) as $menu) {
            Menus::save($menu, Menus::DEFAULTS[$menu]);
        }
        $this->mount();
        Notification::make()->title('Menus reset to the original links')->success()->send();
    }
}
