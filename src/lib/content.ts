/**
 * The site's content, from the CMS when it's connected and from the built-in
 * data in src/lib otherwise.
 *
 * Set CMS_API_URL (e.g. http://127.0.0.1:8000 locally, the hosted CMS on
 * Vercel) and every page reads its copy, services, case studies, posts and
 * settings from the CMS API. Without it — or whenever the CMS can't be
 * reached — pages render the static content they always have, so the site
 * never breaks because the CMS is down.
 *
 * Each getter returns data in exactly the shapes the components already use
 * (the API serves the frontend's own types; see backend/README.md). A page
 * section the CMS has switched off comes back as `null`, and pages skip it.
 *
 * Caching: in production responses are cached for REVALIDATE_SECONDS and
 * tagged "cms", so saving in the CMS refreshes the site through
 * /api/revalidate. In `next dev` nothing is cached: a CMS save shows on the
 * next refresh.
 */
import "server-only";

import { notFound } from "next/navigation";

import { cache } from "react";

import * as aboutStatic from "@/lib/pages/about";
import * as blogStatic from "@/lib/pages/blog";
import * as contactStatic from "@/lib/pages/contact";
import * as servicesStatic from "@/lib/pages/services";
import * as workStatic from "@/lib/pages/work";
import * as homeStatic from "@/lib/home-content";
import * as siteStatic from "@/lib/site";
import * as siteContent from "@/lib/site-content";
import { serviceDetails as staticServiceDetails, type ServiceDetail } from "@/lib/service-content";
import type { Category, Post, Tone } from "@/lib/pages/blog";
import type { Quote } from "@/lib/pages/services";
import type { Project } from "@/lib/pages/work";
import type { Client, Owner, Project as ShowreelProject, Service } from "@/lib/site-content";

export const CMS_TAG = "cms";
const REVALIDATE_SECONDS = 300;
/**
 * A build fetches many pages at once and must not quietly fall back to static
 * content just because the CMS was slow (`php artisan serve` answers one
 * request at a time), so builds wait longer and retry once; page requests at
 * runtime give up quickly and serve the static content instead.
 */
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const TIMEOUT_MS = IS_BUILD ? 30000 : 5000;
const ATTEMPTS = IS_BUILD ? 2 : 1;

const API = process.env.CMS_API_URL?.trim().replace(/\/+$/, "") || null;

/**
 * Upload URLs are built from the CMS's own APP_URL, which may say http://
 * while the CMS is served over https://. Browsers block http media on an
 * https site and the image optimiser only accepts the CMS's https address,
 * so links to the CMS are upgraded to match CMS_API_URL.
 */
const CMS_HOST = API?.startsWith("https://") ? API.slice("https://".length) : null;
const secureCmsLinks = (json: string) =>
  CMS_HOST
    ? json.replaceAll(`http://${CMS_HOST}/`, `https://${CMS_HOST}/`).replaceAll(`"http://${CMS_HOST}"`, `"https://${CMS_HOST}"`)
    : json;

/** "unavailable": no CMS configured / unreachable → use static. "missing": the CMS answered 404. */
type Fetched<T> = { ok: true; data: T } | { ok: false; reason: "unavailable" | "missing" };

let warned = false;

