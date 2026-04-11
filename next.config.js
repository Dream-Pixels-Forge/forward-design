/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [90, 50, 75, 100],
    remotePatterns: [],
  },
  output: 'standalone',
}

module.exports = nextConfig
