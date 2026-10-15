/**
 * Exports the Next.js site's built-in content (src/lib/*) to
 * database/seeders/data/content.json, which DatabaseSeeder imports — so the
 * CMS starts with exactly what the site shows today, nothing retyped.
 *
 * Run from the repository root (Node 22+):
 *   node --experimental-strip-types --no-warnings backend/scripts/export-frontend-content.mjs
 *
 * Homepage copy that lives in the section components (not in src/lib) is
 * transcribed in HOME below; keep it in sync if those components change
 * before the frontend reads it from the API.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const load = (path) => import(new URL(`file:///${resolve(root, path).replace(/\\/g, "/")}`));

const site = await load("src/lib/site.ts");
const home = await load("src/lib/site-content.ts");
const serviceContent = await load("src/lib/service-content.ts");
const about = await load("src/lib/pages/about.ts");
const services = await load("src/lib/pages/services.ts");
const work = await load("src/lib/pages/work.ts");
const contact = await load("src/lib/pages/contact.ts");
const blog = await load("src/lib/pages/blog.ts");

/** A section's heading copy, without the quote items (those live in Testimonials). */
const quoteHeading = ({ eyebrow, heading }) => ({ eyebrow, heading });

const HOME = {
  hero: { lines: ["We Make", "Your Website", "Poppin’"] },
  studio: {
    headline: "We’re A Funky Creative Studio",
    copy: "From strategy to execution, we offer a full suite of creative services designed to elevate your brand and captivate your audience.",
    badges: ["Strategy", "Branding", "Motion"],
    cta: { label: "Start a Project", href: "#contact" },
  },
  agency: {
    eyebrow: "The Agency",
    heading: "Behind the Brands You Love",
    copy: "We don’t just take on clients; we build long-term digital partnerships. Here are a few of the visionary companies we are proud to collaborate with every single day.",
    cta: { label: "View Our Case Studies", href: "/work" },
  },
  contact: {
    eyebrow: "Let’s Build Something",
    headline: ["Extraordinary", "Together"],
    copy: "Whether you need a complete brand overhaul, a high-converting web experience, or a full-scale marketing campaign, our team of experts is ready to execute. Tell us about your goals, and let’s turn your vision into reality.",
    cta: { label: "Schedule a Strategy Call", href: "mailto:hello@pixelpopers.com" },
  },
  leadership: {
    eyebrow: "Our Story",
    headline: "Three Friends. One Loud Idea.",
    story: "Pixel Popers started at a kitchen table with a simple belief: brands deserve to be felt, not just seen. Today we are a full-service crew of strategists, designers and developers who obsess over the details that make people stop scrolling — and keep coming back.",
    philosophy: "Strategy first. Craft always. Never boring.",
    stats: home.studioStats,
  },
  blog: {
    eyebrow: "Fresh From The Studio",
    heading: "Ideas Worth Popping",
    intro: "Notes on branding, design and growth from the people who build them every day.",
    cta: { label: "View All Posts", href: "/blog" },
    featured_slugs: [
      "bold-brands-win-the-scroll",
      "interfaces-people-enjoy",
      "snack-bar-campaign-playbook",
      "motion-that-means-something",
    ],
  },
};

const section = (key, label, content) => ({ key, label, content });

