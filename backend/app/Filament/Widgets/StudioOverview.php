<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\CommentResource;
use App\Filament\Resources\ContactSubmissionResource;
use App\Filament\Resources\NewsletterSubscriberResource;
use App\Filament\Resources\PostResource;
use App\Filament\Resources\ProjectResource;
use App\Models\Comment;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/** The dashboard's at-a-glance numbers: what needs attention, then what's live. */
class StudioOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $newEnquiries = ContactSubmission::where('status', 'new')->count();
        $pendingComments = Comment::where('is_approved', false)->count();
        $subscribers = NewsletterSubscriber::whereNull('unsubscribed_at');

        return [
            Stat::make('New enquiries', $newEnquiries)
                ->description(ContactSubmission::where('created_at', '>=', now()->subDays(30))->count().' in the last 30 days')
                ->color($newEnquiries > 0 ? 'warning' : 'gray')
                ->icon('heroicon-o-inbox-arrow-down')
                ->url(ContactSubmissionResource::getUrl()),
            Stat::make('Comments to review', $pendingComments)
                ->color($pendingComments > 0 ? 'warning' : 'gray')
                ->icon('heroicon-o-chat-bubble-oval-left-ellipsis')
                ->url(CommentResource::getUrl()),
            Stat::make('Newsletter subscribers', (clone $subscribers)->count())
                ->description('+'.(clone $subscribers)->where('created_at', '>=', now()->subDays(30))->count().' in the last 30 days')
                ->icon('heroicon-o-envelope-open')
                ->url(NewsletterSubscriberResource::getUrl()),
            Stat::make('Published', Post::published()->count().' posts · '.Project::published()->count().' case studies')
                ->icon('heroicon-o-newspaper')
                ->url(PostResource::getUrl()),
        ];
    }
}
