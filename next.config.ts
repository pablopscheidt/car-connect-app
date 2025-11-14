import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
