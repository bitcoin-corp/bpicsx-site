import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Gallery images come from our own /img/<id> proxy (unoptimized), so Cloudflare scans the original bytes.
    // No remote patterns: nothing is loaded from ordfs.network in the browser.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    }];
  },
};

export default nextConfig;
