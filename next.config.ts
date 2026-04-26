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
  // Disable compiler in dev if memory is an issue; keep it true only if needed for specific React 19 features
  reactCompiler: false, 
  experimental: {
    // Disable file system cache for dev if RAM is limited
    turbopackFileSystemCacheForDev: false,
    optimizePackageImports: ['lucide-react', 'googleapis', 'googleapis-common'],
    serverActions: {
      allowedOrigins: ['unseemly-squatter-carrousel.ngrok-free.dev', 'localhost:3000', '192.168.137.1:3000'],
    },
  },
};

export default nextConfig;

