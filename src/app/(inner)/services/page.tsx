import type { Metadata } from "next";

import Hero from "@/components/inner/services-overview/Hero";
import { LongFormSplit, Paragraphs, StatRow } from "@/components/inner/services-overview/LongForm";
import ServiceRows from "@/components/inner/services-overview/ServiceRows";
import Marquee from "@/components/inner/services-overview/Marquee";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import ServicesMotion from "@/components/inner/services-overview/ServicesMotion";
import {
  Closing,
  Comparison,
  Explained,
  Faq,
  Industries,
  Models,
  StatsBand,
} from "@/components/inner/services-overview/Sections";
import { getQuotes, getServiceDetails, getServicesPage, getSite, assertPagePublished } from "@/lib/content";
import { servicesTestimonials } from "@/lib/pages/services";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getServicesPage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: { title: seo.title, description: seo.description, type: "website", url: "/services", images: [seo.ogImage ?? DEFAULT_OG_IMAGE] },
  };
}

/*
  Services overview. Copy comes from the CMS (Pages → Services) and the
  service names/links from Services; sections switched off there are left out.
*/
export default async function ServicesPage() {
  await assertPagePublished("services");
  const [{ seo, sections: s }, details, site, quotes] = await Promise.all([
    getServicesPage(),
    getServiceDetails(),
    getSite(),
    getQuotes(servicesTestimonials.items),
  ]);
  const url = site.site_url;
  const rows = s.rows?.items ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.site_name} services`,
    description: seo.description,
    url: `${url}/services`,
    numberOfItems: rows.length,
    itemListElement: rows.flatMap((row, i) => {
      const detail = details.find((d) => d.slug === row.slug);
      return detail
        ? [{
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: detail.name,
              serviceType: detail.name,
              description: row.explained,
              url: `${url}/services/${row.slug}`,
              provider: { "@type": "Organization", name: site.site_name, url },
              areaServed: "Worldwide",
            },
          }]
        : [];
    }),
  };

  return (
    <ServicesMotion className="flex flex-col overflow-x-clip pb-[clamp(5rem,11.2vw,13.4rem)]">
      {s.hero ? <Hero servicesHero={s.hero} /> : null}
      {s.intro ? (
        <LongFormSplit
          id="intro-title"
          eyebrow={s.intro.eyebrow}
          heading={s.intro.heading}
          aside={<StatRow stats={s.intro.stats} />}
          className="mt-[clamp(4rem,7.4vw,8.875rem)]"
        >
          <Paragraphs items={s.intro.paragraphs} />
        </LongFormSplit>
      ) : null}
      {s.rows ? (
        <div className="mt-[clamp(3.5rem,9.4vw,11.25rem)]">
          <ServiceRows serviceRows={s.rows.items} serviceDetails={details} />
        </div>
      ) : null}
      {s.marquee ? (
        <div className="mt-[clamp(3rem,9vw,10.5rem)]">
          <Marquee marquee={s.marquee} />
        </div>
      ) : null}
      {s.explained ? (
        <div className="mt-[clamp(3rem,8.4vw,10rem)]">
          <Explained explained={s.explained} serviceRows={rows} serviceDetails={details} />
        </div>
      ) : null}
      {s.faq ? (
        <div className="mt-[clamp(4.5rem,12.5vw,15rem)]">
          <Faq servicesFaq={s.faq} />
        </div>
      ) : null}
      {s.comparison ? (
        <div className="mt-[clamp(4.5rem,10.4vw,12.5rem)]">
          <Comparison comparison={s.comparison} />
        </div>
      ) : null}
      {s.industries ? (
        <div className="mt-[clamp(4rem,4.2vw,5rem)]">
          <Industries industries={s.industries} />
        </div>
      ) : null}
      {s.models ? (
        <div className="mt-[clamp(4.5rem,13vw,16rem)]">
          <Models models={s.models} />
        </div>
      ) : null}
      {s.stats ? (
        <div className="mt-[clamp(3rem,6.25vw,7.5rem)]">
          <StatsBand servicesStats={s.stats.items} />
        </div>
      ) : null}
      {s.testimonials && quotes.length ? (
        <div className="mt-[clamp(3.5rem,5.2vw,6.25rem)]">
          <QuoteCards id="testimonials-title" eyebrow={s.testimonials.eyebrow} heading={s.testimonials.heading} items={quotes} />
        </div>
      ) : null}
      {s.cta ? (
        <div className="mt-[clamp(4.5rem,15vw,18rem)]">
          <Closing servicesCta={s.cta} />
        </div>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </ServicesMotion>
  );
}
