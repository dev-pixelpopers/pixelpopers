import ServiceImage from "@/components/inner/services/ServiceImage";
import { AppGlyph } from "./AppGlyph";
import { MOBILE_COPY, type MobileCopy } from "./copy";

/*
  UI mock-ups for the mobile app page. Like the other service pages, every
  mock-up is its own `@container` and sizes inside are `cqw` of it, with
  `max()` floors so the type stays legible when the mock-up shrinks.
*/

export const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";

/* ── Phone running the "Fifth Sip" ordering app ─────────────────────── */

export function AppPhone({
  copy = MOBILE_COPY.hero.phone,
  className = "",
  priority = false,
}: {
  copy?: MobileCopy["hero"]["phone"];
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`@container ${className}`}>
      <div className={`rounded-[14cqw] bg-ink p-[3.2cqw] ${cardShadow}`}>
        <div className="relative flex aspect-[360/740] flex-col overflow-hidden rounded-[11cqw] bg-cream">
          {/* Status bar + dynamic island */}
          <div aria-hidden className="flex items-center justify-between px-[8cqw] pt-[4.5cqw] font-copy text-[max(0.5625rem,3.6cqw)] font-bold text-ink">
            <span>{copy.time}</span>
            <span className="h-[6.4cqw] w-[26cqw] rounded-full bg-ink" />
            <span className="tracking-[0.1em]">●●●</span>
          </div>

          <div className="px-[6.5cqw] pt-[5cqw]">
            <p className="font-copy text-[max(0.625rem,3.9cqw)] font-medium text-ink/60">{copy.greeting}</p>
            <div className="mt-[1cqw] flex items-center justify-between gap-[2cqw]">
              <p className="font-display text-[max(0.9375rem,7.2cqw)] leading-none text-grape uppercase">{copy.app}</p>
              <span className="rounded-full bg-sunbeam px-[3cqw] py-[1.4cqw] font-copy text-[max(0.5rem,3.2cqw)] font-bold whitespace-nowrap text-ink">
                {copy.points}
              </span>
            </div>
          </div>

          <div className="mx-[6.5cqw] mt-[5cqw] overflow-hidden rounded-[6cqw] bg-white shadow-[0_10px_24px_rgb(34_1_40/0.12)]">
            <ServiceImage
              src="/assets/inner/fifth-sip.webp"
              slot="app-screen"
              alt={copy.imageAlt}
              width={857}
              height={1200}
              priority={priority}
              sizes="(min-width: 1024px) 22vw, 60vw"
              className="aspect-[4/3.4] w-full object-cover"
            />
            <div className="flex items-center justify-between gap-[2cqw] px-[4.5cqw] py-[3.5cqw]">
              <p className="font-copy text-[max(0.625rem,4.2cqw)] leading-tight font-extrabold text-ink">{copy.item}</p>
              <p className="font-copy text-[max(0.625rem,4.2cqw)] font-extrabold text-blush-ink">{copy.price}</p>
            </div>
          </div>

          <span className="mx-[6.5cqw] mt-[5cqw] grid h-[12cqw] place-items-center rounded-full bg-blush font-display text-[max(0.625rem,4cqw)] text-white uppercase">
            {copy.button}
          </span>

          {/* Tab bar */}
          <ul className="mt-auto grid grid-cols-4 border-t border-ink/8 bg-white px-[3cqw] pt-[3.5cqw] pb-[6cqw]">
            {copy.tabs.map((t, i) => (
              <li key={i} className={`flex flex-col items-center gap-[1.4cqw] font-copy text-[max(0.5rem,3cqw)] font-bold ${i === 0 ? "text-grape" : "text-ink/40"}`}>
                <span aria-hidden className={`size-[5.5cqw] rounded-[1.8cqw] ${i === 0 ? "bg-grape" : "bg-ink/15"}`} />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Lock-screen style notification ─────────────────────────────────── */

const appTile = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"] as const;

export function Notification({
  app,
  title,
  body,
  index = 0,
  time = MOBILE_COPY.hero.notificationTime,
  className = "",
  as: Tag = "div",
}: {
  time?: string;
  app: string;
  title: string;
  body: string;
  index?: number;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <Tag className={`@container ${className}`}>
      <div className="flex items-start gap-[max(0.75rem,4cqw)] rounded-[max(1rem,7cqw)] bg-white/90 p-[max(0.875rem,5cqw)] shadow-[0_14px_34px_rgb(34_1_40/0.16)] backdrop-blur-md">
        <span aria-hidden className={`grid aspect-square w-[max(2.25rem,13cqw)] shrink-0 place-items-center rounded-[max(0.6rem,3.6cqw)] font-display text-[max(1rem,6cqw)] leading-none text-white uppercase ${appTile[index % appTile.length]}`}>
          {app.charAt(0)}
        </span>
        <span className="min-w-0 grow font-copy">
          <span className="flex items-baseline justify-between gap-2 text-[max(0.6875rem,3.6cqw)] font-bold text-ink/50 uppercase">
            <span className="truncate">{app}</span>
            <span className="shrink-0 font-medium normal-case">{time}</span>
          </span>
          <span className="mt-[0.2em] block text-[max(0.875rem,4.8cqw)] leading-tight font-extrabold text-ink">{title}</span>
          <span className="mt-[0.25em] block text-[max(0.8125rem,4.2cqw)] leading-[1.45] text-ink/75">{body}</span>
        </span>
      </div>
    </Tag>
  );
}

/* ── Home-screen app icon ───────────────────────────────────────────── */

const iconTone = [
  "bg-blush text-white",
  "bg-grape text-white",
  "bg-lagoon text-white",
  "bg-sunbeam text-ink",
  "bg-lav text-ink",
  "bg-ink text-sunbeam",
] as const;

/** One feature as a home-screen app: an SVG glyph (by name, see AppGlyph) on a glossy coloured tile. */
export function AppIcon({ icon, name, index }: { icon: string; name: string; index: number }) {
  return (
    <li className="flex flex-col items-center gap-[clamp(0.5rem,0.73vw,0.875rem)] text-center">
      <span
        aria-hidden
        className={`relative grid aspect-square w-full max-w-[7.5rem] place-items-center overflow-hidden rounded-[24%] shadow-[0_12px_26px_rgb(34_1_40/0.16)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-4deg] ${iconTone[index % iconTone.length]}`}
      >
        {/* Gloss: a soft light from the top-left, like a real app icon. */}
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgb(255_255_255/0.35),transparent_55%)]" />
        <AppGlyph name={icon} className="relative w-[46%]" />
      </span>
      <span className="font-copy text-[clamp(0.75rem,0.83vw,1rem)] leading-tight font-bold text-ink">{name}</span>
    </li>
  );
}
