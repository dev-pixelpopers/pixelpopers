<?php

namespace App\Filament\Pages;

use App\Filament\Support\Fields;
use App\Models\Setting;
use App\Support\Mailer;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components as SchemaComponents;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

/**
 * Site-wide settings: SEO defaults, company details, social links,
 * analytics, email (SMTP + notifications) and the frontend connection.
 */
class SiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string|\UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Site settings';

    protected static ?string $title = 'Site settings';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.site-settings';

    /** Every key this page edits (its form's field names). */
    private const KEYS = [
        'site_name', 'site_title', 'site_description', 'site_keywords', 'site_url', 'default_og_image',
        'company_email', 'company_phone', 'company_address', 'company_hours', 'footer_tagline', 'availability_label',
        'social_instagram', 'social_behance', 'social_linkedin', 'social_dribbble', 'social_x', 'social_facebook',
        'google_analytics_id', 'google_tag_manager_id', 'meta_pixel_id',
        'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption',
        'mail_from_address', 'mail_from_name', 'mail_to_address', 'notify_on_contact', 'notify_on_comment',
        'frontend_revalidate_url', 'frontend_revalidate_secret',
        'greeting_gif', 'thumbs_gif', 'greeting_gif_home', 'greeting_gif_work', 'greeting_gif_case_study', 'greeting_gif_services', 'greeting_gif_service', 'greeting_gif_about', 'greeting_gif_blog', 'greeting_gif_post', 'greeting_gif_contact',
    ];

    /** @var array<string, mixed> */
    public ?array $data = [];

    public function mount(): void
    {
        $values = collect(self::KEYS)->mapWithKeys(fn ($key) => [$key => Setting::get($key)])->all();
        // The saved password is never sent back to the browser; leaving the field empty keeps it.
        $values['smtp_password'] = null;
        $this->form->fill($values);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                SchemaComponents\Tabs::make('Settings')->persistTabInQueryString()->tabs([
                    SchemaComponents\Tabs\Tab::make('SEO defaults')->icon('heroicon-o-magnifying-glass')->schema([
                        SchemaComponents\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('site_name')->required(),
                            Forms\Components\TextInput::make('site_url')->label('Website URL')->url()->required()
                                ->helperText('Canonical URLs, the sitemap and share links use this.'),
                        ]),
                        Forms\Components\TextInput::make('site_title')->label('Default page title')->maxLength(150),
                        Forms\Components\Textarea::make('site_description')->label('Default meta description')->rows(3)->maxLength(500),
                        Forms\Components\TextInput::make('site_keywords')->label('Default keywords'),
                        Fields::media('default_og_image', 'Default share image (1200 × 630)'),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Company')->icon('heroicon-o-building-office')->schema([
                        SchemaComponents\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('company_email')->email()->label('Public email'),
                            Forms\Components\TextInput::make('company_phone')->label('Phone'),
                            Forms\Components\TextInput::make('company_address')->label('Address'),
                            Forms\Components\TextInput::make('company_hours')->label('Hours / location line'),
                        ]),
                        Forms\Components\Textarea::make('footer_tagline')->rows(2),
                        Forms\Components\TextInput::make('availability_label')->label('Availability badge')
                            ->helperText('The “Available for new projects” pill in the footer. Leave empty to hide it.'),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Social')->icon('heroicon-o-share')->schema([
                        SchemaComponents\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('social_instagram')->label('Instagram')->url(),
                            Forms\Components\TextInput::make('social_behance')->label('Behance')->url(),
                            Forms\Components\TextInput::make('social_linkedin')->label('LinkedIn')->url(),
                            Forms\Components\TextInput::make('social_dribbble')->label('Dribbble')->url(),
                            Forms\Components\TextInput::make('social_x')->label('X / Twitter')->url(),
                            Forms\Components\TextInput::make('social_facebook')->label('Facebook')->url(),
                        ]),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Analytics')->icon('heroicon-o-chart-pie')->schema([
                        Forms\Components\TextInput::make('google_analytics_id')->label('Google Analytics ID')->placeholder('G-XXXXXXXXXX'),
                        Forms\Components\TextInput::make('google_tag_manager_id')->label('Google Tag Manager ID')->placeholder('GTM-XXXXXXX'),
                        Forms\Components\TextInput::make('meta_pixel_id')->label('Meta Pixel ID')->regex('/^\d*$/')->placeholder('123456789012345'),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Email')->icon('heroicon-o-envelope')->schema([
                        SchemaComponents\Section::make('Notifications')->schema([
                            Forms\Components\TextInput::make('mail_to_address')->label('Send notifications to')->email()
                                ->helperText('New enquiries and comments are emailed here.'),
                            SchemaComponents\Grid::make(2)->schema([
                                Forms\Components\Toggle::make('notify_on_contact')->label('Email me new enquiries'),
                                Forms\Components\Toggle::make('notify_on_comment')->label('Email me new comments'),
                            ]),
                        ]),
                        SchemaComponents\Section::make('SMTP account')->description('Gmail: smtp.gmail.com, port 587, TLS, and an App Password (not your normal password).')->schema([
                            SchemaComponents\Grid::make(2)->schema([
                                Forms\Components\TextInput::make('smtp_host')->label('Host')->placeholder('smtp.gmail.com'),
                                Forms\Components\TextInput::make('smtp_port')->label('Port')->numeric()->default(587),
                                Forms\Components\TextInput::make('smtp_username')->label('Username'),
                                Forms\Components\TextInput::make('smtp_password')->label('Password')->password()->revealable()
                                    ->helperText(fn () => Setting::get('smtp_password') ? 'Saved. Leave empty to keep it.' : null),
                                Forms\Components\Select::make('smtp_encryption')->label('Encryption')->native(false)
                                    ->options(['tls' => 'TLS (port 587)', 'ssl' => 'SSL (port 465)', '' => 'None']),
                                Forms\Components\TextInput::make('mail_from_name')->label('From name'),
                                Forms\Components\TextInput::make('mail_from_address')->label('From address')->email()->columnSpanFull(),
                            ]),
                        ]),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Greetings')->icon('heroicon-o-face-smile')->schema([
                        SchemaComponents\Section::make('Welcome intro & greeting cards')
                            ->description('A GIF or a short MP4 for the first-visit welcome and the “Hey Sara!” card on every page. Square, or a centred subject (it’s cropped to a square), under ~2 MB. Empty slots use the built-in waving and thumbs-up clips.')
                            ->schema([
                                SchemaComponents\Grid::make(2)->schema([
                                    Fields::media('greeting_gif', 'Greeting (hello)', 'animation')->helperText('Waves hello in the welcome intro while it asks the visitor’s name.'),
                                    Fields::media('thumbs_gif', 'Thumbs-up', 'animation')->helperText('After they tell us their name, and on every page’s greeting card.'),
                                ]),
                            ]),
                        SchemaComponents\Section::make('Per-page greeting cards (optional)')
                            ->description('Only if a page’s greeting card should have its own animation — empty ones use the thumbs-up.')
                            ->collapsed()
                            ->schema([
                                SchemaComponents\Grid::make(2)->schema([
                                    Fields::media('greeting_gif_home', 'Home', 'animation')->helperText('Idea: arms open wide — “welcome back!”, or an excited little jump.'),
                                    Fields::media('greeting_gif_work', 'Work', 'animation')->helperText('Idea: a chef’s kiss, or proudly pointing at a screen — “look what we made”.'),
                                    Fields::media('greeting_gif_case_study', 'A case study', 'animation')->helperText('Idea: clapping / applause, or a “mind blown” gesture.'),
                                    Fields::media('greeting_gif_services', 'Services', 'animation')->helperText('Idea: hand on chin thinking, then a lightbulb moment — or a magic-wand flick.'),
                                    Fields::media('greeting_gif_service', 'A service page', 'animation')->helperText('Idea: finger guns or an “OK” sign — “good choice!”.'),
                                    Fields::media('greeting_gif_about', 'About', 'animation')->helperText('Idea: heart hands, or a high-five to the camera.'),
                                    Fields::media('greeting_gif_blog', 'Blog', 'animation')->helperText('Idea: pushing up glasses and flipping through a notebook.'),
                                    Fields::media('greeting_gif_post', 'A blog post', 'animation')->helperText('Idea: sipping a coffee and nodding along.'),
                                    Fields::media('greeting_gif_contact', 'Contact', 'animation')->helperText('Idea: the “call me” hand by the ear, or a beckoning “come here” wave.'),
                                ]),
                            ]),
                    ]),
                    SchemaComponents\Tabs\Tab::make('Frontend')->icon('heroicon-o-globe-alt')->schema([
                        SchemaComponents\Section::make('Instant updates')
                            ->description('When set, every save here tells the website to refresh its cached pages right away. Without it the website picks up changes within its cache window.')
                            ->schema([
                                Forms\Components\TextInput::make('frontend_revalidate_url')->label('Revalidation URL')->url()
                                    ->placeholder('https://pixelpopers.vercel.app/api/revalidate'),
                                Forms\Components\TextInput::make('frontend_revalidate_secret')->label('Shared secret')->password()->revealable()
                                    ->helperText('Must match REVALIDATE_SECRET in the website’s environment.')
                                    ->suffixAction(\Filament\Actions\Action::make('generate')->icon('heroicon-o-key')->tooltip('Generate')
                                        ->action(fn (Forms\Components\TextInput $component) => $component->state(Str::random(40)))),
                            ]),
                    ]),
                ])->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach (self::KEYS as $key) {
            if ($key === 'smtp_password' && blank($data[$key] ?? null)) {
                continue;
            }
            Setting::set($key, $data[$key] ?? null);
        }

        Notification::make()->title('Settings saved')->success()->send();
    }

    /** Sends a test message with the SMTP values currently in the form (saved or not). */
    public function testSmtp(): void
    {
        $state = $this->form->getState();
        $to = (string) (Auth::user()?->email ?? '');

        if (! Mailer::configure($state)) {
            Notification::make()->title('Fill in the SMTP host and username first.')->danger()->send();

            return;
        }

        try {
            Mail::raw('Your Pixel Popers CMS can send email. Enquiry and comment notifications will arrive like this one.', fn ($message) => $message->to($to)->subject('SMTP test · Pixel Popers CMS'));
            Notification::make()->title('Test email sent to '.$to)->body('Check spam if it doesn’t arrive in a minute.')->success()->send();
        } catch (Throwable $e) {
            Notification::make()->title('SMTP test failed')->body(Str::limit($e->getMessage(), 300))->danger()->send();
        }
    }
}
