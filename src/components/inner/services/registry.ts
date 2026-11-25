import type { ComponentType } from "react";
import type { Package, ServiceDetail, ServiceSlug } from "@/lib/service-content";
import type { PackageLabels } from "@/lib/service-headings";

import BrandSections from "./brand-identity/Sections";
import BrandPackage from "./brand-identity/PackageCard";
import UiuxSections from "./ui-ux-design/Sections";
import UiuxPackage from "./ui-ux-design/PackageCard";
import MarketingSections from "./digital-marketing/Sections";
import MarketingPackage from "./digital-marketing/PackageCard";
import WebSections from "./web-development/Sections";
import WebPackage from "./web-development/PackageCard";
import MotionSections from "./motion-graphic/Sections";
import MotionPackage from "./motion-graphic/PackageCard";
import ContentSections from "./content-writing/Sections";
import ContentPackage from "./content-writing/PackageCard";
import MobileSections from "./mobile-app-development/Sections";
import MobilePackage from "./mobile-app-development/PackageCard";
import MobileIncluded from "./mobile-app-development/Included";
import GenericSections from "./generic/Sections";

export type ServiceConcept = {
  /** Hero + the page's own concept sections (everything above the long-form copy). */
  Sections: ComponentType<{ service: ServiceDetail }>;
  /** Package card styled to the page's concept. */
  PackageCard: ComponentType<{ pkg: Package; index: number; labels?: PackageLabels }>;
  /** The concept section already shows the process (hover/tap cards), so the long-form skips it. */
  processInConcept?: boolean;
  /** The page's own "What's included" design, in place of the standard cards. */
  Included?: ComponentType<{ service: ServiceDetail }>;
  /** Page background, when it differs from the site cream. */
  pageClassName?: string;
};

/**
 * Services with a bespoke concept page. Mobile App Development is CMS-only
 * content (seeded by backend MobileAppDevelopmentSeeder), so it isn't one of
 * the static ServiceSlugs.
 */
export const serviceConcepts: Record<ServiceSlug | "mobile-app-development", ServiceConcept> = {
  "brand-identity": { Sections: BrandSections, PackageCard: BrandPackage, processInConcept: true },
  "ui-ux-design": { Sections: UiuxSections, PackageCard: UiuxPackage, processInConcept: true, pageClassName: "bg-paper" },
  "digital-marketing": { Sections: MarketingSections, PackageCard: MarketingPackage, processInConcept: true },
  "web-development": { Sections: WebSections, PackageCard: WebPackage },
  "motion-graphic": { Sections: MotionSections, PackageCard: MotionPackage },
  "content-writing": { Sections: ContentSections, PackageCard: ContentPackage },
  "mobile-app-development": { Sections: MobileSections, PackageCard: MobilePackage, Included: MobileIncluded, processInConcept: true },
};

/**
 * A service added in the CMS has no bespoke concept: it gets the generic hero
 * and the brand-identity package card, with every shared block below.
 */
const genericConcept: ServiceConcept = { Sections: GenericSections, PackageCard: BrandPackage };

export function conceptFor(slug: string): ServiceConcept {
  return serviceConcepts[slug as keyof typeof serviceConcepts] ?? genericConcept;
}
