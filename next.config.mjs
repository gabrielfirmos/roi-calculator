/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        // Add headers for all pages to enforce light mode
        source: '/:path*',
        headers: [
          { key: 'Color-Scheme', value: 'light' },  // Changed from 'dark' to 'light'
          { key: 'Forced-Colors', value: 'none' },
          { key: 'Supported-Color-Schemes', value: 'light' },  // Added to explicitly support light mode
        ],
      },
    ];
  },
  // Add compiler options to help with light mode enforcement
  compiler: {
    removeConsole: false,
    styledComponents: true,
  }
};

export default nextConfig;