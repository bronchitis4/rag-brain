/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rag-brain/types', '@rag-brain/database'],
  reactStrictMode: false,
};

export default nextConfig;
