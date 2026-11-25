import { overlayCopy } from "@/components/inner/service/page-copy";
import type { ServiceDetail } from "@/lib/service-content";

/*
  Every word on the Web Development page's design sections, editable in the
  CMS (Services → Web Development → Page sections; the admin form is built
  from these keys in backend/app/Filament/Support/WebDevelopmentSections.php).
  Empty fields keep the wording here. The "The stack" keyboard and the
  "One site. Every screen." heading keep their own tabs (Stack, Screens);
  screenshots are on the Images tab.
*/

export const WEB_COPY = {
  hero: {
    command: "$ npx create-pop-app",
    toast: "✓ Compiled in 1.2s",
    sticker: "⚡ 98 PERFORMANCE",
    tabs: [{ name: "page.tsx" }, { name: "hero.tsx" }, { name: "pop.config.ts" }],
    codeTitle: "We make your website poppin’",
    codeVibe: "funky",
    codeComment: "// lighthouse: 98 · a11y: 100 · seo: 100 ✨",
    url: "🔒 yourbrand.com",
    browserAlt: "The Elevate website — “Drop your design” — on a laptop and phone",
    description: "A code editor writing the Pixel Popers hero component next to a browser preview of the finished site",
  },
  scores: {
    eyebrow: "Speed is a feature",
    heading: "Scores we build for",
    text: "",
    gauges: [
      { score: "98", label: "Performance" },
      { score: "100", label: "Accessibility" },
      { score: "100", label: "Best practices" },
      { score: "100", label: "SEO" },
    ],
    note: "Measured with Lighthouse on every release — not just launch day.",
  },
  stack: {
    keyboardLabel: "Our tech stack",
  },
  devices: {
    laptopAlt: "Elevate website at desktop width",
    tabletAlt: "Liquidity landing page at tablet width",
    phoneAlt: "Online shop design at phone width",
    sizes: [{ label: "1440px" }, { label: "768px" }, { label: "390px" }],
    caption: "The same website shown on a 1440px desktop, a 768px tablet and a 390px phone.",
  },
  ship: {
    eyebrow: "Ship it",
    heading: "Push to\nproduction\nin minutes",
    text: "",
    pipeline: [{ step: "Commit" }, { step: "Build" }, { step: "Test" }, { step: "Deploy" }],
    terminalTitle: "zsh — deploy",
    terminal: [
      { line: "$ git push origin main" },
      { line: "→ Building yourbrand.com…" },
      { line: "✓ 214 modules compiled in 41s" },
      { line: "✓ 0 errors · 0 warnings" },
      { line: "✓ Lighthouse: 98 / 100 / 100 / 100" },
      { line: "✓ Deployed to production 🚀" },
      { line: "→ https://yourbrand.com" },
    ],
  },
  cms: {
    eyebrow: "Edit it yourself",
    heading: "A CMS your team will actually use",
    text: "",
    url: "yourbrand.com / admin",
    nav: [{ label: "Pages" }, { label: "Blog posts" }, { label: "Products" }, { label: "Media" }, { label: "Settings" }],
    breadcrumb: "Home  ›  Hero section",
    headlineLabel: "Headline",
    headline: "We make your website poppin’",
    subheadingLabel: "Subheading",
    subheading: "A funky creative studio making brands impossible to scroll past.",
    imageLabel: "Hero image",
    imageAlt: "Current hero image: the Elevate website on a laptop",
    dropLabel: "＋ Drop a new image",
    statusLabel: "Status",
    status: "Published",
    scheduleLabel: "Schedule",
    schedule: "Mon, 12 Oct · 09:00",
    seoLabel: "SEO preview",
    seoUrl: "yourbrand.com",
    seoTitle: "We make your website poppin’ | Pixel Popers",
    button: "Publish changes",
    caption: "A headless CMS editing screen: page list, headline and subheading fields, hero image and a publish panel with SEO preview.",
  },
  launch: {
    heading: "Nothing\nleft to\nchance",
    text: "Every launch runs through the same 40-point checklist — security, SEO, speed, accessibility and tracking — so day one is a celebration, not a fire drill.",
    note: "+ 3 months of free care after launch",
    sticker: "Ready\nto\nship",
    checklistTitle: "Launch checklist",
    checks: [
      { label: "SSL & security headers" },
      { label: "SEO meta + sitemap" },
      { label: "Analytics & conversion tracking" },
      { label: "Forms tested end-to-end" },
      { label: "301 redirects from old site" },
      { label: "Speed score above 90" },
      { label: "Accessibility (WCAG AA)" },
    ],
    pending: "Backups & uptime monitoring",
    doneLabel: "Done:",
    todoLabel: "Still to do:",
  },
};

export type WebCopy = typeof WEB_COPY;

export function webCopy(service: ServiceDetail): WebCopy {
  return overlayCopy(WEB_COPY, service.copy ?? {});
}
