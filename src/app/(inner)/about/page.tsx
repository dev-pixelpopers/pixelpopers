import type { Metadata } from "next";

import AboutMotion from "@/components/inner/about/AboutMotion";
import Hero from "@/components/inner/about/Hero";
import Story from "@/components/inner/about/Story";
import { Audience, LongFormSplit } from "@/components/inner/about/LongForm";
import Values from "@/components/inner/about/Values";
import Process from "@/components/inner/about/Process";
import Journey from "@/components/inner/about/Journey";
import Testimonials from "@/components/inner/about/Testimonials";
import Studio from "@/components/inner/about/Studio";
import Closing from "@/components/inner/about/Closing";
import { getAbout, getQuotes, getSite, getTeam } from "@/lib/content";
import { testimonials as staticTestimonials } from "@/lib/pages/about";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAbout();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/about" },
    openGraph: { title: seo.title, description: seo.description, type: "website", url: "/about", images: [seo.ogImage ?? DEFAULT_OG_IMAGE] },
  };
}

/*
  About page (Figma frame 330:21). Every section's copy comes from the CMS
  (Pages → About), falling back to the built-in copy; a section switched off
  there is left out.
*/
export default async function AboutPage() {
  const [{ seo, sections: s }, team, site, quotes] = await Promise.all([
    getAbout(),
    getTeam(),
    getSite(),
    getQuotes(staticTestimonials.items),
  ]);
  const url = site.site_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: seo.title,
    description: seo.description,
    url: `${url}/about`,
    mainEntity: {
      "@type": "Organization",
      name: site.site_name,
      url,
      logo: `${url}/assets/logo-pixelpopers.png`,
      description: site.site_description,
      foundingDate: "2019",
      slogan: "Strategy first. Craft always. Never boring.",
      founders: team.owners.map((o) => ({ "@type": "Person", name: o.name, jobTitle: o.role })),
    },
  };

  return (
    <AboutMotion className="flex flex-col pb-[clamp(5rem,11vw,13.25rem)]">
      {s.hero ? <Hero aboutHero={s.hero} /> : null}
      {s.story ? <Story aboutStory={s.story} owners={team.owners} /> : null}
      {s.full_story ? (
        <LongFormSplit
          id="full-story-title"
          eyebrow={s.full_story.eyebrow}
          heading={s.full_story.heading}
          paragraphs={s.full_story.paragraphs}
          stats={s.full_story.stats}
          className="mt-[clamp(5rem,8.33vw,10rem)]"
        />
      ) : null}
      {s.values ? (
        <div className="mt-[clamp(5rem,9.4vw,11.25rem)]">
          <Values values={s.values.items} inPractice={s.in_practice ?? undefined} hidePractice={!s.in_practice} />
        </div>
      ) : null}
      {s.how_we_work ? (
        <div className="mt-[clamp(5rem,10.9vw,13.125rem)]">
          <Process howWeWork={s.how_we_work} />
        </div>
      ) : null}
      {s.audience ? (
        <div className="mt-[clamp(5rem,8.33vw,10rem)]">
          <Audience audience={s.audience} />
        </div>
      ) : null}
      {s.journey ? (
        <div className="mt-[clamp(5rem,8.33vw,10rem)]">
          <Journey journey={s.journey} />
        </div>
      ) : null}
      {s.testimonials && quotes.length ? (
        <div className="mt-[clamp(4.5rem,6.46vw,7.75rem)]">
          <Testimonials testimonials={{ ...s.testimonials, items: quotes }} />
        </div>
      ) : null}
      {s.perks || s.hiring ? (
        <div className="mt-[clamp(4.5rem,4.7vw,5.625rem)]">
          <Studio perks={s.perks ?? undefined} hiring={s.hiring ?? undefined} showPerks={!!s.perks} showHiring={!!s.hiring} />
        </div>
      ) : null}
      {s.cta ? (
        <div className="mt-[clamp(5rem,11.5vw,13.75rem)]">
          <Closing aboutCta={s.cta} />
        </div>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </AboutMotion>
  );
}
