import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  analytics: {
    webVitalsAttribution: ['CLS', 'FID', 'LCP'],
  },
};

export default nextConfig;
