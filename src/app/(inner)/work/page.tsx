import type { Metadata } from "next";

import Hero from "@/components/inner/work/Hero";
import ProjectBrowser from "@/components/inner/work/ProjectBrowser";
import Marquee from "@/components/inner/work/Marquee";
import WorkMotion from "@/components/inner/work/WorkMotion";
import { Clients, Cta, Impact, Intro, Teasers, Testimonials } from "@/components/inner/work/Sections";
import { getClients, getProjects, getQuotes, getSite, getWorkPage } from "@/lib/content";
import { workTestimonials } from "@/lib/pages/work";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWorkPage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/work" },
    openGraph: { title: seo.title, description: seo.description, type: "website", url: "/work", images: [seo.ogImage ?? DEFAULT_OG_IMAGE] },
  };
}

/*
  Work listing. Copy from the CMS (Pages → Work), case studies from Case
  studies, logos from Client logos; sections switched off there are left out.
*/
export default async function WorkPage() {
  const [{ seo, sections: s }, projects, clients, site, quotes] = await Promise.all([
    getWorkPage(),
    getProjects(),
    getClients(),
    getSite(),
    getQuotes(workTestimonials.items),
  ]);
  const url = site.site_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: `${url}/work`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${url}/work/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <WorkMotion className="flex flex-col pb-[clamp(5rem,9vw,10.875rem)]">
      {s.hero ? <Hero workHero={{ ...s.hero, count: s.hero.count || projects.length }} /> : null}
      <ProjectBrowser projects={projects} filters={s.filters?.items} />
      {s.intro ? (
        <div className="mt-[clamp(5rem,8.96vw,10.75rem)]">
          <Intro workIntro={s.intro} />
        </div>
      ) : null}
      {s.clients && clients.length ? (
        <div className="mt-[clamp(5rem,8.33vw,10rem)]">
          <Clients content={s.clients} clients={clients} />
        </div>
      ) : null}
      {s.impact ? (
        <div className="mt-[clamp(4rem,5.2vw,6.25rem)]">
          <Impact impact={s.impact} />
        </div>
      ) : null}
      {s.testimonials && quotes.length ? (
        <div className="mt-[clamp(5rem,8.33vw,10rem)]">
          <Testimonials workTestimonials={{ ...s.testimonials, items: quotes }} />
        </div>
      ) : null}
      {s.teasers ? (
        <div className="mt-[clamp(4rem,4.7vw,5.625rem)]">
          <Teasers teasers={s.teasers} />
        </div>
      ) : null}
      {s.marquees ? (
        <div className="mt-[clamp(2.5rem,3.125vw,3.75rem)]">
          <Marquee marquees={s.marquees} />
        </div>
      ) : null}
      {s.cta ? (
        <div className="mt-[clamp(4rem,7.3vw,8.75rem)]">
          <Cta workCta={s.cta} />
        </div>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </WorkMotion>
  );
}
