import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import HeroSubheading from "@/components/inner/service/HeroSubheading";
import PopButton from "@/components/ui/PopButton";
import type { ServiceDetail } from "@/lib/service-content";
import AppMotion from "./AppMotion";
import { mobileCopy } from "./copy";
import { AppIcon, AppPhone, Notification, cardShadow } from "./Parts";

/*
  Concept: the page is a phone. The hero is an ordering app with push alerts
  landing around it; below, the platforms are app cards, the benefits arrive
  as notifications on a lock screen, the process is the app's version
  history, the features are a home screen of icons and the architecture is a
  stack of layers. Collages are single-cell grids on desktop (pieces share
  one cell, placed with percentage margins so the collage scales as one);
  below `lg` they stack.

  Every word comes from mobileCopy() — the design's wording with the CMS's
  edits laid over it (Services → Mobile App Development → Page sections).
*/

const lgAt = "lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-start";
const sectionGap = "mt-[clamp(4.5rem,8.85vw,10.625rem)]";
const headingGap = "mt-[clamp(2.25rem,3.65vw,4.375rem)]";

const platformLooks = [
  { card: "bg-blush text-white", chip: "bg-white/20", tilt: "rotate-[-2deg]" },
  { card: "bg-grape text-white", chip: "bg-white/15", tilt: "rotate-[1.5deg] lg:mt-[2.6vw]" },
  { card: "bg-lagoon text-white", chip: "bg-white/20", tilt: "rotate-[-1deg]" },
  { card: "bg-sunbeam text-ink", chip: "bg-ink/10", tilt: "rotate-[2deg] lg:mt-[2.6vw]" },
];

