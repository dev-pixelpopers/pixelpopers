import Image from "@/components/inner/services/ServiceImage";
import type { StackKeyTone, StackSection } from "@/lib/service-content";
import type { ReactNode } from "react";
import { mono } from "@/lib/inner-fonts";
import { WEB_COPY, type WebCopy } from "./copy";

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

const K = "text-blush-ink";
const W = "text-white";
const S = "text-sunbeam";
const T = "text-lagoon";
const P = "text-[#8c7a99]";
const A = "text-lav";

/** The editor's code; the title, vibe and closing comment are the page copy's words. */
const codeFor = (copy: WebCopy["hero"]): [string, string][][] => [
  [["import ", K], ["{ Hero } ", W], ["from ", K], ["'@/components'", S]],
  [["import ", K], ["{ pop } ", W], ["from ", K], ["'@pixel/popers'", S]],
  [],
  [["export default function ", K], ["Home", T], ["() {", W]],
  [["  return (", W]],
  [["    <", P], ["Hero", T]],
  [["      title", A], ["=", W], [`"${copy.codeTitle}"`, S]],
  [["      speed", A], ["={", W], ["pop.fast", T], ["}", W]],
  [["      vibe", A], ["=", W], [`"${copy.codeVibe}"`, S]],
  [["    />", P]],
  [["  )", W]],
  [["}", W]],
  [],
  [[copy.codeComment, P]],
];

