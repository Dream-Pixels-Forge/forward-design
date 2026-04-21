/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable Partial Prerendering to avoid static error page generation bug
  experimental: {
    ppr: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    qualities: [90, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
