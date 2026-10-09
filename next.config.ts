import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smallest), WebP as the fallback for older browsers.
    formats: ["image/avif", "image/webp"],
    // Optimised images are content-addressed by query, so cache them for a month.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
