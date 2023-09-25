/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      buffer: false
    };
    return config;
  },
}

module.exports = nextConfig
