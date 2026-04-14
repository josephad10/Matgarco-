/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },
  async headers() {
    return [
      {
        // Allow the dashboard (port 3002) to embed preview iframes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3002 http://localhost:5173 https://*.matgarco.com",
          },
          // Remove the default X-Frame-Options for store pages
          // so the CSP frame-ancestors directive takes precedence
        ],
      },
    ];
  },
};

module.exports = nextConfig;
