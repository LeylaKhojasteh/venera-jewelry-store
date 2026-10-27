import 'server-only';

/**
 * Central, typed access to the environment. Server-only: importing this from a
 * client component is a build error, which keeps secrets out of the browser.
 */
function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  authSecret: process.env.AUTH_SECRET ?? '',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  shippingFlat: intFromEnv('SHIPPING_FLAT_TOMAN', 45_000),
  freeShippingThreshold: intFromEnv('FREE_SHIPPING_THRESHOLD_TOMAN', 5_000_000),
} as const;

export function assertAuthSecret(): string {
  if (!env.authSecret || env.authSecret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or shorter than 32 characters. Set it in .env (openssl rand -base64 32).',
    );
  }
  return env.authSecret;
}
