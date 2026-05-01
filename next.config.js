/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
    serverComponentsExternalPackages: ["@vercel/blob"]
  }
}



module.exports = nextConfig
