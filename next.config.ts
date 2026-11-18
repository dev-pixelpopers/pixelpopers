import type { NextConfig } from "next";

// Images uploaded in the CMS are served from its own domain (/storage/…).
const cmsHost = (() => {
  try {
    return process.env.CMS_API_URL ? new URL(process.env.CMS_API_URL) : null;
  } catch {
    return null;
  }
})();

/** The one address the site should be indexed under. */
const CANONICAL_HOST = "www.pixelpopers.com";

/**
 * Other addresses that have served (or could serve) this site and must hand
 * their traffic — and their search rankings — to the canonical host with a
 * permanent redirect: the production *.vercel.app alias, the bare domain, and
 * the old backend.pixelpopers.com address Google indexed.
 */
const LEGACY_HOSTS = ["pixelpopers.vercel.app", "pixelpopers.com", "backend.pixelpopers.com"];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: `^${host.replace(/\./g, "\\.")}$` }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    }));
  },
  // Any other *.vercel.app address (preview deployments) stays reachable for
  // review but is kept out of search results.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // No `experimental.inlineCss`: it put the whole Tailwind stylesheet (~240KB)
  // into every page twice — once in a <style> tag and again inside the React
  // payload — so ~70% of each HTML file was CSS (the audit's "low text-HTML
  // ratio") and the main thread had to parse it all on every navigation. As a
  // normal stylesheet it is one cached request shared by every page.
  images: {
    // AVIF first (smallest), WebP as the fallback for older browsers.
    formats: ["image/avif", "image/webp"],
    // Optimised images are content-addressed by query, so cache them for a month.
    minimumCacheTTL: 2678400,
    // In development the CMS runs on 127.0.0.1, which the optimiser refuses by default.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: cmsHost
      ? [
          {
            protocol: cmsHost.protocol.replace(":", "") as "http" | "https",
            hostname: cmsHost.hostname,
            ...(cmsHost.port ? { port: cmsHost.port } : {}),
            pathname: "/storage/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
