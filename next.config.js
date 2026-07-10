/** @type {import('next').NextConfig} */
const nextConfig = {
  // Na Vercel (onde VERCEL=1), não define output para usar o modo padrão.
  // Em outros ambientes (VPS, Docker, Easypanel), usa o modo standalone.
  output: process.env.VERCEL === '1' ? undefined : 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: '/legacy-uploads/:path*',
      },
    ];
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
    serverComponentsExternalPackages: ["@vercel/blob"],
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
    outputFileTracingExcludes: {
      '*': ['public/uploads/**/*']
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
