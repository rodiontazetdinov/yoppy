import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  eslint: {
    // Предупреждения ESLint не будут считаться ошибками при сборке
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ошибки типизации не будут считаться ошибками при сборке
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