async function fromCms<T>(path: string, attempt = 1): Promise<Fetched<T>> {
  if (!API) return { ok: false, reason: "unavailable" };
  try {
    const res = await fetch(`${API}/api/v1${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS, tags: [CMS_TAG] } }),
    });
    if (res.status === 404) return { ok: false, reason: "missing" };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const body = JSON.parse(secureCmsLinks(text)) as { data: T };
    return { ok: true, data: body.data };
  } catch (error) {
    if (attempt < ATTEMPTS) return fromCms<T>(path, attempt + 1);
    if (!warned) {
      warned = true;
      console.warn(`[cms] ${API} unavailable (${(error as Error).message}) — using built-in content.`);
    }
    return { ok: false, reason: "unavailable" };
  }
}

/** A collection from the CMS, or the static fallback when the CMS can't be reached. */
async function collection<T>(path: string, fallback: T): Promise<T> {
  const res = await fromCms<T>(path);
  return res.ok ? res.data : fallback;
}

/* ───────────────────────────── Pages ───────────────────────────── */

type PageSeo = { title: string | null; description: string | null; ogImage: string | null; robots?: string | null };
type CmsPage = { slug: string; title: string; seo: PageSeo; sections: Record<string, unknown> };

/**
 * A page's sections. From the CMS: each section as stored, `null` if it's
 * switched off. Without the CMS: the static values.
 */
async function pageSections<S extends Record<string, unknown>>(slug: string, fallback: S, fallbackSeo: { title: string; description: string }) {
  const res = await fromCms<CmsPage>(`/pages/${slug}`);
  if (!res.ok) {
    return { fromCms: false, seo: { ...fallbackSeo, ogImage: null as string | null }, sections: fallback as { [K in keyof S]: S[K] | null } };
  }
  const sections = Object.fromEntries(
    Object.keys(fallback).map((key) => [key, key in res.data.sections ? res.data.sections[key] : null]),
  ) as { [K in keyof S]: S[K] | null };
  return {
    fromCms: true,
    seo: {
      title: res.data.seo.title || fallbackSeo.title,
      description: res.data.seo.description || fallbackSeo.description,
      ogImage: res.data.seo.ogImage,
    },
    sections,
  };
}

/* ─────────────────────────── Collections ─────────────────────────── */

export const getSite = cache(async () => {
  const fallback = {
    site_name: siteStatic.SITE_NAME,
    site_title: siteStatic.SITE_TITLE,
    site_description: siteStatic.SITE_DESCRIPTION,
    site_url: siteStatic.SITE_URL,
    company_email: contactStatic.CONTACT_EMAIL,
    footer_tagline: "A funky creative studio making brands impossible to scroll past — from strategy to the last pixel.",
    availability_label: "Available for new projects" as string | null,
    social_instagram: "https://instagram.com/" as string | null,
    social_behance: "https://behance.net/" as string | null,
    social_linkedin: "https://linkedin.com/" as string | null,
    social_dribbble: "https://dribbble.com/" as string | null,
    // Visitor greetings: GIFs uploaded in Site settings → Greetings (emoji badges until then).
    greeting_gif: null as string | null,
    thumbs_gif: null as string | null,
    greeting_gif_home: null as string | null,
    greeting_gif_work: null as string | null,
    greeting_gif_case_study: null as string | null,
    greeting_gif_services: null as string | null,
    greeting_gif_service: null as string | null,
    greeting_gif_about: null as string | null,
    greeting_gif_blog: null as string | null,
    greeting_gif_post: null as string | null,
    greeting_gif_contact: null as string | null,
  };
  const res = await fromCms<Partial<typeof fallback>>("/site");
  if (!res.ok) return fallback;
  // Empty settings keep the built-in value, except the availability badge, which can be cleared to hide it.
  const merged = { ...fallback };
  for (const [key, value] of Object.entries(res.data)) {
    if (key in merged && (value || key === "availability_label")) (merged as Record<string, unknown>)[key] = value || null;
  }
  return merged;
});

export type SiteSettings = Awaited<ReturnType<typeof getSite>>;

export const getServiceDetails = cache(() => collection<ServiceDetail[]>("/services?full=1", staticServiceDetails));

/** Pages that can be switched off in the CMS (Pages → Published). */
export const TOGGLEABLE_PAGES = ["work", "services", "about", "blog", "contact"] as const;
export type ToggleablePage = (typeof TOGGLEABLE_PAGES)[number];

/**
 * Pages unpublished in the CMS: their links leave the header menu, footer and
 * sitemap, and the page itself is a 404. Without a CMS connection nothing is hidden.
 */
export const getHiddenPages = cache(async (): Promise<ToggleablePage[]> => {
  const res = await fromCms<{ slug: string }[]>("/pages");
  if (!res.ok) return [];
  const published = new Set(res.data.map((p) => p.slug));
  return TOGGLEABLE_PAGES.filter((slug) => !published.has(slug));
});

/** Ends the request with a 404 when the CMS has the page switched off. */
export async function assertPagePublished(slug: ToggleablePage) {
  if ((await getHiddenPages()).includes(slug)) notFound();
}

/** Name + page of every published service, in the CMS's order (the footer's Services menu). */
export const getServiceLinks = cache(async (): Promise<{ label: string; href: string }[]> => {
  const list = await collection<{ slug: string; name: string }[]>("/services", staticServiceDetails);
  return list.map((s) => ({ label: s.name, href: `/services/${s.slug}` }));
});

export const getServiceDetail = cache(async (slug: string): Promise<ServiceDetail | null> => {
  const res = await fromCms<ServiceDetail>(`/services/${slug}`);
  if (res.ok) return res.data;
  return res.reason === "missing" ? null : (staticServiceDetails.find((s) => s.slug === slug) ?? null);
});

/** The home page's giant-letter tiles. */
export const getServiceTiles = cache(async (): Promise<Service[]> => {
  const res = await fromCms<{ tile: Service | null }[]>("/services");
  if (!res.ok) return siteContent.services;
  return res.data.map((s) => s.tile).filter((t): t is Service => t !== null);
});

export const getProjects = cache(() => collection<Project[]>("/projects?full=1", workStatic.projects));

export const getProject = cache(async (slug: string): Promise<{ project: Project; next: Project } | null> => {
  const res = await fromCms<Project & { next: Project }>(`/projects/${slug}`);
  if (res.ok) {
    const { next, ...project } = res.data;
    return { project, next };
  }
  if (res.reason === "missing") return null;
  const project = workStatic.getProject(slug);
  return project ? { project, next: workStatic.getNextProject(slug) } : null;
});

export const getShowreel = cache(() => collection<ShowreelProject[]>("/showreel", siteContent.projects));
export const getClients = cache(() => collection<Client[]>("/clients", siteContent.clients));

type CmsTeamMember = Owner & { bio: { short: string | null; long: string | null } };

export const getTeam = cache(async () => {
  const res = await fromCms<CmsTeamMember[]>("/team");
  if (!res.ok) return { owners: siteContent.owners, bios: blogStatic.authorBios as Record<string, { short: string; long: string }> };
  return {
    owners: res.data.map((m): Owner => ({ name: m.name, role: m.role, avatar: m.avatar, accent: m.accent, rotate: m.rotate })),
    bios: Object.fromEntries(res.data.map((m) => [m.name, { short: m.bio.short ?? "", long: m.bio.long ?? "" }])),
  };
});

type CmsQuote = { quote: string; role: string; company: string; initial: string; tone: string };

/** Card colours for each testimonial tone (the classes the static quotes used). */
const QUOTE_TONES: Record<string, Pick<Quote, "card" | "mark" | "avatar">> = {
  blush: { card: "bg-white text-ink", mark: "text-blush-ink", avatar: "bg-blush text-white" },
  grape: { card: "bg-grape text-white", mark: "text-sunbeam", avatar: "bg-sunbeam text-ink" },
  lagoon: { card: "bg-white text-ink", mark: "text-lagoon", avatar: "bg-lagoon text-white" },
  sunbeam: { card: "bg-sunbeam text-ink", mark: "text-grape", avatar: "bg-grape text-white" },
  lav: { card: "bg-white text-ink", mark: "text-grape", avatar: "bg-lav text-ink" },
};

/**
 * Testimonials laid out like `layout` (one page's static quotes): each card
 * keeps that page's tilt and offset for its position, the CMS supplies the
 * quote and its colour.
 */
export const getQuotes = cache(async (layout: readonly Quote[]): Promise<Quote[]> => {
  const res = await fromCms<CmsQuote[]>("/testimonials");
  if (!res.ok) return [...layout];
  return res.data.map((q, i) => {
    const slot = layout[i % layout.length];
    return { quote: q.quote, role: q.role, company: q.company, initial: q.initial, tilt: slot?.tilt ?? "", offset: slot?.offset ?? "", ...(QUOTE_TONES[q.tone] ?? QUOTE_TONES.blush) };
  });
});

/* ───────────────────────────── Blog ───────────────────────────── */

type CmsPost = Post & { categoryTone?: Tone; authorBio?: unknown; related?: Post[]; seo?: unknown; updatedAt?: string };

export const getPosts = cache(() => collection<Post[]>("/posts", blogStatic.posts));

export const getPost = cache(async (slug: string): Promise<{ post: Post; related: Post[] } | null> => {
  const res = await fromCms<CmsPost>(`/posts/${slug}`);
  if (res.ok) {
    const { related = [], ...post } = res.data;
    return { post: post as Post, related };
  }
  if (res.reason === "missing") return null;
  const post = blogStatic.getPost(slug);
  return post ? { post, related: blogStatic.relatedPosts(post) } : null;
});

export const getCategories = cache(async (): Promise<{ categories: Category[]; categoryTone: Record<string, Tone> }> => {
  const res = await fromCms<{ name: Category; tone: Tone }[]>("/post-categories");
  if (!res.ok) return { categories: blogStatic.categories, categoryTone: blogStatic.categoryTone };
  return {
    categories: res.data.map((c) => c.name),
    categoryTone: Object.fromEntries(res.data.map((c) => [c.name, c.tone])),
  };
});

/* ───────────────────────────── Pages ───────────────────────────── */

export const getHome = cache(async () => {
  const page = await pageSections(
    "home",
    {
      hero: homeStatic.homeHero,
      studio: homeStatic.homeStudio,
      agency: homeStatic.homeAgency,
      contact: homeStatic.homeContact,
      leadership: homeStatic.homeLeadership,
      blog: homeStatic.homeBlog,
    },
    { title: siteStatic.SITE_TITLE, description: siteStatic.SITE_DESCRIPTION },
  );
  return page;
});

export const getAbout = cache(() =>
  pageSections(
    "about",
    {
      hero: aboutStatic.aboutHero,
      story: aboutStatic.aboutStory,
      full_story: aboutStatic.fullStory,
      values: { items: aboutStatic.values },
      in_practice: aboutStatic.inPractice,
      how_we_work: aboutStatic.howWeWork,
      audience: aboutStatic.audience,
      journey: aboutStatic.journey,
      testimonials: { eyebrow: aboutStatic.testimonials.eyebrow, heading: aboutStatic.testimonials.heading },
      perks: aboutStatic.perks,
      hiring: aboutStatic.hiring,
      cta: aboutStatic.aboutCta,
    },
    aboutStatic.aboutMeta,
  ),
);

export const getServicesPage = cache(() =>
  pageSections(
    "services",
    {
      hero: servicesStatic.servicesHero,
      intro: servicesStatic.servicesIntro,
      rows: { items: servicesStatic.serviceRows },
      marquee: servicesStatic.marquee,
      explained: servicesStatic.explained,
      faq: servicesStatic.servicesFaq,
      comparison: servicesStatic.comparison,
      industries: servicesStatic.industries,
      models: servicesStatic.models,
      stats: { items: servicesStatic.servicesStats },
      testimonials: { eyebrow: servicesStatic.servicesTestimonials.eyebrow, heading: servicesStatic.servicesTestimonials.heading },
      cta: servicesStatic.servicesCta,
    },
    servicesStatic.servicesMeta,
  ),
);

export const getWorkPage = cache(() =>
  pageSections(
    "work",
    {
      hero: workStatic.workHero,
      filters: { items: workStatic.filters },
      intro: workStatic.workIntro,
      clients: { eyebrow: "The agency", heading: "Brands we’ve popped" },
      impact: workStatic.impact,
      testimonials: { eyebrow: workStatic.workTestimonials.eyebrow, heading: workStatic.workTestimonials.heading },
      teasers: workStatic.teasers,
      marquees: workStatic.marquees,
      cta: workStatic.workCta,
    },
    workStatic.workMeta,
  ),
);

export const getContactPage = cache(() =>
  pageSections(
    "contact",
    {
      hero: contactStatic.contactHero,
      info: contactStatic.contactInfo,
      form: contactStatic.contactForm,
      next_steps: contactStatic.nextSteps,
      channels: contactStatic.channels,
      chat_faq: contactStatic.chatFaq,
      after_send: contactStatic.afterSend,
      where_when: contactStatic.whereWhen,
      testimonials: { eyebrow: contactStatic.contactTestimonials.eyebrow, heading: contactStatic.contactTestimonials.heading },
    },
    contactStatic.contactMeta,
  ),
);

export const getBlogPage = cache(() =>
  pageSections(
    "blog",
    {
      hero: blogStatic.blogHero,
      journal_intro: blogStatic.journalIntro,
      start_here: blogStatic.startHere,
      popular: { slugs: blogStatic.popularSlugs },
      topics: { items: blogStatic.topics },
      resources: { items: blogStatic.resources },
      trending_tags: { items: blogStatic.trendingTags },
      newsletter: blogStatic.newsletter,
    },
    blogStatic.blogMeta,
  ),
);

/**
 * Forwards a form submission to the CMS (used by the /api/forms/* route
 * handlers, so browsers never call the CMS directly). Returns the CMS's
 * status and JSON body, or null when the CMS isn't configured or reachable.
 */
export async function postToCms(path: string, payload: unknown, clientIp?: string | null) {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/api/v1${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // The CMS only trusts the visitor's address when it comes with the
        // shared secret — otherwise every visitor would share one spam limit.
        ...(clientIp ? { "X-Visitor-Ip": clientIp } : {}),
        ...(process.env.REVALIDATE_SECRET ? { "X-Site-Key": process.env.REVALIDATE_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      // A visitor waits on this, but giving up early is worse: the CMS may
      // still save it while the page says it failed (and offers email instead).
      signal: AbortSignal.timeout(25000),
    });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string[]> } };
  } catch {
    return null;
  }
}
