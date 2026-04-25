import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Optimization for VPS:
 * - output: 'standalone' reduces Docker image size and RAM usage.
 * - reactCompiler: enables the Next.js 15+ React compiler for better performance.
 */
const nextConfig: NextConfig = {
  output: 'standalone', 
  reactCompiler: true,
  cacheComponents: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  allowedDevOrigins: ['unseemly-squatter-carrousel.ngrok-free.dev', 'localhost:3000'],
};

export default nextConfig;

