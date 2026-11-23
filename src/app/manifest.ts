import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** /manifest.webmanifest — name, colours and icon for "add to home screen" (icons from Site settings). */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite();
  const icon = site.apple_touch_icon || site.favicon;
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffe5d7",
    theme_color: "#ffe5d7",
    icons: icon
      ? [{ src: icon, sizes: "any" }]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
  };
}
