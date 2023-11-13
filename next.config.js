/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActionsBodySizeLimit: '4.5mb' // 4.5mb is vercel's limit for uploading files, idk how to overcome it yet
  },

  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
}

module.exports = nextConfig
