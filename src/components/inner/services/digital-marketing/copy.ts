import type { ServiceDetail } from "@/lib/service-content";

/*
  Every piece of copy on the Digital Marketing page's design sections,
  editable in the CMS (Services → Digital Marketing → Page sections). These
  are the design's own words; the CMS stores the same shape, and any field
  left empty there falls back to the value here.

  Lists are fixed-length: each item has its place (and colour) in the design
  — the six channel circles, the five funnel bars, the three stickers — so
  the CMS edits their text, never their number.
*/

export const DM_COPY = {
  hero: {
    dashboard: {
      title: "Campaign overview",
      period: "Last 30 days",
      kpis: [
        { label: "Reach", value: "1.2M", delta: "+212%" },
        { label: "Clicks", value: "48.3K", delta: "+87%" },
        { label: "Sales", value: "$86K", delta: "+64%" },
      ],
    },
    toasts: [{ label: "♥  12.4K" }, { label: "●  New lead: Sarah from Lahore" }, { label: "ROAS 3.2×" }, { label: "CTR 4.8%" }],
  },
  engine: {
    eyebrow: "The growth engine",
    heading: "One brand. Six channels.",
    text: "",
    center: "Your\nbrand",
    channels: [
      { name: "Social", note: "+48% followers" },
      { name: "SEO", note: "Page 1 rankings" },
      { name: "Paid ads", note: "3.2× ROAS" },
      { name: "Email", note: "42% open rate" },
      { name: "Content", note: "Reels & posts" },
      { name: "Analytics", note: "Monthly reports" },
    ],
  },
  funnel: {
    eyebrow: "The funnel, fixed",
    heading: "From “who?” to “where do I pay?”",
    text: "",
    stages: [
      { stage: "Awareness", how: "Reels, collabs & paid reach", result: "1.2M reached" },
      { stage: "Interest", how: "Content, SEO & retargeting", result: "86K visits" },
      { stage: "Consideration", how: "Reviews, email & landing pages", result: "12K leads" },
      { stage: "Conversion", how: "Offers, checkout & ads", result: "3.4K sales" },
      { stage: "Loyalty", how: "Email flows & community", result: "42% repeat" },
    ],
  },
  social: {
    eyebrow: "Social media",
    heading: "Feeds that\nactually pop",
    intro: "We plan, shoot, design and post — a consistent feed with a clear look, a steady rhythm and content people save and share.",
    text: "As a social media marketing agency, we plan, design and create content that gives your brand a distinctive presence. From reels and carousels to campaigns and content calendars, we keep your feed consistent, your audience engaged and your brand worth following.",
    calendar: "Content calendar · October",
  },
  results: {
    eyebrow: "Results, not vanity",
    heading: "Watch the bars go up",
    text: "Our digital marketing services for small business focus on results that matter, more qualified leads, stronger conversions and measurable revenue growth. We track performance, optimise campaigns and make every marketing investment work harder for your business.",
    chartTitle: "Monthly revenue from digital channels",
    before: "Before",
    after: "With Pixel Popers",
    highlight: "OCT  ·  $38.6K",
    highlightNote: "▲ 160% vs May",
    stickers: [
      { value: "+160%", label: "Revenue in 6 months" },
      { value: "4.8%", label: "Avg. click-through" },
      { value: "−38%", label: "Cost per lead" },
    ],
  },
  seo: {
    eyebrow: "SEO",
    heading: "Be the first thing they find",
    subheading: "SEO Services That Put Your Business First in Search",
    text: "Get found by customers already searching for what you offer. Our SEO services focus on improving search visibility, attracting relevant traffic and turning organic searches into real business opportunities.",
    query: "best specialty coffee near me",
    result: {
      url: "fifthsip.cafe › menu",
      title: "Fifth Sip — Specialty Coffee & Brunch | Order Online",
      rating: "4.9 (1,204)",
      description: "Open now  ·  Freshly roasted beans, brunch all day and the best flat white in town.",
    },
    others: [
      { url: "anothercafe.com › about", title: "Another Café — Coffee Shop" },
      { url: "directory.com › coffee", title: "Top 10 Coffee Shops (2026)" },
    ],
  },
  ads: {
    eyebrow: "How we do it",
    heading: "Four stories to growth",
    text: "",
    stories: [
      { headline: "Glow in 7 days", cta: "Shop now", alt: "Skincare story ad: “Radiance that feels alive” with a glowing portrait" },
      { headline: "Your 5th sip is on us", cta: "Claim offer", alt: "Fifth Sip coffee story ad with branded cups, bag and menus" },
      { headline: "Bold flavor. New drop.", cta: "Order now", alt: "Colourful drinks brand story ad announcing a new flavour drop" },
      { headline: "2 & 3 BHK from 49L", cta: "Book a visit", alt: "Real-estate story ad for 2 and 3 BHK apartments" },
    ],
  },
};

export type DmCopy = typeof DM_COPY;

/**
 * The design's copy with the CMS's edits laid over it: text fields that are
 * empty in the CMS keep the design's value; lists keep the design's length.
 * Each section's `text` is the description under its visual (shown when it has words).
 */
function overlay<T>(base: T, edit: unknown): T {
  if (Array.isArray(base)) {
    const list = Array.isArray(edit) ? edit : [];
    return base.map((item, i) => overlay(item, list[i])) as T;
  }
  if (base && typeof base === "object") {
    const obj = edit && typeof edit === "object" && !Array.isArray(edit) ? (edit as Record<string, unknown>) : {};
    return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, overlay(v, obj[k])])) as T;
  }
  if (typeof base === "string") return (typeof edit === "string" && edit.trim() ? edit.trim() : base) as T;
  return base;
}

export function dmCopy(service: ServiceDetail): DmCopy {
  // The growth engine has its own field (service.engine); the other sections live in service.copy.
  return overlay(DM_COPY, { ...(service.copy ?? {}), engine: service.engine ?? {} });
}
