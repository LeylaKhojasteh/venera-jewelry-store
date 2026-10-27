import 'server-only';

type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    const live = bucket.hits.filter((t) => now - t < 15 * 60_000);
    if (live.length === 0) buckets.delete(key);
    else bucket.hits = live;
  }
}

/**
 * Small in-process fixed-window limiter. It is deliberately dependency-free and
 * sufficient for a single-instance demo; production should move this to a shared
 * store (Upstash Redis / Vercel KV) so limits apply across serverless instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key) ?? { hits: [] };
  const hits = bucket.hits.filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - hits[0]!)) / 1000));
    bucket.hits = hits;
    buckets.set(key, bucket);
    return { ok: false, retryAfter };
  }
  hits.push(now);
  bucket.hits = hits;
  buckets.set(key, bucket);
  return { ok: true, retryAfter: 0 };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
