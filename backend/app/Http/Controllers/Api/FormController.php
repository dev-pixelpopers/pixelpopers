<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Support\Visitor;
use App\Models\Setting;
use App\Support\Mailer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * The website's forms: project enquiries, newsletter sign-ups and blog
 * comments. Every form carries an empty honeypot field (`_gotcha`) that
 * people never see; a submission that fills it is a bot and is quietly
 * accepted without being stored. Routes are rate-limited (routes/api.php).
 */
class FormController extends Controller
{
    private function isBot(Request $request): bool
    {
        return filled($request->input('_gotcha'));
    }

    public function contact(Request $request): JsonResponse
    {
        if ($this->isBot($request)) {
            return response()->json(['message' => 'Thanks! We’ll be in touch within a day.'], 201);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'services' => ['nullable', 'array', 'max:12'],
            'services.*' => ['string', 'max:100'],
            'budget' => ['nullable', 'string', 'max:100'],
            'details' => ['nullable', 'string', 'max:10000'],
        ]);

        $submission = ContactSubmission::create($data + [
            'ip_address' => Visitor::ip($request),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        if (Setting::get('notify_on_contact', true)) {
            dispatch(fn () => Mailer::notifyStudio(
                'New enquiry from '.$submission->name.($submission->company ? ' ('.$submission->company.')' : ''),
                implode("\n", [
                    'Name: '.$submission->name,
                    'Email: '.$submission->email,
                    'Company: '.($submission->company ?: '—'),
                    'Website: '.($submission->website ?: '—'),
                    'Services: '.(implode(', ', $submission->services ?? []) ?: 'Not sure yet'),
                    'Budget: '.($submission->budget ?: 'Not sure yet'),
                    '',
                    $submission->details ?: '(no details)',
                    '',
                    'Open in the CMS: '.url('/admin/contact-submissions/'.$submission->id),
                ]),
            ))->afterResponse();
        }

        return response()->json(['message' => 'Thanks! We’ll be in touch within a day.'], 201);
    }

    public function newsletter(Request $request): JsonResponse
    {
        $message = 'You’re in! Watch your inbox for the next issue.';
        if ($this->isBot($request)) {
            return response()->json(['message' => $message], 201);
        }

        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
            'source' => ['nullable', 'string', 'in:footer,blog'],
        ]);

        // Signing up again re-subscribes, and never reveals whether an address was already on the list.
        NewsletterSubscriber::updateOrCreate(
            ['email' => Str::lower($data['email'])],
            ['source' => $data['source'] ?? 'footer', 'unsubscribed_at' => null, 'ip_address' => Visitor::ip($request)],
        );

        return response()->json(['message' => $message], 201);
    }

    public function comment(Request $request, string $slug): JsonResponse
    {
        $message = 'Thanks! Your comment will appear once it’s approved.';
        if ($this->isBot($request)) {
            return response()->json(['message' => $message], 201);
        }

        $post = Post::published()->where('slug', $slug)->firstOrFail();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email:rfc', 'max:255'],
            'text' => ['required', 'string', 'min:2', 'max:3000'],
        ]);

        $comment = $post->comments()->create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'body' => $data['text'],
            'tone' => collect(['blush', 'lagoon', 'sunbeam', 'grape'])->random(),
            'is_approved' => false,
            'ip_address' => Visitor::ip($request),
        ]);

        if (Setting::get('notify_on_comment', true)) {
            dispatch(fn () => Mailer::notifyStudio(
                'New comment on “'.$post->title.'”',
                $comment->name.' wrote:'."\n\n".$comment->body."\n\nApprove it in the CMS: ".url('/admin/comments'),
            ))->afterResponse();
        }

        return response()->json(['message' => $message], 201);
    }
}
