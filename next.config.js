/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb'
    }
  },

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
  // reactStrictMode: false
}

module.exports = nextConfig
