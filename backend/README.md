# Pixel Popers CMS

The content backend for the Pixel Popers website: a Laravel 12 + Filament 5
admin panel (same stack as the logo-bloom CMS) and a public JSON API the
Next.js site reads from. This server hosts only the CMS and API — the website
itself stays on Vercel.

## Setup

```bash
cd backend
composer install
cp .env.example .env        # then set APP_URL, FRONTEND_URL and the ADMIN_* account
php artisan key:generate
php artisan migrate --seed  # creates the tables, the admin user and all current site content
php artisan storage:link    # serves uploaded images/videos from /storage
php artisan serve           # http://127.0.0.1:8000 → /admin
```

The seeder imports `database/seeders/data/content.json`, an export of the
website's built-in content. Re-export it after changing the site's data files:

```bash
# from the repository root (Node 22+)
node --experimental-strip-types --no-warnings backend/scripts/export-frontend-content.mjs
php artisan db:seed --force   # updates records in place; never overwrites saved settings
```

## What's in the admin

| Group | Screen | Manages |
|---|---|---|
| Content | **Pages** | Home, About, Services, Work, Contact, Blog. Each page has a *Page & SEO* tab and one tab per section (Hero, Values, FAQ…), with a switch to hide a section. |
| | **Services** | The six service pages (hero, overview, included, process, audience, guide, why us, tools, stats, packages, FAQs, CTA) and each one's giant-letter tile on the home page. |
| | **Case studies** | /work cards and /work/{slug} pages: story, results, brand swatches, gallery, deliverables, timeline, team. |
| | **Showreel** | The home page's video carousel. |
| | **Client logos**, **Testimonials**, **Team & authors** | Shared across pages. |
| Blog | **Posts** | Articles built from blocks (paragraph, heading, list, steps, quote, stats, image, call-out). |
| | **Categories**, **Comments** | Comments arrive unapproved; approve them to publish. |
| Inbox | **Enquiries**, **Newsletter** | Contact-form submissions (with status) and subscribers (CSV export). |
| Settings | **Site settings** | SEO defaults, company details, social links, analytics IDs, SMTP + notification emails, frontend revalidation. |

Page-section forms are generated from each section's content shape
(`app/Filament/Support/ContentForm.php`), so a section keeps the exact fields
the website expects. Media fields accept a site path (`/assets/…`) or a full
URL; the upload button stores a new file on this server and fills in its URL.

## API

All read endpoints return `{ "data": … }` in the website's own TypeScript
shapes (`app/Http/Resources/Transformers.php`). Responses are cached and the
cache is cleared whenever content is saved.

| Method | Path | |
|---|---|---|
| GET | `/api/v1/site` | Public settings |
| GET | `/api/v1/pages`, `/api/v1/pages/{slug}` | Page SEO + sections keyed by name |
| GET | `/api/v1/services`, `/api/v1/services/{slug}` | |
| GET | `/api/v1/projects[?full=1]`, `/api/v1/projects/{slug}` | Detail includes `next` |
| GET | `/api/v1/showreel`, `/clients`, `/team`, `/testimonials` | |
| GET | `/api/v1/post-categories` | |
| GET | `/api/v1/posts?category=&tag=&featured=&limit=&slugs=a,b` | |
| GET | `/api/v1/posts/{slug}` | Body blocks, approved comments, related posts |
| GET | `/api/v1/sitemap` | Every public path with its last change |
| POST | `/api/v1/contact` | `name, email, company, website, services[], budget, details` |
| POST | `/api/v1/newsletter` | `email, source (footer\|blog)` |
| POST | `/api/v1/posts/{slug}/comments` | `name, email, text` |

Form endpoints are rate-limited (5/min, 50/day per IP) and ignore any
submission that fills the hidden `_gotcha` honeypot field.

## Deploying

Any PHP 8.2+ host works (Forge, Ploi, a VPS, cPanel). Set `APP_ENV=production`,
`APP_DEBUG=false`, `APP_URL` to this server, `FRONTEND_URL` to the website, and
use MySQL/Postgres or keep SQLite. Then run `php artisan migrate --force`,
`php artisan db:seed --force` (first deploy only), `php artisan storage:link`
and `php artisan optimize`. Change the seeded admin password after first login.

For instant updates, add a revalidation route to the website and fill in
*Site settings → Frontend* with its URL and shared secret; every save then
pings it with `{ "tag": "cms" }` and an `x-revalidate-secret` header.

## Tests

```bash
php artisan test
```

`tests/Feature/AdminRoundTripTest.php` opens every page, service, case study,
post and showreel clip in the admin, saves without changes and checks the
content is identical; it also checks a section edit reaches the API.