export function CodeEditor({ className = "", copy = WEB_COPY.hero }: { className?: string; copy?: WebCopy["hero"] }) {
  const code = codeFor(copy);
  return (
    <div className={`@container ${className}`}>
      <div className={`${mono.className} overflow-hidden rounded-[2.56cqw] bg-code ${deepShadow}`}>
        <div className="flex h-[5.64cqw] min-h-6 items-end bg-[#2a0a33] pl-[2.31cqw]">
          <span className="flex h-full items-center">
            <Dots size="size-[max(0.375rem,1.54cqw)]" gap="gap-[1.28cqw]" />
          </span>
          <span className="ml-[2.05cqw] flex gap-[1.28cqw] text-[max(0.5rem,1.79cqw)]">
            <span className="flex h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] bg-code px-[1.79cqw] text-white/90">{copy.tabs[0].name}</span>
            <span className="flex h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] px-[1.79cqw] text-white/45">{copy.tabs[1].name}</span>
            <span className="hidden h-[4.87cqw] w-[17.95cqw] items-center rounded-t-[1.03cqw] px-[1.79cqw] whitespace-nowrap text-white/45 sm:flex">{copy.tabs[2].name}</span>
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

export function BrowserPreview({ className = "", priority = false, copy = WEB_COPY.hero }: { className?: string; priority?: boolean; copy?: WebCopy["hero"] }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`overflow-hidden rounded-[3.23cqw] bg-white ${deepShadow}`}>
        <div className="flex h-[7.1cqw] min-h-6 items-center bg-[#f3e6ee] px-[2.9cqw]">
          <Dots size="size-[max(0.375rem,1.94cqw)]" gap="gap-[1.61cqw]" />
          <span className="ml-[7.42cqw] flex h-[4.19cqw] min-h-4 w-[61.3cqw] items-center rounded-full bg-white px-[2.58cqw] font-copy text-[max(0.5625rem,2.26cqw)] font-medium text-ink/60">
            {copy.url}
          </span>
        </div>
        <Image
          natural
          slot="hero-browser"
          src="/assets/inner/elevate.webp"
          alt={copy.browserAlt}
          width={1600}
          height={951}
          sizes="(min-width: 1024px) 33vw, 85vw"
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
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

type StackKey = NonNullable<StackSection["keys"]>[number];

/** The keys shown until the CMS has its own list (Services → Web development → Stack). */
export const defaultStackKeys: StackKey[] = [
  { label: "Next.js", tone: "white" },
  { label: "React", tone: "lagoon" },
  { label: "TypeScript", tone: "grape" },
  { label: "Tailwind", tone: "lagoon" },
  { label: "Webflow", tone: "blush", pressed: true },
  { label: "Shopify", tone: "sunbeam" },
  { label: "WordPress", tone: "grape" },
  { label: "Node.js", tone: "white" },
  { label: "Sanity", tone: "blush" },
  { label: "Vercel", tone: "white" },
  { label: "Figma", tone: "sunbeam" },
  { label: "GSAP", tone: "lagoon" },
];

const keyTone: Record<StackKeyTone, string> = {
  white: "bg-white text-ink",
  lagoon: "bg-lagoon text-ink",
  grape: "bg-grape text-white",
  blush: "bg-blush text-white",
  sunbeam: "bg-sunbeam text-ink",
};

export function Keyboard({ className = "", keys = defaultStackKeys, label = WEB_COPY.stack.keyboardLabel }: { className?: string; keys?: StackKey[]; label?: string }) {
  return (
    <div className={`@container ${className}`}>
      <ul data-keys aria-label={label} className="grid grid-cols-3 gap-x-[2.5cqw] gap-y-[2.9cqw] rounded-[4cqw] bg-ink p-[4cqw] shadow-[0_24px_60px_rgb(34_1_40/0.18)] sm:grid-cols-4">
        {keys.map((k, i) => (
          <li
            key={`${k.label}-${i}`}
            data-key
            className={`flex aspect-[210/136] flex-col justify-between rounded-[2.2cqw] pt-[1.4cqw] pr-[2.9cqw] pb-[2.7cqw] pl-[1.8cqw] transition-[translate,box-shadow] duration-150 ${keyTone[k.tone ?? "white"] ?? keyTone.white} ${
              k.pressed ? "translate-y-[0.8cqw] shadow-[0_0.2cqw_0_#14031b]" : "shadow-[0_1.4cqw_0_#14031b] hover:translate-y-[0.8cqw] hover:shadow-[0_0.6cqw_0_#14031b]"
            } ${i >= 4 && i < 8 ? "sm:translate-x-[3cqw]" : ""}`}
          >
            <span className="flex items-start justify-between">
              {k.icon ? (
                <Image src={k.icon} alt={`${k.label} logo`} width={64} height={64} sizes="48px" className="mt-[0.4cqw] size-[max(1rem,3.4cqw)] object-contain" />
              ) : (
                <span />
              )}
              <span aria-hidden className="font-copy text-[max(0.5625rem,1.5cqw)] leading-none font-bold opacity-40">
                {String.fromCharCode(65 + (i % 26))}
              </span>
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

export function Devices({ className = "", copy = WEB_COPY.devices }: { className?: string; copy?: WebCopy["devices"] }) {
  return (
    <figure className={`@container grid aspect-[1430/800] ${className}`}>
      {/* Laptop + stand. An uploaded screenshot sets the screen's shape, so the stand follows the screen. */}
      <div className={`${at} mt-[2.1%] flex w-[69.93%] flex-col items-center`}>
        <div className={`w-full rounded-[1.96cqw] bg-ink p-[1.26cqw] ${deviceShadow}`}>
          <Image
            natural
            slot="devices-laptop"
            src="/assets/inner/elevate.webp"
            alt={copy.laptopAlt}
            width={1600}
            height={951}
            sizes="(min-width: 1024px) 50vw, 65vw"
            className="aspect-[964/584] w-full rounded-[0.98cqw] object-cover"
          />
        </div>
        <span aria-hidden className="aspect-[200/60] w-[20%] rounded-[0.42cqw] bg-ink" />
        <span aria-hidden className="-mt-[0.2%] aspect-[400/16] w-[40%] rounded-[0.56cqw] bg-ink" />
      </div>
      <div className={`${at} mt-[16.08%] ml-[61.54%] w-[26.57%] rounded-[2.52cqw] bg-ink p-[0.98cqw] ${deviceShadow}`}>
        <Image
          natural
          slot="devices-tablet"
          src="/assets/inner/liquidity.webp"
          alt={copy.tabletAlt}
          width={736}
          height={552}
          sizes="(min-width: 1024px) 18vw, 25vw"
          className="aspect-[352/492] w-full rounded-[1.68cqw] object-cover"
        />
      </div>
      <div className={`${at} mt-[23.08%] ml-[83.92%] w-[16.08%] rounded-[2.52cqw] bg-ink p-[0.7cqw] ${deviceShadow}`}>
        <Image
          natural
          slot="devices-phone"
          src="/assets/inner/ui-shop.webp"
          alt={copy.phoneAlt}
          width={1600}
          height={900}
          sizes="(min-width: 1024px) 11vw, 16vw"
          className="aspect-[210/450] w-full rounded-[1.96cqw] object-cover"
        />
      </div>
      <SizeTag className="ml-[4.2%] bg-lagoon text-white">{copy.sizes[0].label}</SizeTag>
      <SizeTag className="mt-[13.99%] ml-[64.34%] bg-sunbeam text-ink">{copy.sizes[1].label}</SizeTag>
      <SizeTag className="mt-[20.98%] ml-[86.71%] bg-blush text-white">{copy.sizes[2].label}</SizeTag>
      <figcaption className="sr-only">{copy.caption}</figcaption>
    </figure>
  );
}

/* ── Deploy terminal (1000 × 520) ─────────────────────────────────────── */

/** Terminal line colours by position; the lines themselves are the page copy's. */
const termTones = ["text-white", "text-lav", green, green, green, "text-sunbeam", "text-lagoon"];

export function Terminal({ className = "", copy = WEB_COPY.ship }: { className?: string; copy?: WebCopy["ship"] }) {
  return (
    <figure className={`@container ${className}`}>
      <div className="overflow-hidden rounded-[2cqw] bg-code shadow-[0_24px_60px_rgb(34_1_40/0.18)]">
        <figcaption className="flex h-[4.4cqw] min-h-6 items-center bg-[#2a0a33] px-[1.8cqw]">
          <Dots size="size-[max(0.375rem,1.2cqw)]" gap="gap-[1cqw]" />
          <span className="ml-[2.2cqw] font-copy text-[max(0.625rem,1.5cqw)] font-medium text-white/55">{copy.terminalTitle}</span>
        </figcaption>
        <ol data-term className={`${mono.className} px-[3.2cqw] pt-[1.9cqw] pb-[4.1cqw] text-[max(0.5625rem,2cqw)] leading-[2.6] whitespace-pre`}>
          {copy.terminal.map((t, i) => (
            <li key={i} data-line className={termTones[i % termTones.length]}>
              {t.line}
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

const navIcons = ["📄", "📝", "🛍", "🖼", "⚙️"];

const fieldLabel = "block font-copy text-[max(0.75rem,1.01cqw)] font-bold text-ink/70";
const panelHead = "font-display text-[max(0.625rem,0.88cqw)] text-grape uppercase";

export function CmsEditor({ className = "", copy = WEB_COPY.cms }: { className?: string; copy?: WebCopy["cms"] }) {
  return (
    <figure className={`@container ${className}`}>
      <div className={`overflow-hidden rounded-[max(1rem,1.26cqw)] bg-white ${cardShadow}`}>
        <div className="flex h-[2.77cqw] min-h-7 items-center bg-[#f3e6ee] px-[1.13cqw]">
          <Dots size="size-[max(0.375rem,0.76cqw)]" gap="gap-[0.63cqw]" />
          <span className="ml-[1.39cqw] font-copy text-[max(0.6875rem,0.94cqw)] font-medium text-ink/55">{copy.url}</span>
        </div>
        <div className="font-copy text-ink lg:grid lg:grid-cols-[18.89cqw_1fr]">
          <nav aria-label="CMS sections (illustration)" className="bg-paper px-[max(0.75rem,1cqw)] py-[max(0.75rem,1.64cqw)]">
            <ul className="flex flex-wrap gap-[max(0.375rem,0.76cqw)] lg:flex-col">
              {copy.nav.map((n, i) => (
                <li
                  key={i}
                  className={`flex h-[max(2.25rem,2.77cqw)] items-center gap-[0.6em] rounded-[max(0.5rem,0.76cqw)] px-[max(0.75rem,1cqw)] text-[max(0.8125rem,1.13cqw)] ${i === 0 ? "bg-grape font-bold text-white" : "font-medium"}`}
                >
                  <span aria-hidden>{navIcons[i % navIcons.length]}</span>
                  {n.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid items-start gap-x-[3.78cqw] gap-y-6 px-[max(1rem,2.52cqw)] pt-[max(1rem,1.64cqw)] pb-[max(1.25rem,4.41cqw)] lg:grid-cols-[minmax(0,720fr)_minmax(0,420fr)] lg:pr-[3.02cqw]">
            <div>
              <p className="mt-[0.38cqw] text-[max(0.75rem,1.01cqw)] font-medium whitespace-pre text-ink/50">{copy.breadcrumb}</p>
              <span className={`mt-[1.7cqw] ${fieldLabel}`}>{copy.headlineLabel}</span>
              <span className="mt-[0.57cqw] flex h-[max(2.75rem,3.78cqw)] items-center rounded-[max(0.625rem,0.88cqw)] border-2 border-lagoon px-[max(0.875rem,1.39cqw)] text-[max(0.875rem,1.26cqw)] font-medium">
                <span data-type-field className="whitespace-nowrap">
                  {copy.headline}
                </span>
                <span data-blink aria-hidden className="ml-px font-light">
                  |
                </span>
              </span>
              <span className={`mt-[1.51cqw] ${fieldLabel}`}>{copy.subheadingLabel}</span>
              <span className="mt-[0.57cqw] block min-h-[max(4.5rem,6.93cqw)] rounded-[max(0.625rem,0.88cqw)] border border-[#d9d2dc] px-[max(0.875rem,1.39cqw)] pt-[max(0.75rem,1.13cqw)] text-[max(0.8125rem,1.13cqw)] leading-[1.56]">
                {copy.subheading}
              </span>
              <span className={`mt-[1.51cqw] ${fieldLabel}`}>{copy.imageLabel}</span>
              <span className="mt-[0.57cqw] grid grid-cols-[340fr_360fr] gap-[1.26cqw]">
                <Image
                  slot="cms-preview"
                  src="/assets/inner/elevate.webp"
                  alt={copy.imageAlt}
                  width={1600}
                  height={951}
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  className="aspect-[340/200] w-full rounded-[max(0.625rem,0.88cqw)] object-cover"
                />
                <span className="grid place-items-center rounded-[max(0.625rem,0.88cqw)] border border-dashed border-grape/40 px-2 text-center text-[max(0.75rem,1.07cqw)] font-medium text-grape">
                  {copy.dropLabel}
                </span>
              </span>
            </div>

            <div className="rounded-[max(0.875rem,1.26cqw)] bg-paper px-[max(1rem,1.76cqw)] pt-[max(1rem,1.76cqw)] pb-[max(1rem,1.89cqw)]">
              <p className={panelHead}>{copy.statusLabel}</p>
              <p className="mt-[1.01cqw] flex items-center gap-[1.01cqw] text-[max(0.8125rem,1.13cqw)] font-bold">
                <span aria-hidden className="flex h-[max(1.5rem,2.52cqw)] w-[max(2.75rem,4.53cqw)] justify-end rounded-full bg-[#2ec27e] p-[max(0.1875rem,0.25cqw)]">
                  <span className="aspect-square h-full rounded-full bg-white" />
                </span>
                {copy.status}
              </p>
              <p className={`mt-[2.39cqw] ${panelHead}`}>{copy.scheduleLabel}</p>
              <p className="mt-[0.76cqw] flex h-[max(2.5rem,3.27cqw)] items-center rounded-[max(0.5rem,0.76cqw)] bg-white px-[max(0.75rem,1.13cqw)] text-[max(0.8125rem,1.07cqw)] font-medium">
                {copy.schedule}
              </p>
              <p className={`mt-[1.76cqw] ${panelHead}`}>{copy.seoLabel}</p>
              <p className="mt-[0.88cqw] text-[max(0.6875rem,0.88cqw)] text-ink/60">{copy.seoUrl}</p>
              <p className="mt-[0.44cqw] text-[max(0.8125rem,1.07cqw)] font-bold text-grape">{copy.seoTitle}</p>
              <p className="mt-[1.89cqw] text-[max(0.75rem,0.94cqw)] leading-[1.47] text-ink/70">{copy.subheading}</p>
              <span className="mt-[4.66cqw] flex h-[max(2.75rem,3.78cqw)] items-center justify-center rounded-full bg-blush font-display text-[max(0.75rem,1.01cqw)] text-white uppercase">
                {copy.button}
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{copy.caption}</figcaption>
    </figure>
  );
}

/* ── Launch checklist (760 × 700) + Ready sticker ─────────────────────── */

export function Checklist({ className = "", copy = WEB_COPY.launch }: { className?: string; copy?: WebCopy["launch"] }) {
  const checks = copy.checks.map((c) => c.label);
  return (
    <div className={`@container ${className}`}>
      <div className={`rounded-[4.21cqw] bg-white px-[5.26cqw] pt-[4.74cqw] pb-[7.5cqw] ${cardShadow}`}>
        <p className="font-display text-[max(0.875rem,3.16cqw)] text-grape uppercase">{copy.checklistTitle}</p>
        <ul data-checks className="mt-[3.82cqw] font-copy text-[max(0.8125rem,2.76cqw)] font-medium text-ink">
          {[...checks, null].map((c, i) => (
            <li key={i} className={`flex items-center gap-[2.63cqw] border-b border-ink/6 pb-[2.1cqw] ${i ? "pt-[1.84cqw]" : ""} ${c ? "" : "text-ink/50"}`}>
              {c ? (
                <span data-tick aria-hidden className="grid size-[max(1.5rem,5.26cqw)] shrink-0 place-items-center rounded-[1.58cqw] bg-[#2ec27e] text-[max(0.8125rem,2.63cqw)] font-bold text-white">
                  ✓
                </span>
              ) : (
                <span aria-hidden className="size-[max(1.5rem,5.26cqw)] shrink-0 rounded-[1.58cqw] bg-[#e8e3ea]" />
              )}
              {c ? (
                <>
                  <span className="sr-only">{copy.doneLabel} </span>
                  {c}
                </>
              ) : (
                <>
                  <span className="sr-only">{copy.todoLabel} </span>
                  {copy.pending}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
