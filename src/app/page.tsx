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
import CubeEntryPicker from "@/components/ui/CubeEntryPicker";
import { toCubeEntry } from "@/components/ui/studio-cube-entries";

export default async function Home({ searchParams }: PageProps<"/">) {
  // TEMPORARY: `?cube=` picks a cube entrance to compare (see CubeEntryPicker).
  // Read on the server so every section renders in normal order.
  const cubeEntry = toCubeEntry((await searchParams).cube);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroFinal>
          <ProjectSlider foldIntoCube={cubeEntry === "v5"} />
        </HeroFinal>
        <StudioSection cubeEntry={cubeEntry} />
        <ServicesSection />
        <ShowcaseSection />
        <AgencySection />
        <ContactSection />
        <LeadershipSection />
        <BlogSection />
      </main>
      <SiteFooter />
      <CubeEntryPicker current={cubeEntry} />
    </div>
  );
}
