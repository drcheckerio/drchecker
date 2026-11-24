/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/bulk-checker',
        destination: '/bulk-dr-checker',
        permanent: true,
      },
      // DR improvement services moved off this domain; drchecker.io is the SaaS tool only.
      {
        source: '/increase-dr',
        destination: 'https://buybacklinks.ai/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
