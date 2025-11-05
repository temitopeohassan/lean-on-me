/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack to use webpack (required for recharts SSR exclusion)
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Exclude recharts from SSR bundle
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push("recharts")
    }
    return config
  },
}

export default nextConfig
