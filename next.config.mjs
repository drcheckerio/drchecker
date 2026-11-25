/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/bulk-checker',
        destination: '/bulk-dr-checker',
        permanent: true,
      },
      // The DR service page was removed for the Paddle appeal. This stays
      // inside drchecker.io and is intentionally TEMPORARY (307), not a 301,
      // so the destination can be changed later without browsers and search
      // engines having cached it.
      {
        source: '/increase-dr',
        destination: '/',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
