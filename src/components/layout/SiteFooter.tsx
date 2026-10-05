"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";

import Link from "next/link";

import BrandLogo from "@/components/ui/BrandLogo";

type FooterLink = { label: string; href: string; pill?: string };

/** Footer destinations — the inner pages and each service page. */
const navGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Studio", href: "/about#studio" },
      { label: "Careers", href: "/about#careers", pill: "We’re hiring" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Mobile App", href: "/services/ui-ux-design" },
      { label: "Branding", href: "/services/brand-identity" },
      { label: "Social Media Marketing", href: "/services/digital-marketing" },
      { label: "Search Engine Optimization", href: "/services/content-writing" },
      { label: "Performance Optimization", href: "/services/web-development" },
    ],
  },
];

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
        <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" />
      </g>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.25" />
        <path d="M17.5 6.5v.01" />
      </g>
    ),
  },
  {
    label: "Dribbble",
    href: "#",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8.6 3.2C13 9 15.6 14.7 16.9 20.6M3.3 10.3c6.3.6 11.9-.6 16.4-4.5M5.4 18.8c3.7-4.9 9.2-6.3 15.9-4.6" />
      </g>
    ),
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Preferences", href: "#" },
];

/** Grows an underline from the left on hover/focus, in the text's own colour. */
const underline =
  "bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 ease-out hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px] motion-reduce:transition-none";

const groupHeading = "font-display text-[clamp(0.8125rem,0.85vw,1rem)] tracking-wide text-sunbeam uppercase";

/**
 * A link group that is always open on large screens and collapses into an
 * accordion on small ones. Closed panels are `invisible`, so their links leave
 * the tab order and accessibility tree instead of merely being clipped.
 */
function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-white/10 lg:border-none">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={`flex w-full items-center justify-between py-4 text-left lg:pointer-events-none lg:py-0 lg:pb-5 ${groupHeading}`}
        >
          {title}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`size-5 text-cream/60 transition-transform duration-300 lg:hidden ${open ? "rotate-45" : ""}`}
          >
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        data-open={open}
        className="invisible grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-300 ease-out data-[open=true]:visible data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none lg:visible lg:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Newsletter() {
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const inputId = useId();

  // No mailing-list backend yet: accept the address locally and confirm.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("done");
    event.currentTarget.reset();
  };

  return (
    <div className="rounded-card border border-white/10 bg-white/[0.06] p-[clamp(1.25rem,2vw,2rem)] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md">
      <h3 className="font-display text-[clamp(1.125rem,1.4vw,1.625rem)] leading-tight text-cream uppercase">
        Stay Poppin’
      </h3>
      <p className="mt-2 text-[clamp(0.875rem,0.9vw,1rem)] leading-relaxed text-cream/70">
        Fresh ideas on branding, design and growth — straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@brand.com"
          onChange={() => status === "done" && setStatus("idle")}
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-ink/40 px-5 py-3 text-cream placeholder:text-cream/40 transition-colors outline-none focus:border-sunbeam focus:ring-2 focus:ring-sunbeam/30"
        />
        <button
          type="submit"
          className="group relative isolate overflow-hidden rounded-full bg-blush px-6 py-3 font-display text-[clamp(0.75rem,0.8vw,0.9375rem)] whitespace-nowrap text-white uppercase transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-sunbeam before:transition-transform before:duration-300 before:ease-out hover:text-ink hover:before:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunbeam motion-reduce:before:transition-none"
        >
          Subscribe
        </button>
      </form>

      <p aria-live="polite" className="mt-3 text-xs leading-relaxed text-cream/50">
        {status === "done"
          ? "You’re on the list — watch your inbox for the next drop."
          : "No spam, ever. One popping email a month — unsubscribe anytime."}
      </p>
    </div>
  );
}

export default function SiteFooter() {
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="relative isolate mt-[clamp(2rem,5vw,5rem)] overflow-hidden rounded-t-[clamp(1.5rem,4vw,4rem)] bg-ink text-cream">
      {/* Soft brand glows behind the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 -left-1/4 size-[min(48rem,90vw)] rounded-full bg-grape/45 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/3 size-[min(40rem,80vw)] rounded-full bg-blush/25 blur-[120px]" />
      </div>

      <div className="shell grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-12 pt-[clamp(3.5rem,7vw,7rem)] pb-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-12">
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6 xl:col-span-4">
          <a href="#top" aria-label="Pixel Popers — back to top">
            <BrandLogo onDark className="w-[clamp(9rem,12vw,14rem)]" />
          </a>
          <p className="max-w-[24rem] text-body leading-[1.64] text-cream/70">
            A funky creative studio making brands impossible to scroll past — from strategy to
            the last pixel.
          </p>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-cream backdrop-blur-sm">
            <span aria-hidden className="relative flex size-2.5">
              <span className="absolute inline-flex size-full rounded-full bg-lagoon opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-lagoon" />
            </span>
            Available for new projects
          </span>
        </div>

        {/* ── Link groups ───────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          // Medium-large screens: brand + newsletter share the first row and the
          // links get the full width below; three columns from xl up.
          className="flex w-full justify-around lg:gap-8 xl:order-none xl:col-span-5"
        >
          {navGroups.map((group) => (
            <FooterGroup key={group.title} title={group.title}>
              <ul className="flex flex-col gap-3 pb-5 lg:pb-0">
                {group.links.map((link) => (
                  <li key={link.label} className="flex flex-wrap items-center gap-2">
                    <Link href={link.href} className={`text-cream/80 hover:text-cream ${underline}`}>
                      {link.label}
                    </Link>
                    {link.pill ? (
                      <span className="rounded-full bg-sunbeam px-2 py-0.5 text-[0.6875rem] font-bold whitespace-nowrap text-ink uppercase">
                        {link.pill}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </FooterGroup>
          ))}
        </nav>

        {/* ── Newsletter ────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 xl:col-span-3">
          <Newsletter />
        </div>
      </div>

      {/* Oversized outline wordmark, echoing the hero's giant type. */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.18em] overflow-hidden text-center font-pop text-[clamp(3rem,12.5vw,15rem)] leading-none whitespace-nowrap text-transparent uppercase select-none [-webkit-text-stroke:1px_rgb(255_229_215/0.14)]"
      >
        Pixel Popers
      </p>

      {/* ── Utility bar ─────────────────────────────────────────────────── */}
      <div className="relative border-t border-white/10 bg-ink/60 backdrop-blur-md">
        <div className="shell flex flex-col gap-5 py-6 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Pixel Popers. All rights reserved.</p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={`hover:text-cream ${underline}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={scrollToTop}
            className="group/top inline-flex items-center gap-3 self-start font-display text-xs tracking-wide text-cream uppercase md:self-auto"
          >
            Back to top
            <span className="grid size-10 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover/top:-translate-y-1 group-hover/top:border-sunbeam group-hover/top:bg-sunbeam group-hover/top:text-ink group-hover/top:shadow-[0_0_24px_rgb(245_194_85/0.5)] group-focus-visible/top:border-sunbeam motion-reduce:transition-none">
              <svg aria-hidden viewBox="0 0 24 24" className="size-4">
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
