import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroFinal from "@/components/hero/HeroFinal";
import AgencyPicker from "@/components/sections/AgencyPicker";
import AgencySection from "@/components/sections/AgencySection";
import AgencyVersions from "@/components/sections/AgencyVersions";
import { toAgencyVersion } from "@/components/sections/agency-versions";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StudioSection from "@/components/sections/StudioSection";
import ProjectSlider from "@/components/slider/ProjectSlider";
export default async function Home({ searchParams }: PageProps<"/">) {
  // TEMPORARY: `?agency=` picks an Agency animation version to compare.
  const agency = toAgencyVersion((await searchParams).agency);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroFinal>
          <ProjectSlider />
        </HeroFinal>
        <StudioSection />
        <ServicesSection />
        <ShowcaseSection />
        {agency === "original" ? <AgencySection /> : <AgencyVersions version={agency} />}
        <ContactSection />
        <LeadershipSection />
        <BlogSection />
      </main>
      <SiteFooter />
      <AgencyPicker current={agency} />
    </div>
  );
}
