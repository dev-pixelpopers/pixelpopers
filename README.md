# Pixel Popers — *We make your website poppin'*

The website of **Pixel Popers**, a funky creative studio for brand identity, UI/UX design, digital marketing, web development, motion graphics and content writing.

Most agency sites are a template: a hero, a grid of service cards, logos, a contact form. This one is built to work the way the studio works. Every scroll, hover and click is meant to show what Pixel Popers can make, and to be fun while it does it.

**Live:** [pixelpopers.vercel.app](https://pixelpopers.vercel.app) · **Design:** [Figma — pixles-popers](https://www.figma.com/design/BPye5ITVRRIXmKg8Hjnk6Q/pixles-popers)

---

## Table of contents

1. [What makes it different](#what-makes-it-different)
2. [A personal welcome](#1-a-personal-welcome)
3. [The home page: one continuous scroll story](#2-the-home-page-one-continuous-scroll-story)
4. [Service pages that act out the service](#3-service-pages-that-act-out-the-service)
5. [Hover-to-discover instead of walls of text](#4-hover-to-discover-instead-of-walls-of-text)
6. [The rest of the site](#5-the-rest-of-the-site)
7. [Content-rich and built for search](#6-content-rich-and-built-for-search)
8. [Fast, accessible and responsive](#7-fast-accessible-and-responsive)
9. [Managed from a real CMS](#8-managed-from-a-real-cms)
10. [Tech stack](#tech-stack)
11. [Getting started](#getting-started)
12. [Project structure](#project-structure)
13. [Conventions](#conventions)

---

## What makes it different

| A typical agency site | Pixel Popers |
|---|---|
| A static hero and a stock headline | A headline that **pops in letter by letter** and bounces when you hover it |
| A carousel of thumbnails | A **3D ring of real project videos**, turned by your scroll, that **folds into a cube** |
| Sections that simply stack | **One continuous scroll story.** Each section hands its screen to the next: a cube pops, a folder bursts, letters burst out of bubbles |
| Six identical service cards | Six service pages that **act out their own service**: a brand book, a design canvas, a growth dashboard, a code editor, a video timeline and an editor's red pen |
| Long "our process" lists | **Hover-to-discover cards.** Book chapters flip open, artboards reveal dev notes, story ads skip to the next frame |
| A form at the bottom of the page | A **personal welcome** that learns your name, greets you on every page and opens a chat |
| Pretty but thin pages | **1,000+ words of real copy** on every service page, structured data and an auto-generated sitemap |
| Content baked into code | A **Laravel + Filament CMS** with instant revalidation. The site keeps working even if the CMS is down |

---

## 1. A personal welcome

The site greets visitors by name (`src/components/layout/VisitorWelcome.tsx`, `src/lib/visitor.ts`).

- **First-visit intro.**
  - A pixel mosaic in the brand colours fills the screen and settles into a field of twinkling dots.
  - A giant counter races to **100** under a ticker of loading words.
  - At 100 it goes ***POP!***: a squash, a shockwave, and the pixels explode outwards.
- **"What's your name?"**
  - A waving mascot asks for the visitor's first name, then gives a thumbs-up.
  - The name is stored in that browser only. "Not you?" forgets it and asks again.
- **Page-by-page greetings.** Every page has its own greeting card, emoji, colour and line, for example:
  - *"Hey Sara, pick your pop!"* on Services
  - *"Grab a coffee, Sara"* on a blog post
  - A countdown bar dismisses the card, and hovering pauses it.
- **Chat on tap.** Tapping a greeting opens a pop-up chat built on the contact form. It loads only when it is first opened, so no page pays for it up front.
- **Sound, done politely.** Clips play their sound once, after the visitor has interacted with the page. A speaker button mutes them, and the mute is remembered.
- **Not in the way.** Crawlers and page-speed tests never see the intro. The page's own entrance animation waits and plays the moment the intro leaves.

Every greeting clip can be swapped from the CMS (**Site settings → Greetings**), as a GIF or an MP4.

---

## 2. The home page: one continuous scroll story

Most single-page sites stack sections one under another. Here, each section **tucks under the previous one and takes over its screen** as the previous one exits, so the page plays like one animated piece.

1. **Hero** (`components/hero/`)
   - "We make your website poppin'" hops in letter by letter with squash and stretch.
   - The doodles spring in, and the flower throws a ring of sparks.
   - Hovered letters bounce. The headline is visible from the first paint, because it is the largest element the page paints and so sets its load-speed score.
2. **Showreel ring** (`components/slider/`)
   - A **3D ring of project videos**, turned by scroll.
   - It snaps to the nearest tile, so a clip is never left half-turned.
   - It also advances on its own each time a clip finishes, with a "01 / 06" caption and a progress bar.
   - Only the front clip plays, and only while the ring is on screen.
3. **Ring → cube hand-off**
   - The ring whirls, folds shut into a **six-sided CSS 3D cube** and travels down to the Studio section.
   - There it becomes the Studio cube (`ui/StudioCube.tsx`): its faces are the same project clips, and it makes a quarter turn each time a clip ends.
4. **Studio** (`sections/StudioSection.tsx`)
   - A hand-drawn ribbon traces itself around the tumbling cube.
   - Service badges orbit it.
   - On exit, the cube **pops** in a burst of confetti.
5. **Services — the P O P / E R S letters** (`sections/ServicesSection.tsx`)
   - Giant letters spell the second half of the brand.
   - Each pops out of its bubble with a shockwave and confetti.
   - Hovering a letter reveals a photo or video inside it.
6. **Agency** (`sections/AgencySection.tsx`)
   - Project cards are pulled out of a folder with a frosted front panel.
   - They scatter across the screen in an even, never-gridded layout.
   - Then the folder pops.
7. **Contact → Our Story → Blog**
   - The headline bounces in letter by letter and the paragraph rises in word by word.
   - Each section holds its screen, plays its entrance, then hands over to the next.

Idle loops (floats, wobbles, marquees) run only while someone could be watching them (`lib/ambient.ts`). Set-up work waits for the first interaction or an idle moment (`lib/defer-setup.ts`), so load stays fast.

---

## 3. Service pages that act out the service

Each of the six service pages (`/services/[slug]`) has its own concept and its own interactive pieces.

| Service | Concept | Highlights |
|---|---|---|
| **Brand Identity** | A brand book | Book-cover stack hero · logo construction grid · full-bleed swatches with HEX/RGB/CMYK · live type specimen in the real brand fonts · stationery flat-lay · **draggable before/after slider** · book-spine chapters |
| **UI/UX Design** | A design-tool canvas | Grid canvas with a phone, selection handles, **live multiplayer cursors**, comment pin and layers panel · wireframe → hi-fi · component library · user-flow board · usability heatmap · artboards |
| **Digital Marketing** | A growth dashboard | Analytics card whose line chart **draws itself** · notification toasts popping · channel orbit · funnel · content calendar · bar chart and **counting KPIs** · #1 search result being typed · story ads |
| **Web Development** | Code + browser (dark) | Code editor that **types itself** (JetBrains Mono) · Lighthouse gauges counting to 98 / 100 / 100 / 100 · keycap tech stack · responsive devices · **deploy terminal printing line by line** · CMS editor · launch checklist |
| **Motion Graphic** | A video editor | Bouncing-letter title · playable video player · film strip · keyframe timeline whose **playhead scrubs with scroll** · easing curves with a dot running each ease · storyboard · reels · aspect-ratio formats |
| **Content Writing** | An editorial desk | Draft paper (Playfair Display) where a **red pen strikes through jargon** and the rewrite drops in · tone-of-voice sliders · "The Poppin' Post" newspaper · SEO paragraph with highlighted keywords · sticky-note stats |

Every service page then shares the same closing run:

- a ~1,000-word long-form section (overview, what's included, who it's for, a short guide, why us);
- packages styled to the page's concept (swatch cards, `.fig` windows, `<code />` cards, film strips, lined paper with tape);
- an FAQ;
- "More ways to pop" links to the other services;
- a call to action.

---

## 4. Hover-to-discover instead of walls of text

The design avoids saying the same thing twice. Where a visual section and a text section described the same process, they were merged into one interactive section (`components/inner/RevealCard.tsx`):

- **Brand Identity: chapters flip open.** Hovering a book-spine card flips it in 3D to show its back page, with the chapter title, the full step and a page number on ruled lines.
- **UI/UX Design: artboards show dev notes.**
  - A Figma-style blue selection box and size tag appear.
  - The sketch behind them blurs.
  - A dark "dev notes" card slides up with the step.
- **Digital Marketing: stories skip forward.**
  - The ad slides out like tapping to the next Instagram story.
  - The next frame shows "Step 02 of 04 · PLAN" with a filling progress bar and a "Next: Launch ↑" button.

It works on every device:

- **Mouse:** hover to open.
- **Touch:** tap to open, tap again to close.
- **Keyboard:** Enter or Space toggles a card; Escape closes it.

The hidden text is always in the page's HTML, so it can still be read and indexed by search engines.

---

## 5. The rest of the site

- **Full-screen menu** on every page.
  - It opens with a circular wipe; the links rise in and a tilted showcase card swings in.
  - The current page is highlighted.
  - Escape closes it, and page scroll is locked while it is open.
- **About**
  - Story, values cards, a "From spark to pop" process band, a 2019 → 2026 journey timeline, testimonials, perks and a "We're hiring" band.
- **Services overview**
  - Hover-highlighted service rows with photos.
  - Animated marquees, an "us vs a typical agency" comparison, an industries grid, ways to work and a stats band.
- **Work**
  - Filter chips, sort and "Load more", all working.
  - A featured case study, impact stats, an "In the oven" blurred teaser row and crossing ticker bands.
- **Case studies** (`/work/[slug]`)
  - Brief, brand system, results, pull quote, the full story, gallery, deliverables, a phase timeline chart, team chips and a link to the next project.
- **Blog**
  - Category chips and search that filter as you type, plus topic tiles, trending tags, resources and a newsletter signup.
- **Articles** (`/blog/[slug]`)
  - Block-based articles: headings, lists, numbered steps, stat boxes, pull quotes and call-outs.
  - A table of contents that highlights the section you're reading, share links, an author bio, comments (moderated in the CMS) and related posts.
- **Contact**
  - A form with service and budget chips, "what happens after you hit send", a chat-style FAQ and other ways to say hi.

---

## 6. Content-rich and built for search

- **Real text, not just graphics.** Every service page carries 1,000+ words of crawlable copy. Every inner page has proper text sections.
- **One `<h1>` per page**, with headings in order and descriptive alt text on images.
- **Per-page metadata:** title, description, canonical URL, Open Graph and Twitter cards, all editable in the CMS.
- **Structured data (JSON-LD):** Organization, WebSite, Service + Offer, FAQPage, BreadcrumbList, CreativeWork, Blog/BlogPosting, ContactPage and AboutPage.
- **Generated files:**
  - `sitemap.xml` lists every page, service, case study and post. Pages switched off in the CMS are left out.
  - `robots.txt`, the web manifest and Open Graph images are generated too.
- **Static generation:** every service, case study and post is pre-rendered at build time.

---

## 7. Fast, accessible and responsive

- **Real brand fonts:** Nevera (display) and Haas Grot Disp (labels and headings), with Modak for the giant letters.
- **Fluid everything.**
  - The type scale is `clamp()`-based on the 1920px Figma measurements.
  - Collages size themselves with container-query units (`cqw`), so each one scales as a single piece.
  - Everything is checked from 390px phones to 1920px screens, with no sideways scroll.
- **Layout in normal flow.** Layout uses flexbox, CSS grid and single-cell grid overlays. `position: absolute` is kept for purely decorative artwork, and each use is commented.
- **Respects reduced motion.** Every GSAP animation has a `prefers-reduced-motion` branch that shows the finished state instead.
- **Performance-minded.**
  - The headline is painted on first load.
  - Glows are drawn in CSS rather than heavy blurred SVGs.
  - Videos load their poster first, and only the clip on screen plays.
  - Idle animations pause off screen.
  - The chat loads only when opened.
- **Accessible:**
  - Keyboard-operable menus, cards, sliders and forms.
  - Visible focus rings and proper labels.
  - `aria-*` states.
  - Screen-reader text for the visual-only widgets.

---

## 8. Managed from a real CMS

`backend/` is a **Laravel 12 + Filament 5** admin panel with a public JSON API. See [`backend/README.md`](backend/README.md) for the full guide.

- **Pages:**
  - Home, About, Services, Work, Contact and Blog are each split into sections.
  - Any section can be hidden, and each page has its own SEO tab.
- **Services, case studies, the showreel, client logos, testimonials and team** are all editable.
- **Blog:** block-based posts, categories, and comments that wait for approval.
- **Inbox:** contact enquiries (with status) and newsletter subscribers (CSV export).
- **Site settings:** SEO defaults, company details, social links, analytics IDs, SMTP, notification emails and greeting clips.

How the frontend connects:

- **Instant updates.** Saving in the CMS calls `/api/revalidate`, so the live site refreshes without a redeploy.
- **Never breaks.** Without `CMS_API_URL`, or whenever the CMS can't be reached, every page falls back to its built-in content (`src/lib/content.ts`).
- **Forms** post to `app/api/forms/[form]`, which forwards them to the CMS on the server.

---

## Tech stack

| Layer | Tools |
|---|---|
| Framework | **Next.js 16** (App Router, server components, static generation) · **React 19** · **TypeScript** |
| Styling | **Tailwind CSS v4** with `@theme` design tokens, fluid `clamp()` type, container queries |
| Motion | **GSAP 3** + `@gsap/react` (`useGSAP`, ScrollTrigger, matchMedia) |
| CMS / API | **Laravel 12 + Filament 5** (`backend/`) |
| Design | **Figma.** Every page, including the menu and its mobile version, has a matching frame |
| Hosting | Vercel (site) + a separate server for the CMS |

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Optional, to read content from the CMS:

```bash
# .env.local
CMS_API_URL=http://127.0.0.1:8000
```

Then start the CMS. Full steps are in [`backend/README.md`](backend/README.md):

```bash
cd backend
composer install && cp .env.example .env && php artisan key:generate
php artisan migrate --seed && php artisan storage:link
php artisan serve    # admin at http://127.0.0.1:8000/admin
```

Other scripts:

```bash
npm run build && npm start
npm run lint
```

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                 Home — the scroll story
│  ├─ (inner)/                 About, Services (+ [slug]), Work (+ [slug]), Blog (+ [slug]), Contact
│  ├─ api/forms/[form]/        Form submissions → CMS
│  ├─ api/revalidate/          CMS-triggered cache refresh
│  ├─ sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx
│  └─ globals.css              Design tokens, fonts, fluid type scale, `shell` utility
├─ components/
│  ├─ hero/                    Pop-in headline + scroll hand-off
│  ├─ slider/                  3D showreel ring (engine, playback, caption)
│  ├─ sections/                Home sections (Studio, Services letters, Agency, Contact, Leadership, Blog)
│  ├─ layout/                  SiteHeader, MenuOverlay, SiteFooter, VisitorWelcome
│  ├─ ui/                      PopButton, BrandLogo, StudioCube, GlowOrb, ServiceTile…
│  └─ inner/                   Inner-page building blocks
│     ├─ services/<slug>/      Each service's concept sections + package card
│     ├─ service/              Shared long-form and closing run of service pages
│     ├─ about/ · work/ · blog/ · contact/ · services-overview/
│     └─ RevealCard.tsx        Hover / tap / keyboard reveal cards
└─ lib/
   ├─ content.ts               CMS client with a static fallback
   ├─ service-content.ts       Service copy (1,000+ words each)
   ├─ pages/*.ts               Built-in copy for About, Services, Work, Blog, Contact
   ├─ visitor.ts               Welcome / greeting state
   └─ ambient.ts · defer-setup.ts   Performance helpers for idle animation and set-up
backend/                       Laravel + Filament CMS and API
public/assets/ · public/icons/ Images, videos, fonts and vector artwork
```

---

## Conventions

- **The home page is one choreography.**
  - Its sections share pinned screens and hand-off timings (see `agency-motion.ts` and `studio-cube-motion.ts`).
  - Change scroll lengths together, not one section at a time.
- **Flow first:** flex, grid and single-cell grid overlays. `absolute` is only for decorative artwork, with a comment saying why.
- **Every animation:**
  - is built with `useGSAP` and cleans up on unmount;
  - has a reduced-motion branch;
  - never hides content from crawlers.
- **Fonts:**
  - Nevera → `font-display`
  - Haas Grot → `font-haas`
  - running copy → `font-copy`
  - Modak → `font-pop`
- **Content lives in data** (`src/lib`, or the CMS), not in components, so the CMS can drive every page.
