/** @type {import('next').NextConfig} */
const nextConfig = {
  // Usa 'standalone' apenas quando NEXT_OUTPUT_STANDALONE=true (para VPS/Docker)
  // Na Vercel, não define output para usar o modo padrão
  ...(process.env.NEXT_OUTPUT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
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
