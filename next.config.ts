import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const productionHeaders = [
  ...securityHeaders,
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {
    serverActions: { bodySizeLimit: '6mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 375, 430, 640, 768, 1024, 1280, 1440, 1920, 2400],
    imageSizes: [96, 128, 200, 256, 320, 400, 512],
  },
  async redirects() {
    return [
      { source: '/products/necklace-avid', destination: '/products/necklace-drop', permanent: true },
      { source: '/products/necklace-mahtab', destination: '/products/necklace-pearl', permanent: true },
      { source: '/products/necklace-arka', destination: '/products/necklace-minimal', permanent: true },
      { source: '/products/necklace-nilo', destination: '/products/necklace-flower', permanent: true },
      { source: '/products/bracelet-celine', destination: '/products/bracelet-spiral-silver', permanent: true },
      { source: '/products/bracelet-ares', destination: '/products/bracelet-triple-ring', permanent: true },
      { source: '/products/bracelet-nova', destination: '/products/bracelet-silver-simple', permanent: true },
      { source: '/products/earrings-alara', destination: '/products/earrings-clear-flower', permanent: true },
      { source: '/products/earrings-livora', destination: '/products/earrings-lotus', permanent: true },
      { source: '/products/ring-roja', destination: '/products/ring-turquoise', permanent: true },
      { source: '/products/ring-diyar', destination: '/products/ring-royal-double', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: process.env.NODE_ENV === 'production' ? productionHeaders : securityHeaders,
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
