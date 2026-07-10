/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/bulk-checker',
        destination: '/bulk-dr-checker',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
