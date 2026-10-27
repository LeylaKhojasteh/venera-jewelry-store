import 'server-only';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

export async function clientIp(): Promise<string> {
  const store = await headers();
  const forwarded = store.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return store.get('x-real-ip')?.trim() || '127.0.0.1';
}

export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(`${ip}:${process.env.AUTH_SECRET ?? 'dev'}`)
    .digest('hex')
    .slice(0, 40);
}

/** Only same-origin relative paths are accepted as a post-login destination. */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  return value;
}
