import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.reapermini.com',
      },
      {
        protocol: 'https',
        hostname: 'www.reapermini.com',
      },
      {
        protocol: 'https',
        hostname: 'images.reapermini.com',
      },
    ],
  },
};

export default nextConfig;
