import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroFinal from "@/components/hero/HeroFinal";
import AgencySection from "@/components/sections/AgencySection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StudioSection from "@/components/sections/StudioSection";
import ProjectSlider from "@/components/slider/ProjectSlider";
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
        <ShowcaseSection />
        <AgencySection />
        <ContactSection />
        <LeadershipSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </div>
  );
}
