<?php

namespace App\Filament\Support;

/**
 * Services → Motion Graphic → Page sections. DEFAULTS mirrors the website's
 * frontend src/components/inner/services/motion-graphic/copy.ts; the form is
 * built from it (see BuildsPageSectionsFromDefaults).
 */
class MotionGraphicSections
{
    use BuildsPageSectionsFromDefaults;

    public const SECTIONS = [
        'hero' => 'Hero — video player & film strip',
        'timeline' => 'The timeline — keyframes',
        'easing' => 'Easing curves',
        'storyboard' => 'Storyboard — six panels',
        'reels' => 'Social reels',
        'formats' => 'Every format',
    ];

    public const NOTES = [
        'hero' => 'The video (MP4), its cover image and the film-strip frames are on the Images tab.',
        'timeline' => 'Clips in order: logo, headline, background, then the two sparkle bursts.',
        'reels' => 'The reel pictures are on the Images tab.',
        'formats' => 'The frame shapes are fixed by the design; edit their labels here.',
    ];

    public const LABELS = [
        'description' => 'Timeline description (screen readers)',
        'videoLabel' => 'Video name (screen readers)',
        'play' => 'Play button label (screen readers)',
        'pause' => 'Pause button label (screen readers)',
        'secondSuffix' => 'Seconds suffix on the ruler',
    ];

    public const DEFAULTS = [
        'hero' => [
            'sticker' => '60 FPS VIBES',
            'posterAlt' => 'Animation editor style frame with an easing graph, keyframe timeline and colourful layers',
            'videoLabel' => 'Pixel Popers motion reel',
            'play' => 'Play the motion reel',
            'pause' => 'Pause the motion reel',
            'rec' => 'REC ●',
            'quality' => '4K · 60FPS',
            'film' => [
                [
                    'alt' => 'Radiance skincare campaign frame',
                ],
                [
                    'alt' => 'Product campaign set with bold 3D type',
                ],
                [
                    'alt' => 'Animation editor style frame',
                ],
                [
                    'alt' => 'Portrait mapped onto a spinning 3D cube',
                ],
                [
                    'alt' => 'Fifth Sip coffee packaging',
                ],
                [
                    'alt' => 'E-commerce interface screens',
                ],
            ],
        ],
        'timeline' => [
            'eyebrow' => 'The timeline',
            'heading' => 'Keyframes with character',
            'text' => 'Every move has a reason: weight, timing and a little bounce — choreographed frame by frame.',
            'description' => 'Animation timeline over five seconds: the logo drops and squashes, the headline types on, the background gradient loops, sparkles burst twice and a sound waveform runs underneath.',
            'lanes' => [
                [
                    'label' => 'Logo',
                ],
                [
                    'label' => 'Headline',
                ],
                [
                    'label' => 'Background',
                ],
                [
                    'label' => 'Sparkles',
                ],
            ],
            'clips' => [
                [
                    'name' => 'Drop & squash',
                ],
                [
                    'name' => 'Type-on',
                ],
                [
                    'name' => 'Gradient loop',
                ],
                [
                    'name' => 'Burst',
                ],
                [
                    'name' => 'Burst',
                ],
            ],
            'sound' => 'Sound',
            'secondSuffix' => 's',
            'timecode' => '00:02:12',
        ],
        'easing' => [
            'eyebrow' => 'The secret sauce',
            'heading' => 'Easing curves with attitude',
            'text' => '',
            'curves' => [
                [
                    'name' => 'Ease out',
                    'body' => 'Fast start, soft landing. For things arriving on screen.',
                ],
                [
                    'name' => 'Spring',
                    'body' => 'A little overshoot that feels alive. For buttons & pop-ups.',
                ],
                [
                    'name' => 'Bounce',
                    'body' => 'Playful and physical. For logos that land with a thud.',
                ],
            ],
        ],
        'storyboard' => [
            'eyebrow' => 'Storyboard',
            'heading' => 'Every frame, planned',
            'text' => '',
            'prefix' => 'SC',
            'scenes' => [
                [
                    'caption' => 'The P drops in from above',
                ],
                [
                    'caption' => 'Squash on impact',
                ],
                [
                    'caption' => 'POP! burst',
                ],
                [
                    'caption' => 'Product reveal',
                ],
                [
                    'caption' => 'App UI slides up',
                ],
                [
                    'caption' => 'Logo lockup + confetti',
                ],
            ],
            'burst' => 'POP!',
            'zoom' => 'ZOOM IN',
            'productAlt' => 'Fifth Sip packaging: cups, tray, menu and coffee pouch',
            'appAlt' => 'Shop app interface sliding up on a phone',
            'lockup' => 'PIXEL
POPERS',
        ],
        'reels' => [
            'eyebrow' => 'Social reels',
            'heading' => 'Made for the thumb-stop',
            'text' => '',
            'viewsWord' => 'views',
            'reels' => [
                [
                    'title' => 'Glow routine',
                    'views' => '1.2M',
                    'alt' => 'Radiance skincare campaign frame',
                ],
                [
                    'title' => 'Bold flavour drop',
                    'views' => '3.4M',
                    'alt' => 'Colourful product set for the Clim campaign',
                ],
                [
                    'title' => 'Behind the motion',
                    'views' => '860K',
                    'alt' => 'Animation editor style frame',
                ],
            ],
        ],
        'formats' => [
            'eyebrow' => 'Every format',
            'heading' => 'One idea. Every screen size.',
            'text' => '',
            'formats' => [
                [
                    'ratio' => '16:9',
                    'use' => 'YouTube · Web',
                ],
                [
                    'ratio' => '1:1',
                    'use' => 'Feed posts',
                ],
                [
                    'ratio' => '4:5',
                    'use' => 'Instagram',
                ],
                [
                    'ratio' => '9:16',
                    'use' => 'Reels · TikTok · Stories',
                ],
            ],
        ],
    ];
}
