import { overlayCopy } from "@/components/inner/service/page-copy";
import type { ServiceDetail } from "@/lib/service-content";

/*
  Headings and small print of the shared blocks on every service page (the
  long copy, packages, FAQs, more services and closing call to action),
  editable per service in the CMS (Services → <service> → Section headings,
  stored in `service.headings`). Empty fields keep these defaults; the
  backend shows the same words as placeholders
  (backend/app/Filament/Support/ServiceHeadings.php).
*/
export const SERVICE_HEADINGS = {
  tools: "Tools we love",
  included: { eyebrow: "What's included", heading: "Everything in the box" },
  process: { eyebrow: "Step by step", heading: "How the work gets done" },
  audience: { eyebrow: "Who it's for", heading: "Made for brands like yours" },
  insights: { eyebrow: "Good to know", heading: "The short guide" },
  packages: {
    eyebrow: "Pick your pop",
    heading: "Packages",
    note: "Prices are starting points — every project gets a fixed quote after a free 30-minute call.",
    button: "Get a quote",
    popular: "Most popular",
    price: "Price",
    timeline: "Timeline",
  },
  faqs: { eyebrow: "Good questions", heading: "Asked &\nanswered" },
  more: { heading: "More ways to pop" },
  cta: {
    eyebrow: "Ready to pop?",
    lead: "Let's talk",
    text: "Tell us where you are and where you want to be — we reply within a day with next steps.",
  },
};

export type ServiceHeadings = typeof SERVICE_HEADINGS;
/** Words on a package card (its button, "most popular" badge and stat labels). */
export type PackageLabels = ServiceHeadings["packages"];

export function serviceHeadings(service: Pick<ServiceDetail, "headings">): ServiceHeadings {
  return overlayCopy(SERVICE_HEADINGS, service.headings ?? {});
}
