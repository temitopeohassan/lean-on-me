/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ✅ Force Webpack
  experimental: {
    turbo: {
      rules: {},
    },
  },
  webpack: (config) => config,
};

export default nextConfig;
