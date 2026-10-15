import Breadcrumb from "@/components/inner/Breadcrumb";
import PopButton from "@/components/ui/PopButton";
import type { ServiceDetail } from "@/lib/service-content";

/*
  Hero for a service added in the CMS, which has no bespoke concept page of
  its own (the six launch services each do — see ../registry.ts). Same
  structure as theirs (breadcrumb, three-line headline, intro, button) so
  ServicePageMotion animates it the same way, with a big letter card in the
  service's accent colour as the art. The long-form copy, packages, FAQs and
  CTA below are the shared blocks every service page uses.
*/

const CARD = {
  blush: "bg-blush text-white",
  grape: "bg-grape text-sunbeam",
  lagoon: "bg-lagoon text-white",
  sunbeam: "bg-sunbeam text-grape",
} as const;

export default function GenericSections({ service }: { service: ServiceDetail }) {
  const [l1, l2, ...rest] = service.heroLines.length ? service.heroLines : [service.name];
  const l3 = rest.join(" ");
  const card = CARD[service.accent] ?? CARD.blush;

  return (
    <div className="flex flex-col pb-[clamp(5rem,9.4vw,11.25rem)]">
      <section aria-labelledby="hero-title" className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[calc(100%+10rem)] bg-[radial-gradient(ellipse_32%_42%_at_18%_14%,rgb(242_119_147/0.28),transparent_72%),radial-gradient(ellipse_30%_38%_at_78%_52%,rgb(63_183_199/0.22),transparent_72%)]"
        />
        <div className="shell grid items-center gap-y-12 lg:grid-cols-[minmax(0,854fr)_minmax(0,734fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1.5rem,3.3vw,3.9rem)] uppercase">
              <span className="block font-display text-[clamp(3rem,6.77vw,8.125rem)] leading-[1.08] text-blush-ink">{l1}</span>
              {l2 ? <span className="block font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.2] tracking-[-0.05em] text-grape">{l2}</span> : null}
              {l3 ? <span className="block font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.28] text-lagoon-ink">{l3}</span> : null}
            </h1>
            {service.heroIntro ? (
              <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            ) : null}
            {service.heroCta ? (
              <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(2rem,3vw,3.625rem)] [&>span:last-child]:text-ink" />
            ) : null}
          </div>

          <div aria-hidden className="@container mx-auto w-full max-w-[34rem]">
            <div className={`grid aspect-square rotate-[4deg] place-items-center rounded-[8cqw] shadow-[0_24px_60px_rgb(34_1_40/0.18)] ${card}`}>
              <span className="font-pop text-[70cqw] leading-none uppercase">{service.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
