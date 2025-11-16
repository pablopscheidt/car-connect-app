import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['api.car-connect.pablopscheidt.dev'],
  },
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
