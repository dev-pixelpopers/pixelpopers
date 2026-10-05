import type { Metadata } from "next";
import Reveal from "@/components/inner/Reveal";
import Hero from "@/components/inner/services-overview/Hero";
import { LongFormSplit, Paragraphs, StatRow } from "@/components/inner/services-overview/LongForm";
import ServiceRows from "@/components/inner/services-overview/ServiceRows";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import {
  Closing,
  Comparison,
  Explained,
  Faq,
  Industries,
  Marquee,
  Models,
  StatsBand,
} from "@/components/inner/services-overview/Sections";
import { serviceDetails } from "@/lib/service-content";
import { serviceRows, servicesIntro, servicesMeta, servicesTestimonials } from "@/lib/pages/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
  alternates: { canonical: "/services" },
  openGraph: { title: servicesMeta.title, description: servicesMeta.description, type: "website", url: "/services" },
};

const SITE = "https://pixelpopers.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Pixel Popers services",
  description: servicesMeta.description,
  url: `${SITE}/services`,
  numberOfItems: serviceRows.length,
  itemListElement: serviceRows.map((row, i) => {
    const detail = serviceDetails.find((s) => s.slug === row.slug)!;
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: detail.name,
        serviceType: detail.name,
        description: row.explained,
        url: `${SITE}/services/${row.slug}`,
        provider: { "@type": "Organization", name: "Pixel Popers", url: SITE },
        areaServed: "Worldwide",
      },
    };
  }),
};

/** /services — Figma frame 332:21 "03 — Services". */
export default function ServicesPage() {
  return (
    <Reveal className="flex flex-col overflow-x-clip pb-[clamp(5rem,11.2vw,13.4rem)]">
      <Hero />
      <LongFormSplit
        id="intro-title"
        eyebrow={servicesIntro.eyebrow}
        heading={servicesIntro.heading}
        aside={<StatRow stats={servicesIntro.stats} />}
        className="mt-[clamp(4rem,7.4vw,8.875rem)]"
      >
        <Paragraphs items={servicesIntro.paragraphs} />
      </LongFormSplit>

      <div className="mt-[clamp(3.5rem,9.4vw,11.25rem)]">
        <ServiceRows />
      </div>

      <div className="mt-[clamp(3rem,9vw,10.5rem)]">
        <Marquee />
      </div>
      <div className="mt-[clamp(3rem,8.4vw,10rem)]">
        <Explained />
      </div>
      <div className="mt-[clamp(4.5rem,12.5vw,15rem)]">
        <Faq />
      </div>
      <div className="mt-[clamp(4.5rem,10.4vw,12.5rem)]">
        <Comparison />
      </div>
      <div className="mt-[clamp(4rem,4.2vw,5rem)]">
        <Industries />
      </div>
      <div className="mt-[clamp(4.5rem,13vw,16rem)]">
        <Models />
      </div>
      <div className="mt-[clamp(3rem,6.25vw,7.5rem)]">
        <StatsBand />
      </div>
      <div className="mt-[clamp(3.5rem,5.2vw,6.25rem)]">
        <QuoteCards
          id="testimonials-title"
          eyebrow={servicesTestimonials.eyebrow}
          heading={servicesTestimonials.heading}
          items={servicesTestimonials.items}
        />
      </div>
      <div className="mt-[clamp(4.5rem,15vw,18rem)]">
        <Closing />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Reveal>
  );
}
