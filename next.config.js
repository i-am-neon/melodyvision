/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes packages that depend on fs/module module
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        os: false,
        stream: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;