import type { NextConfig } from "next";

// Images uploaded in the CMS are served from its own domain (/storage/…).
const cmsHost = (() => {
  try {
    return process.env.CMS_API_URL ? new URL(process.env.CMS_API_URL) : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // Tailwind's CSS is small and atomic: shipped inline in the <head> it
    // stops being a render-blocking request (~850ms on a throttled phone).
    inlineCss: true,
  },
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
