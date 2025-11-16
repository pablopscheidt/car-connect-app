import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.car-connect.pablopscheidt.dev',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
