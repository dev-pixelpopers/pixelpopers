<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Transformers as T;
use App\Models\Client;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\ShowreelItem;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Support\ContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only content for the website. Every response is cached until content
 * changes (see ContentCache) and carries a short CDN cache header.
 */
class ContentController extends Controller
{
    private function respond(mixed $data): JsonResponse
    {
        abort_if($data === null, 404);

        return response()->json(['data' => $data])
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    }

    public function site(): JsonResponse
    {
        return $this->respond(ContentCache::remember('site', fn () => Setting::publicValues()));
    }

    public function pages(): JsonResponse
    {
        return $this->respond(ContentCache::remember('pages', fn () => Page::published()->ordered()
            ->get(['slug', 'title', 'updated_at'])
            ->map(fn (Page $p) => ['slug' => $p->slug, 'title' => $p->title, 'updatedAt' => $p->updated_at?->toIso8601String()])
            ->all()));
    }

    public function page(string $slug): JsonResponse
    {
        return $this->respond(ContentCache::remember("page:$slug", function () use ($slug) {
            $page = Page::published()->with('sections')->where('slug', $slug)->first();

            return $page ? T::page($page) : null;
        }));
    }

    public function services(): JsonResponse
    {
        return $this->respond(ContentCache::remember('services', fn () => Service::published()->ordered()->get()
            ->map(fn (Service $s) => T::service($s, full: false))->all()));
    }

    public function service(string $slug): JsonResponse
    {
        return $this->respond(ContentCache::remember("service:$slug", function () use ($slug) {
            $service = Service::published()->where('slug', $slug)->first();

            return $service ? T::service($service) : null;
        }));
    }

    public function projects(Request $request): JsonResponse
    {
        $full = $request->boolean('full');

        return $this->respond(ContentCache::remember('projects:'.($full ? 'full' : 'cards'), fn () => Project::published()->ordered()->get()
            ->map(fn (Project $p) => T::project($p, $full))->all()));
    }

    public function project(string $slug): JsonResponse
    {
        return $this->respond(ContentCache::remember("project:$slug", function () use ($slug) {
            $projects = Project::published()->ordered()->get();
            $index = $projects->search(fn (Project $p) => $p->slug === $slug);
            if ($index === false) {
                return null;
            }
            // "Next project" wraps round to the first.
            $next = $projects[($index + 1) % $projects->count()];

            return T::project($projects[$index]) + ['next' => T::project($next, full: false)];
        }));
    }

    public function showreel(): JsonResponse
    {
        return $this->respond(ContentCache::remember('showreel', fn () => ShowreelItem::published()->ordered()->get()
            ->map(fn (ShowreelItem $i) => T::showreel($i))->all()));
    }

    public function clients(): JsonResponse
    {
        return $this->respond(ContentCache::remember('clients', fn () => Client::published()->ordered()->get()
            ->map(fn (Client $c) => T::client($c))->all()));
    }

    public function team(): JsonResponse
    {
        return $this->respond(ContentCache::remember('team', fn () => TeamMember::published()->ordered()->get()
            ->map(fn (TeamMember $m) => T::teamMember($m))->all()));
    }

    public function testimonials(): JsonResponse
    {
        return $this->respond(ContentCache::remember('testimonials', fn () => Testimonial::published()->ordered()->get()
            ->map(fn (Testimonial $t) => T::testimonial($t))->all()));
    }

    public function categories(): JsonResponse
    {
        return $this->respond(ContentCache::remember('categories', fn () => PostCategory::ordered()->withCount(['posts' => fn ($q) => $q->where('is_published', true)])->get()
            ->map(fn (PostCategory $c) => ['name' => $c->name, 'slug' => $c->slug, 'tone' => $c->tone, 'count' => $c->posts_count])->all()));
    }

    /** ?category=branding&tag=SEO&featured=1&limit=4&slugs=a,b,c */
    public function posts(Request $request): JsonResponse
    {
        $filters = $request->only(['category', 'tag', 'featured', 'limit', 'slugs']);
        ksort($filters);

        return $this->respond(ContentCache::remember('posts:'.md5(json_encode($filters)), function () use ($filters) {
            $query = Post::published()->ordered()->with(['category', 'author']);
            if (! empty($filters['category'])) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category'])->orWhere('name', $filters['category']));
            }
            if (! empty($filters['featured'])) {
                $query->where('featured', true);
            }
            $posts = $query->get();
            if (! empty($filters['tag'])) {
                $tag = mb_strtolower($filters['tag']);
                $posts = $posts->filter(fn (Post $p) => in_array($tag, array_map('mb_strtolower', $p->tags ?? []), true));
            }
            if (! empty($filters['slugs'])) {
                // Keep the requested order (e.g. the home page's hand-picked posts).
                $order = array_flip(explode(',', $filters['slugs']));
                $posts = $posts->filter(fn (Post $p) => isset($order[$p->slug]))->sortBy(fn (Post $p) => $order[$p->slug]);
            }
            if (! empty($filters['limit'])) {
                $posts = $posts->take(max(1, (int) $filters['limit']));
            }

            return $posts->values()->map(fn (Post $p) => T::post($p, full: false))->all();
        }));
    }

    public function post(string $slug): JsonResponse
    {
        return $this->respond(ContentCache::remember("post:$slug", function () use ($slug) {
            $post = Post::published()->with(['category', 'author', 'approvedComments'])->where('slug', $slug)->first();
            if (! $post) {
                return null;
            }
            // Related: same category first, then the newest of the rest.
            $related = Post::published()->ordered()->with(['category', 'author'])->where('id', '!=', $post->id)->get()
                ->sortByDesc(fn (Post $p) => $p->post_category_id === $post->post_category_id)
                ->take(3)->values()
                ->map(fn (Post $p) => T::post($p, full: false))->all();

            return T::post($post) + ['related' => $related];
        }));
    }

    /** Every public URL with its last change, for the website's sitemap. */
    public function sitemap(): JsonResponse
    {
        return $this->respond(ContentCache::remember('sitemap', function () {
            $paths = Page::published()->get(['slug', 'updated_at'])
                ->map(fn (Page $p) => ['path' => $p->slug === 'home' ? '/' : '/'.$p->slug, 'updatedAt' => $p->updated_at?->toIso8601String()]);
            $paths = $paths
                ->concat(Service::published()->get(['slug', 'updated_at'])->map(fn ($s) => ['path' => '/services/'.$s->slug, 'updatedAt' => $s->updated_at?->toIso8601String()]))
                ->concat(Project::published()->get(['slug', 'updated_at'])->map(fn ($p) => ['path' => '/work/'.$p->slug, 'updatedAt' => $p->updated_at?->toIso8601String()]))
                ->concat(Post::published()->get(['slug', 'updated_at'])->map(fn ($p) => ['path' => '/blog/'.$p->slug, 'updatedAt' => $p->updated_at?->toIso8601String()]));

            return $paths->values()->all();
        }));
    }
}
