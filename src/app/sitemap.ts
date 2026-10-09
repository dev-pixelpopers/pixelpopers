import type { MetadataRoute } from "next";

import { posts } from "@/lib/pages/blog";
import { projects } from "@/lib/pages/work";
import { serviceDetails } from "@/lib/service-content";
import { SITE_URL } from "@/lib/site";

/** /sitemap.xml — every page, including each service, case study and post. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    page("/work", 0.9, "weekly"),
    page("/about", 0.7),
    page("/blog", 0.8, "weekly"),
    page("/contact", 0.7),
    ...serviceDetails.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6)),
    ...posts.map((p) => ({ ...page(`/blog/${p.slug}`, 0.6), lastModified: new Date(`${p.date}T12:00:00Z`) })),
  ];
}
