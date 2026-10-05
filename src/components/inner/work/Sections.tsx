import Image from "next/image";
import ClientsSection from "@/components/sections/ClientsSection";
import PopButton from "@/components/ui/PopButton";
import { impact, teasers, workCta, workIntro, workTestimonials } from "@/lib/pages/work";
import { wide } from "./tokens";

/** Figma "Long-form · What we make": sticky heading beside real paragraphs, then three success cards. */
export function Intro() {
  const [lead, ...rest] = workIntro.paragraphs;
  const s = workIntro.success;
  return (
    <section aria-labelledby="what-we-make-title" className="shell flex flex-col gap-[clamp(3.5rem,4.17vw,5rem)]">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)]">
        <div data-reveal className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)] lg:sticky lg:top-10 lg:self-start">
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{workIntro.eyebrow}</p>
          <h2 id="what-we-make-title" className="font-display text-h3 leading-[1.16] text-grape uppercase">
            {workIntro.heading}
          </h2>
        </div>
        <div data-reveal className="flex flex-col gap-7 font-copy">
          <p className="text-lead leading-[1.53] text-ink">{lead}</p>
          {rest.map((p) => (
            <p key={p.slice(0, 24)} className="text-copy leading-[1.67] font-light text-ink/85">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[clamp(1.75rem,2.08vw,2.5rem)]">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{s.eyebrow}</p>
          <h3 className="mt-[0.2em] font-display text-h2 leading-[1.1] text-grape uppercase">{s.heading}</h3>
        </div>
        <ul data-reveal-stagger className="grid gap-[clamp(1.25rem,1.67vw,2rem)] md:grid-cols-3">
          {s.cards.map((c, i) => (
            <li key={c.title} className="flex flex-col gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
              <span className="self-start rounded-full bg-blush px-[1.125rem] py-2.5 font-haas text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-none text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-haas text-card leading-tight text-ink">{c.title}</h4>
              <p className="font-copy text-small leading-[1.6] font-light text-ink">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "The agency — Brands we've popped": centred title over the home page's client cloud and folder. */
export function Clients() {
  return (
    <section aria-labelledby="clients-title">
      <div data-reveal className="shell text-center">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">The agency</p>
        <h2 id="clients-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          Brands we’ve popped
        </h2>
      </div>
      <ClientsSection />
    </section>
  );
}

/** "Impact — The numbers behind the pop": grape band with a pink glow and four Modak stats. */
export function Impact() {
  return (
    <section aria-labelledby="impact-title">
      <div data-reveal className="shell">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{impact.eyebrow}</p>
        <h2 id="impact-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          {impact.heading}
        </h2>
      </div>
      <div className={`${wide} mt-[clamp(2rem,3.96vw,4.75rem)]`}>
        <dl
          data-reveal-stagger
          className="grid grid-cols-2 gap-y-8 overflow-hidden rounded-[clamp(1.5rem,2.5vw,3rem)] bg-grape bg-[radial-gradient(ellipse_22%_60%_at_85%_20%,rgb(242_119_147/0.45),transparent_75%)] px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2rem,2.6vw,3.125rem)] pb-[clamp(2.5rem,5.6vw,6.75rem)] lg:grid-cols-4"
        >
          {impact.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-[clamp(0.5rem,1.04vw,1.25rem)] pl-1 font-copy text-small font-medium text-white">{s.label}</dt>
              <dd className={`font-pop text-[clamp(3.5rem,7.81vw,9.375rem)] leading-[1.2] ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** "Kind words — Clients who popped": three tilted quote cards, the grape one dropped. */
export function Testimonials() {
  const t = workTestimonials;
  return (
    <section aria-labelledby="kind-words-title" className="shell">
      <div data-reveal className="text-center">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{t.eyebrow}</p>
        <h2 id="kind-words-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          {t.heading}
        </h2>
      </div>
      <ul data-reveal-stagger className="mt-[clamp(2.5rem,4.5vw,5.375rem)] grid items-start gap-[clamp(1.5rem,1.77vw,2.125rem)] lg:grid-cols-3">
        {t.items.map((q) => (
          <li key={q.company} className={`w-full max-lg:mx-auto max-lg:max-w-xl ${q.offset}`}>
            <figure
              className={`flex min-h-[clamp(17rem,22.9vw,27.5rem)] flex-col overflow-hidden rounded-[32px] px-8 pb-[clamp(1.75rem,1.77vw,2.125rem)] shadow-[0_20px_50px_rgb(0_0_0/0.13)] ${q.card} ${q.tilt}`}
            >
              <span aria-hidden className={`-mt-[clamp(1.5rem,2.3vw,2.75rem)] -ml-1 font-pop text-[clamp(7rem,10.4vw,12.5rem)] leading-none ${q.mark}`}>
                “
              </span>
              <blockquote className="-mt-[clamp(1.5rem,2.3vw,2.75rem)] font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)] leading-[1.55] font-medium">
                <p>{q.quote}</p>
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 pt-8">
                <span aria-hidden className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-[1.375rem] ${q.avatar}`}>
                  {q.initial}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-tight">{q.role}</span>
                  <span className="font-copy text-[0.9375rem] leading-tight opacity-70">{q.company}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "In the oven — Coming soon": blurred, dimmed teasers of unreleased work. */
export function Teasers() {
  return (
    <section id="in-the-oven" aria-labelledby="oven-title" className="shell">
      <div data-reveal>
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{teasers.eyebrow}</p>
        <h2 id="oven-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          {teasers.heading}
        </h2>
      </div>
      <ul data-reveal-stagger className="mt-[clamp(2rem,4vw,4.75rem)] grid gap-[clamp(1.25rem,1.77vw,2.125rem)] md:grid-cols-3">
        {teasers.items.map((t) => (
          <li key={t.tag} className={`grid aspect-[520/360] grid-cols-1 grid-rows-1 overflow-hidden rounded-[32px] ${t.bg}`}>
            <Image
              src={t.img.src}
              alt=""
              width={t.img.w}
              height={t.img.h}
              sizes="(min-width: 768px) 30vw, 92vw"
              className="col-start-1 row-start-1 size-full scale-110 object-cover blur-[14px]"
            />
            <span aria-hidden className="relative col-start-1 row-start-1 bg-ink/35" />
            <span className="relative col-start-1 row-start-1 place-self-center rounded-full bg-white px-[clamp(2rem,3.3vw,4rem)] py-[clamp(0.875rem,1.04vw,1.25rem)] font-display text-micro leading-none text-ink uppercase">
              Coming soon
            </span>
            <span className="relative col-start-1 row-start-1 m-[5.4%] self-end justify-self-start font-display text-[clamp(0.75rem,0.73vw,0.875rem)] text-white uppercase">
              {t.tag}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Closing CTA "Let's build something extraordinary together". */
export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="shell">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,934fr)_minmax(0,560fr)] lg:px-[3.8%]">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{workCta.eyebrow}</p>
          <h2 id="cta-title" className="mt-[0.2em] font-display text-h2 leading-[1.16] text-grape uppercase">
            {workCta.heading[0]}
            <br />
            {workCta.heading[1]}
          </h2>
        </div>
        <div data-reveal className="flex flex-col items-start gap-[clamp(1.5rem,2.08vw,2.5rem)] lg:pt-10">
          <p className="max-w-[35rem] font-copy text-body leading-[1.64] font-light text-ink">{workCta.body}</p>
          <PopButton href={workCta.cta.href} label={workCta.cta.label} className="[&>span:last-child]:text-ink" />
        </div>
      </div>
    </section>
  );
}

