/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/api/proxy/:path*',
          destination: `${process.env.WP_API_URL}/:path*`,
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  