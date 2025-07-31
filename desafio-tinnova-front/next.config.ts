import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuração do servidor para aceitar conexões externas
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    }
  },
};

export default nextConfig;
