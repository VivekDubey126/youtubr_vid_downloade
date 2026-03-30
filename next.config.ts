import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['10.145.58.229'],
};

export default nextConfig;
