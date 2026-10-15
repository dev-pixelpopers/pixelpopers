import type { MetadataRoute } from "next";

import { getPosts, getProjects, getServiceDetails, getSite } from "@/lib/content";

/** /sitemap.xml — every page, including each service, case study and post (from the CMS when connected). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, services, projects, posts] = await Promise.all([getSite(), getServiceDetails(), getProjects(), getPosts()]);
  const base = site.site_url.replace(/\/$/, "");
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${base}${path}`,
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
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6)),
    ...posts.map((p) => ({ ...page(`/blog/${p.slug}`, 0.6), lastModified: new Date(`${p.date}T12:00:00Z`) })),
  ];
}
