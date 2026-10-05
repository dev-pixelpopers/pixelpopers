import type { Metadata } from "next";
import Reveal from "@/components/inner/Reveal";
import Intro from "@/components/inner/contact/Intro";
import { AfterSend, Channels, ChatFaq, NextSteps, WhereWhen } from "@/components/inner/contact/Sections";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import { CONTACT_EMAIL, contactMeta, contactTestimonials } from "@/lib/pages/contact";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  alternates: { canonical: "/contact" },
  openGraph: { title: contactMeta.title, description: contactMeta.description, type: "website", url: "/contact" },
};

const SITE = "https://pixelpopers.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: contactMeta.title,
  description: contactMeta.description,
  url: `${SITE}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "Pixel Popers",
    url: SITE,
    logo: `${SITE}/assets/logo-pixelpopers.png`,
    email: CONTACT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT_EMAIL,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  },
};

/** /contact — Figma frame 337:21 "08 — Contact". */
export default function ContactPage() {
  return (
    <Reveal className="flex flex-col overflow-x-clip pb-[clamp(4rem,6vw,7rem)]">
      <Intro />
      <div className="mt-[clamp(4rem,8.33vw,10rem)]">
        <NextSteps />
      </div>
      <div className="mt-[clamp(4rem,8.33vw,10rem)]">
        <Channels />
      </div>
      <div className="mt-[clamp(4rem,8.85vw,10.625rem)]">
        <ChatFaq />
      </div>
      <div className="mt-[clamp(4rem,8.85vw,10.625rem)]">
        <AfterSend />
      </div>
      <div className="mt-[clamp(4rem,8.33vw,10rem)]">
        <WhereWhen />
      </div>
      <div className="mt-[clamp(4rem,8.33vw,10rem)]">
        <QuoteCards
          id="testimonials-title"
          eyebrow={contactTestimonials.eyebrow}
          heading={contactTestimonials.heading}
          items={contactTestimonials.items}
        />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Reveal>
  );
}
