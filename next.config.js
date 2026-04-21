/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles output automatically
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
