<?php

namespace App\Filament\Support;

use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Facades\Storage;

/** Field building blocks shared by the admin resources. */
class Fields
{
    public const TONES = [
        'blush' => 'Blush (pink)',
        'grape' => 'Grape (purple)',
        'lagoon' => 'Lagoon (teal)',
        'sunbeam' => 'Sunbeam (yellow)',
        'lav' => 'Lavender',
    ];

    public static function tone(string $name, string $label = 'Colour'): Select
    {
        return Select::make($name)->label($label)->options(self::TONES)->default('blush')->native(false);
    }

    /**
     * A media path: either a file that ships with the website ("/assets/…"),
     * or a full URL — the Upload button stores a new file on this server and
     * fills in its public URL.
     */
    /** `$kind`: 'image', 'video', or 'animation' (a GIF or a short MP4/WebM clip). */
    public static function media(string $name, string $label = 'Image', string $kind = 'image'): TextInput
    {
        $isVideo = $kind === 'video';
        $isAnimation = $kind === 'animation';
        [$fileLabel, $folder, $types, $maxKb] = match (true) {
            $isVideo => ['Video (MP4, keep it under ~3 MB)', 'uploads/videos', ['video/mp4', 'video/webm'], 20480],
            $isAnimation => ['Animation (GIF or a short MP4 — keep it under ~2 MB)', 'uploads/animations', ['image/gif', 'video/mp4', 'video/webm', 'image/webp', 'image/png'], 10240],
            default => ['Image (WebP, AVIF, PNG, JPG or GIF)', 'uploads/images', ['image/webp', 'image/avif', 'image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'], 8192],
        };

        return TextInput::make($name)
            ->label($label)
            ->placeholder($isVideo ? '/assets/videos/clip.mp4' : '/assets/inner/photo.webp')
            ->helperText('A path on the website (e.g. /assets/…) or a full URL. Use Upload to add a new file.')
            ->suffixAction(
                Action::make('upload_'.str_replace('.', '_', $name))
                    ->icon('heroicon-o-arrow-up-tray')
                    ->tooltip('Upload')
                    ->modalHeading('Upload '.strtolower($label))
                    ->modalSubmitActionLabel('Use this file')
                    ->schema([
                        FileUpload::make('file')
                            ->label($fileLabel)
                            ->disk('public')
                            ->directory($folder)
                            ->visibility('public')
                            ->acceptedFileTypes($types)
                            ->maxSize($maxKb)
                            ->required(),
                    ])
                    ->action(function (array $data, TextInput $component): void {
                        $component->state(Storage::disk('public')->url($data['file']));
                    }),
            );
    }

    /**
     * Source, alt text and intrinsic size of an image stored as JSON (e.g.
     * `cover`). Case-study images name their size keys w/h, blog covers
     * width/height — pass the keys the stored object uses.
     */
    public static function image(string $prefix, string $label = 'Image', bool $withPosition = false, string $w = 'w', string $h = 'h'): array
    {
        $fields = [
            self::media($prefix.'.src', $label)->columnSpanFull(),
            TextInput::make($prefix.'.alt')->label('Alt text')->helperText('Describe the image for screen readers and search engines.')->columnSpanFull(),
            TextInput::make($prefix.'.'.$w)->label('Width (px)')->numeric(),
            TextInput::make($prefix.'.'.$h)->label('Height (px)')->numeric(),
        ];
        if ($withPosition) {
            $fields[] = TextInput::make($prefix.'.position')->label('Focal point')->placeholder('50% 50%');
        }

        return $fields;
    }

    /** Meta title / description / share image. */
    public static function seo(string $title = 'seo_title', string $description = 'seo_description', ?string $ogImage = 'og_image'): Section
    {
        $fields = [
            TextInput::make($title)->label('Meta title')->maxLength(150)->helperText('Shown in search results and browser tabs. Aim for 50–60 characters; Google trims longer titles.'),
            Textarea::make($description)->label('Meta description')->rows(3)->maxLength(500)->helperText('Aim for 140–160 characters; Google trims longer descriptions.'),
        ];
        if ($ogImage) {
            $fields[] = self::media($ogImage, 'Share image (1200 × 630)');
        }

        return Section::make('Search & sharing')->schema($fields);
    }
}