const pages = [
  {
    slug: "home",
    title: "Home",
    seo_title: site.SITE_TITLE,
    seo_description: site.SITE_DESCRIPTION,
    sections: [
      section("hero", "Hero", HOME.hero),
      section("studio", "Studio", HOME.studio),
      section("agency", "The Agency (clients folder)", HOME.agency),
      section("contact", "Let’s Build Something", HOME.contact),
      section("leadership", "Our Story / Leadership", HOME.leadership),
      section("blog", "Blog teaser", HOME.blog),
    ],
  },
  {
    slug: "about",
    title: "About",
    seo_title: about.aboutMeta.title,
    seo_description: about.aboutMeta.description,
    sections: [
      section("hero", "Hero", about.aboutHero),
      section("story", "Our story", about.aboutStory),
      section("full_story", "The full story", about.fullStory),
      section("values", "Values", { items: about.values }),
      section("in_practice", "In practice", about.inPractice),
      section("how_we_work", "How we work", about.howWeWork),
      section("audience", "Who we work with", about.audience),
      section("journey", "Our journey", about.journey),
      section("testimonials", "Testimonials heading", quoteHeading(about.testimonials)),
      section("perks", "Life at the studio", about.perks),
      section("hiring", "We’re hiring", about.hiring),
      section("cta", "Closing call to action", about.aboutCta),
    ],
  },
  {
    slug: "services",
    title: "Services",
    seo_title: services.servicesMeta.title,
    seo_description: services.servicesMeta.description,
    sections: [
      section("hero", "Hero", services.servicesHero),
      section("intro", "Intro", services.servicesIntro),
      section("rows", "Service rows", { items: services.serviceRows }),
      section("marquee", "Marquee", services.marquee),
      section("explained", "Every service explained", services.explained),
      section("faq", "FAQ", services.servicesFaq),
      section("comparison", "Comparison", services.comparison),
      section("industries", "Industries", services.industries),
      section("models", "Ways to work", services.models),
      section("stats", "Stats band", { items: services.servicesStats }),
      section("testimonials", "Testimonials heading", quoteHeading(services.servicesTestimonials)),
      section("cta", "Closing call to action", services.servicesCta),
    ],
  },
  {
    slug: "work",
    title: "Work",
    seo_title: work.workMeta.title,
    seo_description: work.workMeta.description,
    sections: [
      section("hero", "Hero", work.workHero),
      section("filters", "Filters", { items: work.filters }),
      section("intro", "Intro", work.workIntro),
      section("clients", "Client logos", { eyebrow: "The agency", heading: "Brands we’ve popped" }),
      section("impact", "Impact", work.impact),
      section("testimonials", "Testimonials heading", quoteHeading(work.workTestimonials)),
      section("teasers", "Coming soon", work.teasers),
      section("marquees", "Marquees", work.marquees),
      section("cta", "Closing call to action", work.workCta),
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    seo_title: contact.contactMeta.title,
    seo_description: contact.contactMeta.description,
    sections: [
      section("hero", "Hero", contact.contactHero),
      section("info", "Contact info", contact.contactInfo),
      section("form", "Project form", contact.contactForm),
      section("next_steps", "What happens next", contact.nextSteps),
      section("channels", "Other ways to say hi", contact.channels),
      section("chat_faq", "Chat FAQ", contact.chatFaq),
      section("after_send", "After you hit send", contact.afterSend),
      section("where_when", "Where & when", contact.whereWhen),
      section("testimonials", "Testimonials heading", quoteHeading(contact.contactTestimonials)),
    ],
  },
  {
    slug: "blog",
    title: "Blog",
    seo_title: blog.blogMeta.title,
    seo_description: blog.blogMeta.description,
    sections: [
      section("hero", "Hero", blog.blogHero),
      section("journal_intro", "Journal intro", blog.journalIntro),
      section("start_here", "Start here", blog.startHere),
      section("popular", "Popular this month", { slugs: blog.popularSlugs }),
      section("topics", "Browse by topic", { items: blog.topics }),
      section("resources", "Free resources", { items: blog.resources }),
      section("trending_tags", "Trending tags", { items: blog.trendingTags }),
      section("newsletter", "Newsletter", blog.newsletter),
    ],
  },
];

// The home tiles and the detail pages describe the same six services.
const tiles = Object.fromEntries(home.services.map((s) => [s.id, s]));
const serviceRecords = serviceContent.serviceDetails.map((detail) => ({ ...detail, tile: tiles[detail.slug] ?? null }));

// The same three quotes appear on four pages; keep one copy, with a tone
// the frontend maps back to its card / mark / avatar colours.
const toneOf = (q) => (q.card.includes("grape") ? "grape" : q.mark.includes("lagoon") ? "lagoon" : q.mark.includes("sunbeam") ? "sunbeam" : "blush");
const testimonials = about.testimonials.items.map((q) => ({
  quote: q.quote,
  role: q.role,
  company: q.company,
  initial: q.initial,
  tone: toneOf(q),
}));

const team = home.owners.map((o) => ({ ...o, bio_short: blog.authorBios[o.name]?.short ?? null, bio_long: blog.authorBios[o.name]?.long ?? null }));

const settings = {
  site_name: site.SITE_NAME,
  site_title: site.SITE_TITLE,
  site_description: site.SITE_DESCRIPTION,
  site_url: site.SITE_URL,
  company_email: contact.CONTACT_EMAIL,
  mail_to_address: contact.CONTACT_EMAIL,
  mail_from_address: contact.CONTACT_EMAIL,
  mail_from_name: site.SITE_NAME,
};

const out = {
  exported_at: new Date().toISOString(),
  settings,
  pages,
  services: serviceRecords,
  projects: work.projects,
  showreel: home.projects,
  clients: home.clients,
  team,
  testimonials,
  categories: blog.categories.map((name) => ({ name, tone: blog.categoryTone[name] })),
  posts: blog.posts,
};

const file = resolve(here, "../database/seeders/data/content.json");
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${file}`);
for (const [k, v] of Object.entries(out)) if (Array.isArray(v)) console.log(`  ${k}: ${v.length}`);
