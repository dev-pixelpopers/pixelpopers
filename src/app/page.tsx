"use client";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import AgencySection from "@/components/sections/AgencySection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import ProjectCarouselSection from "@/components/sections/ProjectCarouselSection";
import HeroBlob from "@/components/ui/HeroBlob";
import ServicesSection from "@/components/sections/ServicesSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StudioSection from "@/components/sections/StudioSection";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const HeroSectionMain = useRef<HTMLDivElement>(null);
  const blobImage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(blobImage.current, {
      opacity: 1,
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: HeroSectionMain.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
      },
    });

    tl.to(blobImage.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div ref={HeroSectionMain} className="relative isolate flex flex-col justify-center items-center w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[18%] -z-10 flex justify-center"
          >
            <Image
              src="/icons/hero-ellipse-glow.svg"
              alt=""
              width={2128}
              height={2128}
              className="w-[140%] max-w-none opacity-80 [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
            />
          </div>
          <div
            ref={blobImage}
            aria-hidden
            className="hero-blob-img pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
          >
            <HeroBlob />
          </div>
          <HeroSection />
          <ProjectCarouselSection />
        </div>
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
