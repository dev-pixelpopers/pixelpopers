import SectionTitle from "@/components/inner/SectionTitle";
import { afterSend, channels, chatFaq, nextSteps, whereWhen } from "@/lib/pages/contact";

/* ── What happens next: three tilted step cards ───────────────────────── */

export function NextSteps() {
  return (
    <section aria-labelledby="next-title" className="shell">
      <SectionTitle align="center" eyebrow={nextSteps.eyebrow} title={<span id="next-title">{nextSteps.heading}</span>} />
      <ol data-reveal-stagger className="mt-[clamp(2rem,3.96vw,4.75rem)] grid gap-[clamp(1.25rem,2.08vw,2.5rem)] md:grid-cols-3 lg:-mx-[1%]">
        {nextSteps.items.map((s) => (
          <li
            key={s.n}
            className={`grid min-h-[clamp(13rem,15.6vw,18.75rem)] overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] shadow-[0_24px_60px_rgb(34_1_40/0.15)] ${s.card} ${s.tilt}`}
          >
            <span
              aria-hidden
              className="col-start-1 row-start-1 -mt-[clamp(2.5rem,3.6vw,4.375rem)] mr-[8%] justify-self-end font-pop text-[clamp(10rem,15.6vw,18.75rem)] leading-[1.13] text-white/25"
            >
              {s.n}
            </span>
            <div className="col-start-1 row-start-1 self-end p-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(1.75rem,2.9vw,3.5rem)]">
              <h3 className="font-display text-[clamp(1.5rem,1.98vw,2.375rem)] leading-tight uppercase">{s.title}</h3>
              <p className="mt-3 max-w-[25rem] font-copy text-small leading-[1.5] opacity-90">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Other ways to say hi ─────────────────────────────────────────────── */

export function Channels() {
  return (
    <section aria-labelledby="channels-title" className="shell">
      <SectionTitle align="center" eyebrow={channels.eyebrow} title={<span id="channels-title">{channels.heading}</span>} />
      <ul data-reveal-stagger className="mt-[clamp(2rem,4.5vw,5.375rem)] grid gap-[clamp(1rem,1.04vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-4">
        {channels.items.map((c) => (
          <li key={c.title} className={`${c.tilt}`}>
            <a
              href={c.href}
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group grid min-h-[clamp(15rem,17.7vw,21.25rem)] overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] shadow-[0_20px_50px_rgb(34_1_40/0.15)] transition-transform duration-300 hover:-translate-y-1.5 ${c.card}`}
            >
              <span
                aria-hidden
                className="col-start-1 row-start-1 -mt-[clamp(2.25rem,3.1vw,3.75rem)] -mr-[0.08em] justify-self-end font-pop text-[clamp(10rem,15.6vw,18.75rem)] leading-[1.07] text-white/20"
              >
                {c.letter}
              </span>
              <span className="col-start-1 row-start-1 flex flex-col self-end p-[clamp(1.5rem,1.67vw,2rem)] pb-[clamp(1.75rem,1.98vw,2.375rem)]">
                <span className="font-display text-[clamp(1.375rem,1.67vw,2rem)] leading-tight uppercase">{c.title}</span>
                <span className="mt-2 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.47] opacity-90">{c.body}</span>
                <span className="mt-[clamp(2rem,2.8vw,3.375rem)] font-display text-micro uppercase group-hover:underline">{c.cta} →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Chat-style FAQ ───────────────────────────────────────────────────── */

export function ChatFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chatFaq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const bubble = "max-w-[42.75rem] px-[clamp(1.25rem,1.67vw,2rem)] py-[clamp(0.875rem,1.15vw,1.375rem)] font-copy text-[clamp(1rem,1.09vw,1.3125rem)] leading-[1.52] shadow-[0_10px_24px_rgb(34_1_40/0.1)]";

  return (
    <section aria-labelledby="chat-title" className="shell grid gap-10 lg:grid-cols-[minmax(0,714fr)_minmax(0,874fr)]">
      <div data-reveal>
        <h2 id="chat-title" className="font-display text-h2 leading-[1.16] text-grape uppercase">
          {chatFaq.heading[0]}
          <br />
          {chatFaq.heading[1]}
        </h2>
        <p className="mt-6 font-copy text-body leading-[1.64] font-light text-ink">{chatFaq.sub}</p>
      </div>
      <dl data-reveal-stagger className="flex flex-col">
        {chatFaq.items.map((f, i) => (
          <div key={f.q} className={`flex flex-col gap-[1.125rem] ${i ? "mt-[clamp(1.25rem,1.56vw,1.875rem)]" : ""}`}>
            <dt className={`${bubble} self-end rounded-3xl rounded-br-md font-medium text-white ${f.bubble}`}>{f.q}</dt>
            <dd className={`${bubble} self-start rounded-3xl rounded-bl-md bg-white text-ink`}>{f.a}</dd>
          </div>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/* ── Long-form: what happens after you hit send ──────────────────────── */

export function AfterSend() {
  return (
    <section
      aria-labelledby="after-title"
      className="shell grid gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)]"
    >
      <div data-reveal className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)] lg:sticky lg:top-10 lg:self-start">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{afterSend.eyebrow}</p>
        <h2 id="after-title" className="font-display text-h3 leading-[1.16] text-grape uppercase">
          {afterSend.heading}
        </h2>
        <p className="font-copy text-lead leading-[1.53] text-ink">{afterSend.lead}</p>
      </div>
      <ol data-reveal-stagger className="flex flex-col gap-6">
        {afterSend.steps.map((s, i) => (
          <li key={s.title} className="flex gap-[clamp(1rem,1.67vw,2rem)] rounded-3xl bg-white p-[clamp(1.5rem,2.08vw,2.5rem)] max-sm:flex-col">
            <span aria-hidden className="w-[clamp(4rem,5.7vw,6.875rem)] shrink-0 font-display text-[clamp(2.5rem,3.33vw,4rem)] leading-none text-blush">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-3">
              <h3 className="font-haas text-card leading-tight text-ink">{s.title}</h3>
              <p className="font-copy text-copy leading-[1.67] font-light text-ink/85">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Long-form: where we work, hours, response times ─────────────────── */

export function WhereWhen() {
  return (
    <section aria-labelledby="where-title" className="shell flex flex-col gap-[clamp(2rem,2.9vw,3.5rem)]">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,760fr)_minmax(0,708fr)] lg:items-end lg:gap-[clamp(3rem,6.25vw,7.5rem)]">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{whereWhen.eyebrow}</p>
          <h2 id="where-title" className="mt-3 font-display text-h2 leading-[1.1] text-grape uppercase">
            {whereWhen.heading}
          </h2>
        </div>
        <p data-reveal className="font-copy text-lead leading-[1.53] text-ink">
          {whereWhen.lead}
        </p>
      </div>
      <ul data-reveal-stagger className="grid gap-8 md:grid-cols-3">
        {whereWhen.cards.map((c) => (
          <li key={c.title} className="flex flex-col items-start gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
            <span className={`rounded-full px-[1.125rem] py-2.5 font-haas text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-none uppercase ${c.chip}`}>
              {c.tag}
            </span>
            <h3 className="font-haas text-card leading-tight text-ink">{c.title}</h3>
            <p className="font-copy text-small leading-[1.6] font-light text-ink">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
