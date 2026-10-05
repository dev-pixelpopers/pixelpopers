import type { ComponentType } from "react";
import type { Package, ServiceDetail, ServiceSlug } from "@/lib/service-content";

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

export type ServiceConcept = {
  /** Hero + the page's own concept sections (everything above the long-form copy). */
  Sections: ComponentType<{ service: ServiceDetail }>;
  /** Package card styled to the page's concept. */
  PackageCard: ComponentType<{ pkg: Package; index: number }>;
  /** The concept section already shows the process (hover/tap cards), so the long-form skips it. */
  processInConcept?: boolean;
  /** Page background, when it differs from the site cream. */
  pageClassName?: string;
};

export const serviceConcepts: Record<ServiceSlug, ServiceConcept> = {
  "brand-identity": { Sections: BrandSections, PackageCard: BrandPackage, processInConcept: true },
  "ui-ux-design": { Sections: UiuxSections, PackageCard: UiuxPackage, processInConcept: true, pageClassName: "bg-paper" },
  "digital-marketing": { Sections: MarketingSections, PackageCard: MarketingPackage, processInConcept: true },
  "web-development": { Sections: WebSections, PackageCard: WebPackage },
  "motion-graphic": { Sections: MotionSections, PackageCard: MotionPackage },
  "content-writing": { Sections: ContentSections, PackageCard: ContentPackage },
};
