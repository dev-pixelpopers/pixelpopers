import Link from "next/link";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import {
  blogHero,
  getPost,
  journalIntro,
  popularSlugs,
  posts,
  resources,
  slugify,
  startHere,
  topics,
  trendingTags,
} from "@/lib/pages/blog";
import { cardShadow, toneFill, toneText } from "./tones";

/* ------------------------------------------------------------------ */
/* Hero — "FRESH FROM / THE STUDIO / IDEAS WORTH POPPING"              */
/* ------------------------------------------------------------------ */

/**
 * The first two lines start 171px (12.6% of the 1360px block) in from the
 * third, so the three lines share one `w-fit` block sized by the widest line.
 */
export function BlogHero() {
  const [l1, l2, l3] = blogHero.lines;
  return (
    <section aria-labelledby="blog-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)] bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
      />
      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      </div>
      <div className="mx-auto mt-[clamp(1.75rem,3.1vw,3.75rem)] w-fit max-w-full px-5">
        <h1 id="blog-title" data-reveal className="uppercase">
          <span className="block font-display text-hero-sm leading-[1.12] text-blush sm:ml-[12.6%]">
            {l1}
          </span>
          <span className="block font-haas text-hero-md leading-[1.05] tracking-[-0.033em] text-grape sm:ml-[12.6%]">
            {l2}
          </span>
          <span className="mt-[0.1em] block font-display text-[clamp(1.5rem,5.21vw,6.25rem)] leading-[1.2] text-lagoon sm:whitespace-nowrap">
            {l3}
          </span>
        </h1>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Long-form · About the journal + Start here                          */
/* ------------------------------------------------------------------ */

export function JournalIntro() {
  return (
    <section
      aria-labelledby="journal-title"
      className="shell grid gap-8 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)]"
    >
      <div
        data-reveal
        className="flex flex-col gap-[clamp(0.75rem,1.04vw,1.25rem)] lg:sticky lg:top-10 lg:self-start"
      >
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">
          {journalIntro.eyebrow}
        </p>
        <h2
          id="journal-title"
          className="font-display text-h2 leading-[1.1] text-grape uppercase"
        >
          {journalIntro.heading}
        </h2>
      </div>
      <div data-reveal className="flex flex-col gap-7 font-copy">
        {journalIntro.paragraphs.map((p, i) =>
          i === 0 ? (
            <p key={i} className="text-lead leading-[1.53] text-ink">
              {p}
            </p>
          ) : (
            <p
              key={i}
              className="text-copy leading-[1.67] font-light text-ink/85"
            >
              {p}
            </p>
          ),
        )}
      </div>
    </section>
  );
}

export function StartHere() {
  return (
    <section
      aria-labelledby="start-title"
      className="shell flex flex-col gap-[clamp(2rem,2.5vw,3rem)]"
    >
      <div data-reveal>
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">
          {startHere.eyebrow}
        </p>
        <h2
          id="start-title"
          className="mt-2 font-display text-h2 leading-[1.1] text-grape uppercase"
        >
          {startHere.heading}
        </h2>
      </div>
      <ol
        data-reveal-stagger
        className="grid gap-[clamp(1rem,1.67vw,2rem)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {startHere.guides.map((g, i) => {
          const post = getPost(g.slug);
          if (!post) return null;
          return (
            <li key={g.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col gap-4 rounded-[clamp(1.25rem,1.46vw,1.75rem)] bg-white px-[clamp(1.5rem,1.67vw,2rem)] py-[clamp(1.75rem,1.875vw,2.25rem)] shadow-[0_24px_60px_rgb(34_1_40/0.1)] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span
                  aria-hidden
                  className={`font-pop text-[clamp(3.5rem,4.17vw,5rem)] leading-[1.1] ${toneText[g.tone]}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-haas text-card leading-[1.29] text-ink group-hover:text-grape">
                  {post.title}
                </h3>
                <p className="font-copy text-small leading-[1.6] font-light text-ink/85">
                  {g.desc}
                </p>
                <span
                  aria-hidden
                  className="mt-auto pt-2 font-display text-micro text-blush uppercase"
                >
                  Read the guide →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Popular this month + Browse by topic                                */
/* ------------------------------------------------------------------ */

const popularTones = ["blush", "lagoon", "sunbeam", "grape", "blush"] as const;

export function PopularAndTopics() {
  const popular = popularSlugs.map(getPost).filter((p) => p !== undefined);
  return (
    <div className="shell grid gap-[clamp(3.5rem,5vw,6rem)] lg:grid-cols-[minmax(0,780fr)_minmax(0,700fr)] lg:gap-[clamp(3rem,5.9vw,7.125rem)]">
      <section aria-labelledby="popular-title">
        <h2
          id="popular-title"
          data-reveal
          className="font-haas text-[clamp(1.5rem,2.5vw,3rem)] leading-none text-blush uppercase"
        >
          Popular this month
        </h2>
        <ol data-reveal-stagger className="mt-[clamp(1.25rem,1.77vw,2.125rem)]">
          {popular.map((p, i) => (
            <li key={p.slug} className="border-b border-ink/10">
              <Link
                href={`/blog/${p.slug}`}
                className="group grid grid-cols-[clamp(3.5rem,6.98vw,8.375rem)_1fr] items-center py-2.5"
              >
                <span
                  aria-hidden
                  className={`font-pop text-[clamp(3rem,4.17vw,5rem)] leading-[1.2] ${toneText[popularTones[i]]}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2 py-3">
                  <span className="font-haas text-card leading-[1.29] text-ink transition-colors group-hover:text-grape">
                    {p.title}
                  </span>
                  <span className="font-display text-[clamp(0.6875rem,0.68vw,0.8125rem)] text-blush uppercase">
                    {p.readTime} min read · Read →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="topics-title">
        <h2
          id="topics-title"
          data-reveal
          className="font-haas text-[clamp(1.5rem,2.5vw,3rem)] leading-none text-blush uppercase"
        >
          Browse by topic
        </h2>
        <ul
          data-reveal-stagger
          className="mt-[clamp(1.5rem,2.6vw,3.125rem)] grid grid-cols-2 gap-[clamp(0.75rem,1.04vw,1.25rem)]"
        >
          {topics.map((t, i) => {
            const count = posts.filter((p) => p.category === t.category).length;
            return (
              <li
                key={t.category}
                className={i % 2 ? "rotate-1" : "-rotate-[1.5deg]"}
              >
                <Link
                  href={`#topic-${slugify(t.category)}`}
                  className={`group grid h-[clamp(7.5rem,8.85vw,10.625rem)] overflow-hidden rounded-[clamp(1.25rem,1.46vw,1.75rem)] transition-transform duration-300 hover:-translate-y-1 ${toneFill[t.tone]}`}
                >
                  <span
                    aria-hidden
                    className="col-start-1 row-start-1 -mt-[clamp(1.5rem,2.08vw,2.5rem)] self-start justify-self-end font-pop text-[clamp(8rem,10.4vw,12.5rem)] leading-[1.1] text-white/25 transition-transform duration-300 group-hover:-rotate-6"
                  >
                    {t.letter}
                  </span>
                  <span className="col-start-1 row-start-1 flex flex-col justify-end gap-1 p-[clamp(1rem,1.46vw,1.75rem)]">
                    <span className="font-display text-[clamp(1rem,1.46vw,1.75rem)] leading-tight uppercase">
                      {t.label}
                    </span>
                    <span className="font-copy text-[clamp(0.8125rem,0.885vw,1.0625rem)] font-medium opacity-85">
                      {count} {count === 1 ? "post" : "posts"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Free stuff — resources + trending tags                              */
/* ------------------------------------------------------------------ */

const resourceTilt = ["-rotate-1", "rotate-1", "-rotate-1"];

export function Resources() {
  return (
    <section aria-labelledby="resources-title" className="shell">
      <SectionTitle
        eyebrow="Free stuff"
        title={<span id="resources-title">Resources worth stealing</span>}
        align="center"
      />
      <ul
        data-reveal-stagger
        className="mt-[clamp(2rem,4.5vw,5.375rem)] grid gap-8 md:grid-cols-3 md:gap-[clamp(1.25rem,1.77vw,2.125rem)]"
      >
        {resources.map((r, i) => (
          <li key={r.title} className={resourceTilt[i]}>
            <Link
              href="#newsletter"
              aria-label={`${r.title}: get it free when you subscribe`}
              className={`group flex h-full flex-col overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white transition-transform duration-300 hover:-translate-y-1.5 ${cardShadow}`}
            >
              <span
                aria-hidden
                className={`flex h-[clamp(8rem,9.4vw,11.25rem)] items-center px-7 font-pop text-[clamp(4.5rem,5.73vw,6.875rem)] leading-none ${toneFill[r.tone]}`}
              >
                <span className="opacity-90">{r.kind}</span>
              </span>
              <span className="flex flex-1 flex-col px-7 pt-7 pb-9">
                <h3 className="font-display text-[clamp(1.125rem,1.35vw,1.625rem)] leading-[1.23] text-grape uppercase">
                  {r.title}
                </h3>
                <span className="mt-4 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] leading-[1.58] text-ink/80">
                  {r.desc}
                </span>
                <span className="mt-auto pt-10 font-display text-micro text-blush uppercase">
                  Download free ↓
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TrendingTags() {
  return (
    <section aria-labelledby="tags-title" className="shell">
      <h2
        id="tags-title"
        className="font-display text-[clamp(1rem,1.04vw,1.25rem)] text-blush uppercase"
      >
        Trending tags
      </h2>
      <ul data-reveal-stagger className="mt-6 flex flex-wrap gap-x-4 gap-y-6">
        {trendingTags.map((t, i) => (
          <li key={t.tag} className={i % 2 ? "rotate-2" : "-rotate-2"}>
            <Link
              href={`#tag-${t.tag}`}
              className={`inline-flex h-[clamp(2.75rem,3.125vw,3.75rem)] items-center rounded-full px-[clamp(1.125rem,1.46vw,1.75rem)] font-display text-[clamp(0.9375rem,1.146vw,1.375rem)] shadow-[0_8px_20px_rgb(34_1_40/0.12)] transition-transform hover:-translate-y-1 ${
                t.tone === "white" ? "bg-white text-ink" : toneFill[t.tone]
              }`}
            >
              #{t.tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
