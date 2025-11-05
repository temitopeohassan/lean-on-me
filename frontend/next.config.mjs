/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude recharts from SSR bundle
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        recharts: "commonjs recharts",
      })
    }
    return config
  },
}

export default nextConfig
