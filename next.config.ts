import type { NextConfig } from "next";

const isStaticBuild = process.env.BUILD_TYPE === 'static';

const nextConfig: NextConfig = {
  // Turbopack is disabled - using system fonts
  // This config can be extended as needed
  images: {
    unoptimized: true,
  },
  experimental: {

  },
};

if (isStaticBuild) {
  nextConfig.output = 'export';
  nextConfig.trailingSlash = true;
}

export default nextConfig;

