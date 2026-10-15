/**
 * Built-in copy for the home page's sections — the fallback when the CMS
 * (CMS_API_URL) isn't reachable. The CMS seeds its "Home" page from this.
 */
import { studioStats } from "@/lib/site-content";

export const homeHero = {
  lines: ["We Make", "Your Website", "Poppin’"],
};

export const homeStudio = {
  headline: "We’re A Funky Creative Studio",
  copy: "From strategy to execution, we offer a full suite of creative services designed to elevate your brand and captivate your audience.",
  badges: ["Strategy", "Branding", "Motion"],
  cta: { label: "Start a Project", href: "#contact" },
};

export const homeAgency = {
  eyebrow: "The Agency",
  heading: "Behind the Brands You Love",
  copy: "We don’t just take on clients; we build long-term digital partnerships. Here are a few of the visionary companies we are proud to collaborate with every single day.",
  cta: { label: "View Our Case Studies", href: "/work" },
};

export const homeContact = {
  eyebrow: "Let’s Build Something",
  headline: ["Extraordinary", "Together"],
  copy: "Whether you need a complete brand overhaul, a high-converting web experience, or a full-scale marketing campaign, our team of experts is ready to execute. Tell us about your goals, and let’s turn your vision into reality.",
  cta: { label: "Schedule a Strategy Call", href: "mailto:hello@pixelpopers.com" },
};

export const homeLeadership = {
  eyebrow: "Our Story",
  headline: "Three Friends. One Loud Idea.",
  story:
    "Pixel Popers started at a kitchen table with a simple belief: brands deserve to be felt, not just seen. Today we are a full-service crew of strategists, designers and developers who obsess over the details that make people stop scrolling — and keep coming back.",
  philosophy: "Strategy first. Craft always. Never boring.",
  stats: studioStats,
};

export const homeBlog = {
  eyebrow: "Fresh From The Studio",
  heading: "Ideas Worth Popping",
  intro: "Notes on branding, design and growth from the people who build them every day.",
  cta: { label: "View All Posts", href: "/blog" },
  featured_slugs: [
    "bold-brands-win-the-scroll",
    "interfaces-people-enjoy",
    "snack-bar-campaign-playbook",
    "motion-that-means-something",
  ],
};

export type HomeHero = typeof homeHero;
export type HomeStudio = typeof homeStudio;
export type HomeAgency = typeof homeAgency;
export type HomeContact = typeof homeContact;
export type HomeLeadership = typeof homeLeadership;
export type HomeBlog = typeof homeBlog;
