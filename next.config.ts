import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Backward compatibility: redirect old nested routes to new top-level routes
      {
        source: '/dashboard/gigs/:path*',
        destination: '/gigs/:path*',
        permanent: true, // HTTP 308
      },
      {
        source: '/dashboard/profile/:path*',
        destination: '/profile/:path*',
        permanent: true, // HTTP 308
      },
    ]
  },
};

export default nextConfig;
