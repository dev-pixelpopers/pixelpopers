import Image from "next/image";
import type { ReactNode } from "react";
import { mono } from "@/lib/inner-fonts";

/*
  UI mock-ups for the code + browser page (Figma 374:21). Each mock-up is an
  outer `@container` (sizing / position / tilt only) around an inner box that
  carries the visuals, so every `cqw` inside measures that mock-up. Values are
  px ÷ mock-up width × 100 off the 1920 Figma frame, with `max()` floors so
  the type stays legible on phones.
*/

export const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";
const deepShadow = "shadow-[0_30px_70px_rgb(0_0_0/0.35)]";
const green = "text-[#2ec27e]";

function Dots({ size, gap }: { size: string; gap: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 ${gap}`}>
      <span className={`${size} rounded-full bg-blush`} />
      <span className={`${size} rounded-full bg-sunbeam`} />
      <span className={`${size} rounded-full bg-lagoon`} />
    </span>
  );
}

/* ── Code editor (780 × 600) ──────────────────────────────────────────── */

const K = "text-blush";
const W = "text-white";
const S = "text-sunbeam";
const T = "text-lagoon";
const P = "text-[#8c7a99]";
const A = "text-lav";

const code: [string, string][][] = [
  [["import ", K], ["{ Hero } ", W], ["from ", K], ["'@/components'", S]],
  [["import ", K], ["{ pop } ", W], ["from ", K], ["'@pixel/popers'", S]],
  [],
  [["export default function ", K], ["Home", T], ["() {", W]],
  [["  return (", W]],
  [["    <", P], ["Hero", T]],
  [["      title", A], ["=", W], ["\"We make your website poppin’\"", S]],
  [["      speed", A], ["={", W], ["pop.fast", T], ["}", W]],
  [["      vibe", A], ["=", W], ["\"funky\"", S]],
  [["    />", P]],
  [["  )", W]],
  [["}", W]],
  [],
  [["// lighthouse: 98 · a11y: 100 · seo: 100 ✨", P]],
];

export function CodeEditor({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`${mono.className} overflow-hidden rounded-[2.56cqw] bg-code ${deepShadow}`}>
        <div className="flex h-[5.64cqw] min-h-6 items-end bg-[#2a0a33] pl-[2.31cqw]">
          <span className="flex h-full items-center">
            <Dots size="size-[max(0.375rem,1.54cqw)]" gap="gap-[1.28cqw]" />
          </span>
          <span className="ml-[2.05cqw] flex gap-[1.28cqw] text-[max(0.5rem,1.79cqw)]">
            <span className="flex h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] bg-code px-[1.79cqw] text-white/90">page.tsx</span>
            <span className="flex h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] px-[1.79cqw] text-white/45">hero.tsx</span>
            <span className="hidden h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] px-[1.79cqw] whitespace-nowrap text-white/45 sm:flex">pop.config.ts</span>
          </span>
        </div>
        <ol
          data-typing
          className="bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_7.18cqw,transparent_7.18cqw)] pt-[1.67cqw] pb-[5cqw] text-[max(0.5625rem,2.18cqw)] leading-[2.12] whitespace-pre"
        >
          {code.map((line, i) => (
            <li key={i} className="grid grid-cols-[7.18cqw_1fr]">
              <span className="pr-[1.54cqw] text-right text-[max(0.5rem,1.92cqw)] text-white/30">{i + 1}</span>
              <span className={`flex items-center pl-[2.56cqw] ${i === 7 ? "bg-white/5" : ""}`}>
                {line.length ? (
                  <span data-line>
                    {line.map(([t, c], j) => (
                      <span key={j} className={c}>
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
                {i === 8 ? <span data-blink className="ml-[0.51cqw] inline-block h-[2.82cqw] w-[1.28cqw] bg-sunbeam" /> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Browser preview (620 × 430) ──────────────────────────────────────── */

export function BrowserPreview({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`overflow-hidden rounded-[3.23cqw] bg-white ${deepShadow}`}>
        <div className="flex h-[7.1cqw] min-h-6 items-center bg-[#f3e6ee] px-[2.9cqw]">
          <Dots size="size-[max(0.375rem,1.94cqw)]" gap="gap-[1.61cqw]" />
          <span className="ml-[7.42cqw] flex h-[4.19cqw] min-h-4 w-[61.3cqw] items-center rounded-full bg-white px-[2.58cqw] font-copy text-[max(0.5625rem,2.26cqw)] font-medium text-ink/60">
            🔒 yourbrand.com
          </span>
        </div>
        <Image
          src="/assets/inner/elevate.webp"
          alt="The Elevate website — “Drop your design” — on a laptop and phone"
          width={1600}
          height={951}
          sizes="(min-width: 1024px) 33vw, 85vw"
          priority={priority}
          className="aspect-[620/386] w-full object-cover"
        />
      </div>
    </div>
  );
}

/* ── Lighthouse gauge (340 × 380) ─────────────────────────────────────── */

const R = 109.2;
const C = 2 * Math.PI * R;

export function Gauge({ score, label, color, numberTone }: { score: number; label: string; color: string; numberTone: string }) {
  return (
    <figure data-gauge className="@container">
      <div className="flex flex-col items-center rounded-[9.41cqw] bg-white pt-[11.76cqw] pb-[13.8cqw] shadow-[0_20px_50px_rgb(34_1_40/0.12)]">
        <div className="grid w-[70.59%]">
          <svg viewBox="0 0 240 240" aria-hidden className="col-start-1 row-start-1 h-auto w-full">
            <circle cx="120" cy="120" r={R} fill="none" stroke={color} strokeOpacity="0.15" strokeWidth="21.6" />
            <circle
              data-arc
              cx="120"
              cy="120"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="21.6"
              strokeDasharray={`${((C * score) / 100).toFixed(1)} ${C.toFixed(1)}`}
              transform="rotate(-90 120 120)"
            />
          </svg>
          <span data-count className={`col-start-1 row-start-1 place-self-center font-pop text-[28.24cqw] leading-[1.146] ${numberTone}`}>
            {score}
          </span>
        </div>
        <figcaption className="mt-[8.82cqw] font-display text-[max(0.6875rem,5.29cqw)] text-ink uppercase">{label}</figcaption>
      </div>
    </figure>
  );
}

/* ── Tech-stack keyboard (1000 × 560) ─────────────────────────────────── */

const keys = [
  { label: "Next.js", bg: "bg-white text-ink" },
  { label: "React", bg: "bg-lagoon text-ink" },
  { label: "TypeScript", bg: "bg-grape text-white" },
  { label: "Tailwind", bg: "bg-lagoon text-ink" },
  { label: "Webflow", bg: "bg-blush text-white", pressed: true },
  { label: "Shopify", bg: "bg-sunbeam text-ink" },
  { label: "WordPress", bg: "bg-grape text-white" },
  { label: "Node.js", bg: "bg-white text-ink" },
  { label: "Sanity", bg: "bg-blush text-white" },
  { label: "Vercel", bg: "bg-white text-ink" },
  { label: "Figma", bg: "bg-sunbeam text-ink" },
  { label: "GSAP", bg: "bg-lagoon text-ink" },
];

export function Keyboard({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <ul data-keys aria-label="Our tech stack" className="grid grid-cols-3 gap-x-[2.5cqw] gap-y-[2.9cqw] rounded-[4cqw] bg-ink p-[4cqw] shadow-[0_24px_60px_rgb(34_1_40/0.18)] sm:grid-cols-4">
        {keys.map((k, i) => (
          <li
            key={k.label}
            data-key
            className={`flex aspect-[210/136] flex-col justify-between rounded-[2.2cqw] pt-[1.4cqw] pr-[2.9cqw] pb-[2.7cqw] pl-[1.8cqw] transition-[translate,box-shadow] duration-150 ${k.bg} ${
              k.pressed ? "translate-y-[0.8cqw] shadow-[0_0.2cqw_0_#14031b]" : "shadow-[0_1.4cqw_0_#14031b] hover:translate-y-[0.8cqw] hover:shadow-[0_0.6cqw_0_#14031b]"
            } ${i >= 4 && i < 8 ? "sm:translate-x-[3cqw]" : ""}`}
          >
            <span aria-hidden className="self-end font-copy text-[max(0.5625rem,1.5cqw)] leading-none font-bold opacity-40">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="font-display text-[max(0.6875rem,2cqw)] leading-none">{k.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Devices collage (1430 × 800) ─────────────────────────────────────── */

const at = "col-start-1 row-start-1 self-start justify-self-start";
const deviceShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.18)]";

function SizeTag({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`${at} flex h-[2.38cqw] min-h-4 min-w-[6.29cqw] items-center justify-center rounded-full px-[0.6em] font-copy text-[max(0.5rem,1.05cqw)] font-bold ${className}`}>
      {children}
    </span>
  );
}

export function Devices({ className = "" }: { className?: string }) {
  return (
    <figure className={`@container grid aspect-[1430/800] ${className}`}>
      <div className={`${at} mt-[2.1%] w-[69.93%] rounded-[1.96cqw] bg-ink p-[1.26cqw] ${deviceShadow}`}>
        <Image
          src="/assets/inner/elevate.webp"
          alt="Elevate website at desktop width"
          width={1600}
          height={951}
          sizes="(min-width: 1024px) 50vw, 65vw"
          className="aspect-[964/584] w-full rounded-[0.98cqw] object-cover"
        />
      </div>
      <span aria-hidden className={`${at} mt-[45.45%] ml-[27.97%] aspect-[200/60] w-[13.99%] rounded-[0.42cqw] bg-ink`} />
      <span aria-hidden className={`${at} mt-[49.51%] ml-[20.98%] aspect-[400/16] w-[27.97%] rounded-[0.56cqw] bg-ink`} />
      <div className={`${at} mt-[16.08%] ml-[61.54%] w-[26.57%] rounded-[2.52cqw] bg-ink p-[0.98cqw] ${deviceShadow}`}>
        <Image
          src="/assets/inner/liquidity.webp"
          alt="Liquidity landing page at tablet width"
          width={736}
          height={552}
          sizes="(min-width: 1024px) 18vw, 25vw"
          className="aspect-[352/492] w-full rounded-[1.68cqw] object-cover"
        />
      </div>
      <div className={`${at} mt-[23.08%] ml-[83.92%] w-[16.08%] rounded-[2.52cqw] bg-ink p-[0.7cqw] ${deviceShadow}`}>
        <Image
          src="/assets/inner/ui-shop.webp"
          alt="Online shop design at phone width"
          width={1600}
          height={900}
          sizes="(min-width: 1024px) 11vw, 16vw"
          className="aspect-[210/450] w-full rounded-[1.96cqw] object-cover"
        />
      </div>
      <SizeTag className="ml-[4.2%] bg-lagoon text-white">1440px</SizeTag>
      <SizeTag className="mt-[13.99%] ml-[64.34%] bg-sunbeam text-ink">768px</SizeTag>
      <SizeTag className="mt-[20.98%] ml-[86.71%] bg-blush text-white">390px</SizeTag>
      <figcaption className="sr-only">The same website shown on a 1440px desktop, a 768px tablet and a 390px phone.</figcaption>
    </figure>
  );
}

/* ── Deploy terminal (1000 × 520) ─────────────────────────────────────── */

const termLines: [string, string][] = [
  ["$ git push origin main", "text-white"],
  ["→ Building yourbrand.com…", "text-lav"],
  ["✓ 214 modules compiled in 41s", green],
  ["✓ 0 errors · 0 warnings", green],
  ["✓ Lighthouse: 98 / 100 / 100 / 100", green],
  ["✓ Deployed to production 🚀", "text-sunbeam"],
  ["→ https://yourbrand.com", "text-lagoon"],
];

export function Terminal({ className = "" }: { className?: string }) {
  return (
    <figure className={`@container ${className}`}>
      <div className="overflow-hidden rounded-[2cqw] bg-code shadow-[0_24px_60px_rgb(34_1_40/0.18)]">
        <figcaption className="flex h-[4.4cqw] min-h-6 items-center bg-[#2a0a33] px-[1.8cqw]">
          <Dots size="size-[max(0.375rem,1.2cqw)]" gap="gap-[1cqw]" />
          <span className="ml-[2.2cqw] font-copy text-[max(0.625rem,1.5cqw)] font-medium text-white/55">zsh — deploy</span>
        </figcaption>
        <ol data-term className={`${mono.className} px-[3.2cqw] pt-[1.9cqw] pb-[4.1cqw] text-[max(0.5625rem,2cqw)] leading-[2.6] whitespace-pre`}>
          {termLines.map(([t, c]) => (
            <li key={t} data-line className={c}>
              {t}
            </li>
          ))}
          <li data-line className="text-white">
            ${" "}
            <span data-blink aria-hidden>
              █
            </span>
          </li>
        </ol>
      </div>
    </figure>
  );
}

/* ── CMS editor (1588 × 700) ──────────────────────────────────────────── */

const nav = [
  { icon: "📄", label: "Pages", active: true },
  { icon: "📝", label: "Blog posts" },
  { icon: "🛍", label: "Products" },
  { icon: "🖼", label: "Media" },
  { icon: "⚙️", label: "Settings" },
];

const fieldLabel = "block font-copy text-[max(0.75rem,1.01cqw)] font-bold text-ink/70";
const panelHead = "font-display text-[max(0.625rem,0.88cqw)] text-grape uppercase";

export function CmsEditor({ className = "" }: { className?: string }) {
  return (
    <figure className={`@container ${className}`}>
      <div className={`overflow-hidden rounded-[max(1rem,1.26cqw)] bg-white ${cardShadow}`}>
        <div className="flex h-[2.77cqw] min-h-7 items-center bg-[#f3e6ee] px-[1.13cqw]">
          <Dots size="size-[max(0.375rem,0.76cqw)]" gap="gap-[0.63cqw]" />
          <span className="ml-[1.39cqw] font-copy text-[max(0.6875rem,0.94cqw)] font-medium text-ink/55">yourbrand.com / admin</span>
        </div>
        <div className="font-copy text-ink lg:grid lg:grid-cols-[18.89cqw_1fr]">
          <nav aria-label="CMS sections (illustration)" className="bg-paper px-[max(0.75rem,1cqw)] py-[max(0.75rem,1.64cqw)]">
            <ul className="flex flex-wrap gap-[max(0.375rem,0.76cqw)] lg:flex-col">
              {nav.map((n) => (
                <li
                  key={n.label}
                  className={`flex h-[max(2.25rem,2.77cqw)] items-center gap-[0.6em] rounded-[max(0.5rem,0.76cqw)] px-[max(0.75rem,1cqw)] text-[max(0.8125rem,1.13cqw)] ${n.active ? "bg-grape font-bold text-white" : "font-medium"}`}
                >
                  <span aria-hidden>{n.icon}</span>
                  {n.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid items-start gap-x-[3.78cqw] gap-y-6 px-[max(1rem,2.52cqw)] pt-[max(1rem,1.64cqw)] pb-[max(1.25rem,4.41cqw)] lg:grid-cols-[minmax(0,720fr)_minmax(0,420fr)] lg:pr-[3.02cqw]">
            <div>
              <p className="mt-[0.38cqw] text-[max(0.75rem,1.01cqw)] font-medium text-ink/50">Home&nbsp;&nbsp;›&nbsp;&nbsp;Hero section</p>
              <span className={`mt-[1.7cqw] ${fieldLabel}`}>Headline</span>
              <span className="mt-[0.57cqw] flex h-[max(2.75rem,3.78cqw)] items-center rounded-[max(0.625rem,0.88cqw)] border-2 border-lagoon px-[max(0.875rem,1.39cqw)] text-[max(0.875rem,1.26cqw)] font-medium">
                <span data-type-field className="whitespace-nowrap">
                  We make your website poppin’
                </span>
                <span data-blink aria-hidden className="ml-px font-light">
                  |
                </span>
              </span>
              <span className={`mt-[1.51cqw] ${fieldLabel}`}>Subheading</span>
              <span className="mt-[0.57cqw] block min-h-[max(4.5rem,6.93cqw)] rounded-[max(0.625rem,0.88cqw)] border border-[#d9d2dc] px-[max(0.875rem,1.39cqw)] pt-[max(0.75rem,1.13cqw)] text-[max(0.8125rem,1.13cqw)] leading-[1.56]">
                A funky creative studio making brands impossible to scroll past.
              </span>
              <span className={`mt-[1.51cqw] ${fieldLabel}`}>Hero image</span>
              <span className="mt-[0.57cqw] grid grid-cols-[340fr_360fr] gap-[1.26cqw]">
                <Image
                  src="/assets/inner/elevate.webp"
                  alt="Current hero image: the Elevate website on a laptop"
                  width={1600}
                  height={951}
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  className="aspect-[340/200] w-full rounded-[max(0.625rem,0.88cqw)] object-cover"
                />
                <span className="grid place-items-center rounded-[max(0.625rem,0.88cqw)] border border-dashed border-grape/40 px-2 text-center text-[max(0.75rem,1.07cqw)] font-medium text-grape">
                  ＋ Drop a new image
                </span>
              </span>
            </div>

            <div className="rounded-[max(0.875rem,1.26cqw)] bg-paper px-[max(1rem,1.76cqw)] pt-[max(1rem,1.76cqw)] pb-[max(1rem,1.89cqw)]">
              <p className={panelHead}>Status</p>
              <p className="mt-[1.01cqw] flex items-center gap-[1.01cqw] text-[max(0.8125rem,1.13cqw)] font-bold">
                <span aria-hidden className="flex h-[max(1.5rem,2.52cqw)] w-[max(2.75rem,4.53cqw)] justify-end rounded-full bg-[#2ec27e] p-[max(0.1875rem,0.25cqw)]">
                  <span className="aspect-square h-full rounded-full bg-white" />
                </span>
                Published
              </p>
              <p className={`mt-[2.39cqw] ${panelHead}`}>Schedule</p>
              <p className="mt-[0.76cqw] flex h-[max(2.5rem,3.27cqw)] items-center rounded-[max(0.5rem,0.76cqw)] bg-white px-[max(0.75rem,1.13cqw)] text-[max(0.8125rem,1.07cqw)] font-medium">
                Mon, 12 Oct · 09:00
              </p>
              <p className={`mt-[1.76cqw] ${panelHead}`}>SEO preview</p>
              <p className="mt-[0.88cqw] text-[max(0.6875rem,0.88cqw)] text-ink/60">yourbrand.com</p>
              <p className="mt-[0.44cqw] text-[max(0.8125rem,1.07cqw)] font-bold text-grape">We make your website poppin’ | Pixel Popers</p>
              <p className="mt-[1.89cqw] text-[max(0.75rem,0.94cqw)] leading-[1.47] text-ink/70">A funky creative studio making brands impossible to scroll past.</p>
              <span className="mt-[4.66cqw] flex h-[max(2.75rem,3.78cqw)] items-center justify-center rounded-full bg-blush font-display text-[max(0.75rem,1.01cqw)] text-white uppercase">
                Publish changes
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">A headless CMS editing screen: page list, headline and subheading fields, hero image and a publish panel with SEO preview.</figcaption>
    </figure>
  );
}

/* ── Launch checklist (760 × 700) + Ready sticker ─────────────────────── */

const checks = [
  "SSL & security headers",
  "SEO meta + sitemap",
  "Analytics & conversion tracking",
  "Forms tested end-to-end",
  "301 redirects from old site",
  "Speed score above 90",
  "Accessibility (WCAG AA)",
];

export function Checklist({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`rounded-[4.21cqw] bg-white px-[5.26cqw] pt-[4.74cqw] pb-[7.5cqw] ${cardShadow}`}>
        <p className="font-display text-[max(0.875rem,3.16cqw)] text-grape uppercase">Launch checklist</p>
        <ul data-checks className="mt-[3.82cqw] font-copy text-[max(0.8125rem,2.76cqw)] font-medium text-ink">
          {[...checks, null].map((c, i) => (
            <li key={c ?? "pending"} className={`flex items-center gap-[2.63cqw] border-b border-ink/6 pb-[2.1cqw] ${i ? "pt-[1.84cqw]" : ""} ${c ? "" : "text-ink/50"}`}>
              {c ? (
                <span data-tick aria-hidden className="grid size-[max(1.5rem,5.26cqw)] shrink-0 place-items-center rounded-[1.58cqw] bg-[#2ec27e] text-[max(0.8125rem,2.63cqw)] font-bold text-white">
                  ✓
                </span>
              ) : (
                <span aria-hidden className="size-[max(1.5rem,5.26cqw)] shrink-0 rounded-[1.58cqw] bg-[#e8e3ea]" />
              )}
              {c ? (
                <>
                  <span className="sr-only">Done: </span>
                  {c}
                </>
              ) : (
                <>
                  <span className="sr-only">Still to do: </span>Backups &amp; uptime monitoring
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