const layerLooks = ["bg-blush text-white", "bg-grape text-white", "bg-lagoon text-white", "bg-sunbeam text-ink", "bg-lav text-ink", "bg-ink text-white"];
const versionDots = ["bg-blush", "bg-grape", "bg-lagoon", "bg-sunbeam", "bg-blush"];

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, ...rest] = service.heroLines;
  // Extra lines from the CMS join the last line rather than disappearing.
  const l3 = rest.join(" ");
  const copy = mobileCopy(service);
  const steps = service.hidden?.includes("process") ? [] : service.process;

  return (
    <AppMotion className="flex flex-col pb-[clamp(5rem,9.9vw,11.875rem)]">
      {/* ── Hero: ordering app with push alerts ───────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-60 -z-10 h-[calc(100%+15rem)] bg-[radial-gradient(ellipse_32%_44%_at_16%_16%,rgb(106_75_151/0.22),transparent_72%),radial-gradient(ellipse_34%_48%_at_74%_44%,rgb(242_119_147/0.28),transparent_72%),radial-gradient(ellipse_22%_30%_at_92%_12%,rgb(63_183_199/0.22),transparent_72%)]"
        />

        <div className="shell grid items-start gap-y-12 lg:grid-cols-[minmax(0,784fr)_minmax(0,804fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1.5rem,3.1vw,3.6rem)] uppercase">
              <span className="block font-display text-[clamp(3rem,6.25vw,7.5rem)] leading-[1.08] text-blush-ink">{l1}</span>
              {l2 ? <span className="block font-haas text-[clamp(3rem,6.25vw,7.5rem)] leading-[1.22] tracking-[-0.05em] text-grape">{l2}</span> : null}
              {l3 ? <span className="block font-display text-[clamp(1.75rem,3.75vw,4.5rem)] leading-[1.28] text-lagoon-ink">{l3}</span> : null}
            </h1>
            <HeroSubheading text={service.heroSubheading} />
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(2rem,3.3vw,4rem)] [&>span:last-child]:text-ink" />
            <p className="mt-[clamp(1.5rem,1.67vw,2rem)] w-fit rounded-full bg-white/70 px-[clamp(1rem,1.15vw,1.375rem)] py-[clamp(0.6rem,0.7vw,0.85rem)] font-haas text-[clamp(0.8125rem,0.885vw,1.0625rem)] tracking-[0.06em] text-grape uppercase shadow-[0_10px_24px_rgb(34_1_40/0.08)]">
              {copy.hero.badge}
            </p>
          </div>

          {/* Phone collage — 800 × 900 units, bleeding into the right gutter. */}
          <div
            role="img"
            aria-label={`The ${copy.hero.phone.app} ordering app on a phone, with push notifications and a ${copy.hero.rating.value} store rating`}
            className="@container flex flex-col items-center gap-5 lg:-mr-[clamp(1.25rem,4vw,5rem)] lg:grid lg:aspect-[800/900] lg:gap-0"
          >
            <AppPhone copy={copy.hero.phone} priority className={`w-[70%] max-w-[21rem] rotate-[-3deg] ${lgAt} lg:mt-[4%] lg:ml-[31%] lg:w-[42%] lg:max-w-none`} />

            {copy.hero.notifications.map((n, i) => (
              <div
                key={i}
                data-pop
                className={`w-full max-w-[24rem] ${lgAt} ${i === 0 ? "lg:mt-[20%] lg:ml-[0%]" : "lg:mt-[63%] lg:ml-[52%]"} lg:w-[47%] lg:max-w-none`}
              >
                <Notification app={n.app} title={n.title} body={n.body} index={i} className={i === 0 ? "rotate-[-4deg]" : "rotate-[3deg]"} />
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-center gap-4 lg:contents">
              <span data-pop className={`w-fit ${lgAt} lg:mt-[3%] lg:ml-[78%]`}>
                <span
                  data-float="8"
                  className={`grid aspect-square w-[max(6.5rem,17cqw)] rotate-[10deg] place-items-center content-center rounded-full bg-sunbeam text-center text-ink ${cardShadow}`}
                >
                  <span className="font-pop text-[max(2.25rem,6.5cqw)] leading-[0.9]">★{copy.hero.rating.value}</span>
                  <span className="font-display text-[max(0.5625rem,1.4cqw)] uppercase">{copy.hero.rating.label}</span>
                </span>
              </span>
              <span data-pop className={`w-fit ${lgAt} lg:mt-[86%] lg:ml-[6%]`}>
                <span
                  data-float="6"
                  className="block rotate-[-5deg] rounded-[max(0.875rem,1.9cqw)] bg-lagoon px-[max(1rem,2.4cqw)] py-[max(0.6rem,1.5cqw)] font-copy text-[max(0.8125rem,1.9cqw)] leading-none font-bold whitespace-pre text-white shadow-[0_12px_30px_rgb(34_1_40/0.18)]"
                >
                  {copy.hero.toast}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platforms: one card per app store ─────────────────────── */}
      <section aria-labelledby="platforms-title" className={`shell ${sectionGap}`}>
        <SectionTitle
          align="center"
          eyebrow={copy.platforms.eyebrow}
          title={<span id="platforms-title" className="whitespace-pre-line">{copy.platforms.heading}</span>}
        />
        <Description text={copy.platforms.text} center />
        <ul data-reveal-stagger className={`grid items-start gap-[clamp(1rem,1.67vw,2rem)] sm:grid-cols-2 lg:grid-cols-4 ${headingGap}`}>
          {copy.platforms.cards.map((c, i) => {
            const look = platformLooks[i % platformLooks.length];
            return (
              <li key={i} className={look.tilt}>
                <article className={`flex min-h-[clamp(17rem,20vw,24rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] p-[clamp(1.5rem,1.88vw,2.25rem)] ${look.card} ${cardShadow}`}>
                  <span aria-hidden className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-current opacity-80" />
                    <span className="size-2.5 rounded-full bg-current opacity-50" />
                    <span className="size-2.5 rounded-full bg-current opacity-30" />
                  </span>
                  <h3 className="mt-[clamp(1.75rem,2.6vw,3.125rem)] font-display text-[clamp(1.5rem,2.08vw,2.5rem)] leading-[1.1] uppercase">{c.name}</h3>
                  <p className={`mt-3 w-fit rounded-full px-3 py-1.5 font-copy text-[clamp(0.75rem,0.78vw,0.9375rem)] font-bold ${look.chip}`}>{c.tag}</p>
                  <p className="mt-auto pt-6 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.55] opacity-90">{c.body}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Benefits: notifications on a lock screen ──────────────── */}
      <section aria-labelledby="benefits-title" className={`shell grid items-center gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-[5vw] ${sectionGap}`}>
        <div>
          <SectionTitle
            eyebrow={copy.benefits.eyebrow}
            title={<span id="benefits-title" className="whitespace-pre-line">{copy.benefits.heading}</span>}
          />
          <Description text={copy.benefits.text} />
        </div>
        <div data-reveal className="@container mx-auto w-full max-w-[38rem]">
          <div className="relative overflow-hidden rounded-[8cqw] bg-dusk px-[6cqw] pt-[8cqw] pb-[7cqw] shadow-[0_30px_70px_rgb(34_1_40/0.28)]">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_20%_10%,rgb(106_75_151/0.65),transparent_70%),radial-gradient(ellipse_55%_45%_at_90%_95%,rgb(242_119_147/0.45),transparent_70%)]" />
            <p aria-hidden className="relative text-center font-copy text-[max(3rem,15cqw)] leading-none font-extralight text-white/90">9:41</p>
            <p aria-hidden className="relative mt-[1.5cqw] text-center font-copy text-[max(0.75rem,3.2cqw)] font-medium text-white/60">Monday, 12 May</p>
            <ul className="relative mt-[7cqw] flex flex-col gap-[3cqw]">
              {copy.benefits.items.map((b, i) => (
                <Notification key={i} as="li" app={b.app} title={b.title} body={b.body} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Process: the app's version history ────────────────────── */}
      {steps.length ? (
        <section aria-labelledby="process-title" className={`shell ${sectionGap}`}>
          <SectionTitle
            align="center"
            eyebrow={copy.process.eyebrow}
            title={<span id="process-title" className="whitespace-pre-line">{copy.process.heading}</span>}
          />
          <Description text={copy.process.text} center />
          <div data-reveal className={`mx-auto max-w-[68rem] overflow-hidden rounded-[clamp(1.5rem,2.08vw,2.5rem)] bg-white ${cardShadow} ${headingGap}`}>
            <div className="flex items-center gap-4 border-b border-ink/8 px-[clamp(1.25rem,2.5vw,3rem)] py-[clamp(1rem,1.46vw,1.75rem)]">
              <span aria-hidden className="grid size-[clamp(2.75rem,3.33vw,4rem)] shrink-0 place-items-center rounded-[28%] bg-grape font-pop text-[clamp(1.5rem,2vw,2.5rem)] leading-none text-sunbeam">
                {copy.hero.phone.app.charAt(0)}
              </span>
              <div>
                <p className="font-copy text-[clamp(1rem,1.15vw,1.375rem)] font-extrabold text-ink">{copy.hero.phone.app}</p>
                <p className="font-copy text-[clamp(0.8125rem,0.83vw,1rem)] text-ink/55">Version history</p>
              </div>
            </div>
            <ol>
              {steps.map((step, i) => {
                const v = copy.process.versions[i] ?? { version: `Version 0.${i + 1}`, when: "" };
                const last = i === steps.length - 1;
                return (
                  <li key={i} className="grid gap-x-[clamp(1.25rem,2.5vw,3rem)] gap-y-2 border-b border-ink/8 px-[clamp(1.25rem,2.5vw,3rem)] py-[clamp(1.25rem,1.98vw,2.375rem)] last:border-b-0 md:grid-cols-[minmax(0,13rem)_1fr]">
                    <div>
                      <p className="flex items-center gap-2 font-display text-[clamp(0.875rem,0.94vw,1.125rem)] text-grape uppercase">
                        <span aria-hidden className={`size-2.5 rounded-full ${versionDots[i % versionDots.length]}`} />
                        {v.version}
                      </p>
                      {v.when ? <p className="mt-1 font-copy text-[clamp(0.8125rem,0.83vw,1rem)] font-medium text-ink/55">{v.when}</p> : null}
                    </div>
                    <div>
                      <h3 className="font-display text-[clamp(1.125rem,1.46vw,1.75rem)] leading-[1.2] text-ink uppercase">{step.title}</h3>
                      <p className="mt-2 max-w-[44rem] font-copy text-body leading-[1.6] font-light text-ink/80">{step.body}</p>
                      <span aria-hidden className="mt-4 block h-2 max-w-[24rem] overflow-hidden rounded-full bg-ink/8">
                        <span
                          data-install
                          className={`block h-full rounded-full ${last ? "bg-blush" : "bg-grape/70"}`}
                          style={{ width: `${Math.round(((i + 1) / steps.length) * 100)}%` }}
                        />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ── Features: a home screen of icons ──────────────────────── */}
      <section aria-labelledby="features-title" className={`shell ${sectionGap}`}>
        <SectionTitle
          align="center"
          eyebrow={copy.features.eyebrow}
          title={<span id="features-title" className="whitespace-pre-line">{copy.features.heading}</span>}
        />
        <Description text={copy.features.text} center />
        <div className={`mx-auto max-w-[72rem] rounded-[clamp(1.75rem,2.6vw,3.125rem)] bg-[linear-gradient(160deg,var(--color-paper),#f3dbe7_55%,#dff1f4)] px-[clamp(1.25rem,3.6vw,4.375rem)] py-[clamp(1.75rem,3.13vw,3.75rem)] ${cardShadow} ${headingGap}`}>
          <ul data-icons className="grid grid-cols-3 gap-x-[clamp(1rem,2.6vw,3.125rem)] gap-y-[clamp(1.25rem,2.08vw,2.5rem)] sm:grid-cols-4 md:grid-cols-6">
            {copy.features.items.map((f, i) => (
              <AppIcon key={i} icon={f.icon} name={f.name} index={i} />
            ))}
          </ul>
          <span aria-hidden className="mx-auto mt-[clamp(1.5rem,2.6vw,3.125rem)] flex w-fit gap-2">
            <span className="size-2 rounded-full bg-grape" />
            <span className="size-2 rounded-full bg-grape/25" />
            <span className="size-2 rounded-full bg-grape/25" />
          </span>
        </div>
      </section>

      {/* ── Under the hood: stacked layers ────────────────────────── */}
      <section aria-labelledby="layers-title" className={`shell grid items-center gap-y-10 lg:grid-cols-[minmax(0,560fr)_minmax(0,980fr)] lg:gap-x-[4.5vw] ${sectionGap}`}>
        <div>
          <SectionTitle
            eyebrow={copy.layers.eyebrow}
            title={<span id="layers-title" className="whitespace-pre-line">{copy.layers.heading}</span>}
          />
          <Description text={copy.layers.text} />
        </div>
        <ol data-layers className="flex flex-col gap-[clamp(0.5rem,0.73vw,0.875rem)]">
          {copy.layers.items.map((l, i) => (
            <li
              key={i}
              style={{ marginLeft: `${i * 3}%`, marginRight: `${(copy.layers.items.length - 1 - i) * 3}%` }}
              className={`flex items-center gap-[clamp(1rem,1.46vw,1.75rem)] rounded-[clamp(1rem,1.25vw,1.5rem)] px-[clamp(1.25rem,1.67vw,2rem)] py-[clamp(0.875rem,1.15vw,1.375rem)] shadow-[0_14px_30px_rgb(34_1_40/0.14)] max-sm:!mx-0 ${layerLooks[i % layerLooks.length]}`}
            >
              <span aria-hidden className="font-pop text-[clamp(1.75rem,2.6vw,3.125rem)] leading-none opacity-60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-display text-[clamp(1rem,1.25vw,1.5rem)] leading-tight uppercase">{l.name}</span>
                <span className="mt-0.5 block font-copy text-[clamp(0.8125rem,0.89vw,1.0625rem)] leading-snug opacity-85">{l.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Build plan offer ──────────────────────────────────────── */}
      <section aria-labelledby="plan-title" className={`shell ${sectionGap}`}>
        <div data-reveal className="relative isolate grid items-center gap-10 overflow-hidden rounded-[clamp(2rem,2.6vw,3.125rem)] bg-grape px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2.5rem,4.17vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_60%_at_8%_10%,rgb(242_119_147/0.45),transparent_70%),radial-gradient(ellipse_40%_60%_at_95%_100%,rgb(63_183_199/0.4),transparent_70%)]" />
          <div>
            <p className="font-haas text-eyebrow leading-none text-sunbeam uppercase">{copy.plan.eyebrow}</p>
            <h2 id="plan-title" className="mt-[0.35em] font-display text-h2 leading-[1.1] whitespace-pre-line text-cream uppercase">
              {copy.plan.heading}
            </h2>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[36rem] font-copy text-body leading-[1.64] font-light whitespace-pre-line text-white/85">{copy.plan.text}</p>
            <PopButton
              href="/contact"
              label={copy.plan.button}
              className="mt-[clamp(1.75rem,2.6vw,3.125rem)] [&>span:first-child]:bg-blush hover:[&>span:first-child]:bg-sunbeam [&>span:last-child]:text-white"
            />
          </div>
          <div className="@container mx-auto w-full max-w-[26rem] rotate-[3deg]">
            <div className={`rounded-[8cqw] bg-white p-[8cqw] ${cardShadow}`}>
              <p className="font-display text-[max(1rem,6cqw)] text-grape uppercase">{copy.plan.card}</p>
              <ul className="mt-[6cqw] flex flex-col gap-[4cqw]">
                {copy.plan.checklist.map((c, i) => (
                  <li key={i} className="flex items-center gap-[4cqw] font-copy text-[max(0.9375rem,4.8cqw)] font-bold text-ink">
                    <span aria-hidden className={`grid size-[max(1.5rem,8cqw)] shrink-0 place-items-center rounded-full text-[max(0.75rem,4cqw)] text-white ${versionDots[i % versionDots.length]}`}>
                      ✓
                    </span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </AppMotion>
  );
}

/** A section's optional description from the CMS (nothing when empty). */
function Description({ text, center = false }: { text: string; center?: boolean }) {
  if (!text.trim()) return null;
  return (
    <p
      data-reveal
      className={`mt-[clamp(1.25rem,1.67vw,2rem)] max-w-[56rem] font-copy text-body leading-[1.64] font-light whitespace-pre-line text-ink/85 ${center ? "mx-auto text-center" : ""}`}
    >
      {text}
    </p>
  );
}
