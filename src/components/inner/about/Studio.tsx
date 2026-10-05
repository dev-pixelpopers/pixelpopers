import PopButton from "@/components/ui/PopButton";
import { hiring, perks } from "@/lib/pages/about";

const layer = "col-start-1 row-start-1";

/** "Life at the studio" perks and the pink "We're hiring" band. */
export default function Studio() {
  return (
    <>
      <section id="studio" aria-labelledby="perks-title" className="shell scroll-mt-8">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{perks.eyebrow}</p>
          <h2 id="perks-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
            {perks.heading}
          </h2>
        </div>
        <ul data-reveal-stagger className="mt-[clamp(2rem,3.96vw,4.75rem)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.items.map((p) => (
            <li key={p.title} className="flex min-h-[clamp(14rem,15.6vw,18.75rem)] flex-col rounded-[28px] border border-white bg-white/75 p-7">
              <span aria-hidden className={`grid size-[4.5rem] place-items-center rounded-full font-pop text-[3.5rem] leading-none ${p.dot}`}>
                P
              </span>
              <h3 className="mt-7 font-display text-[clamp(1.25rem,1.35vw,1.625rem)] leading-tight text-grape uppercase">{p.title}</h3>
              <p className="mt-3 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] leading-[1.58] text-ink/80">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mt-[clamp(4rem,5.2vw,6.25rem)] w-full max-w-[1920px] px-[clamp(1.25rem,6.25vw,7.5rem)]">
        <section
          id="careers"
          aria-labelledby="hiring-title"
          data-reveal
          className="grid scroll-mt-8 overflow-hidden rounded-[clamp(2rem,2.5vw,3rem)] bg-blush text-white shadow-[0_20px_50px_rgb(0_0_0/0.13)]"
        >
          <span
            aria-hidden
            className={`${layer} -mt-[12%] mr-[4.4%] hidden h-0 self-start justify-self-end font-pop text-[clamp(20rem,39.6vw,47.5rem)] leading-none text-white/[0.18] select-none sm:block`}
          >
            P
          </span>
          <div className={`${layer} p-[clamp(1.75rem,4.17vw,5rem)] pt-[clamp(2rem,3.65vw,4.375rem)] pb-[clamp(2rem,2.5vw,3rem)]`}>
            <p className="font-display text-nav uppercase">{hiring.eyebrow}</p>
            <h2 id="hiring-title" className="mt-3 font-display text-[clamp(2.5rem,5vw,6rem)] leading-[1.27] uppercase">
              {hiring.heading}
            </h2>
            <ul aria-label="Open roles" className="mt-[clamp(0.75rem,0.9vw,1.125rem)] flex flex-wrap gap-3">
              {hiring.roles.map((r) => (
                <li key={r} className="rounded-full bg-white px-6 py-3 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-none font-medium text-ink">
                  {r}
                </li>
              ))}
            </ul>
            <PopButton href={hiring.cta.href} label={hiring.cta.label} className="mt-6 [&>span:last-child]:text-ink" />
          </div>
        </section>
      </div>
    </>
  );
}
