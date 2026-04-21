import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rag-brain/types', '@rag-brain/database'],
  reactStrictMode: true,
};

export default nextConfig;
