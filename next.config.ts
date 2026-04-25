import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  allowedDevOrigins: ['unseemly-squatter-carrousel.ngrok-free.dev', 'localhost:3000'],
};

export default nextConfig;
