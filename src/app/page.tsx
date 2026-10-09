import type { Metadata } from "next";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroFinal from "@/components/hero/HeroFinal";
import AgencySection from "@/components/sections/AgencySection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import ServicesSection from "@/components/sections/ServicesSection";
// import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StudioSection from "@/components/sections/StudioSection";
import ProjectSlider from "@/components/slider/ProjectSlider";
import { owners } from "@/lib/site-content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Organization + WebSite structured data for the home page. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/logo-pixelpopers.png`,
      description: SITE_DESCRIPTION,
      email: "hello@pixelpopers.com",
      foundingDate: "2019",
      founders: owners.map((o) => ({ "@type": "Person", name: o.name, jobTitle: o.role })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroFinal>
          <ProjectSlider />
        </HeroFinal>
        <StudioSection />
        <ServicesSection />
        {/* <ShowcaseSection /> */}
        <AgencySection />
        <ContactSection />
        <LeadershipSection />
        <BlogSection />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
