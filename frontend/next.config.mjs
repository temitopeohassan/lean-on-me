/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // ✅ Force Next.js to use Webpack instead of Turbopack
  experimental: {
    turbo: false,
  },

  webpack: (config) => {
    // No externals, no custom overrides — keep it simple
    return config;
  },
};

export default nextConfig;
