import type { NextConfig } from 'next';

const config: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...(process.env.WORDPRESS_MEDIA_HOST ? [{ protocol: 'https' as const, hostname: process.env.WORDPRESS_MEDIA_HOST }] : []),
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
export default config;