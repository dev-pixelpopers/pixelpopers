import type { NextConfig } from "next";

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
  },
};

export default nextConfig;
