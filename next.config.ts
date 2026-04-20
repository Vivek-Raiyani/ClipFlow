import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;
