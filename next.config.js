/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com']
  },
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*' // Proxy to Backend
      }
    ]
  },
}

module.exports = nextConfig
