import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const target = process.env.API_BASE_URL;
    if (!target) return [];
    return [
      {
        source: '/api/v1/:path*',
        destination: `${target}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

