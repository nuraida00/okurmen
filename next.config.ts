import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Bundle all pages-router deps, then opt native packages out
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
