import 'server-only';
import { env } from '@/lib/env';
import { cartTotals } from '@/lib/money';

/** Single source of truth for the demo checkout economics (server-side). */
export function totalsFor(subtotal: number) {
  return cartTotals(subtotal, env.shippingFlat, env.freeShippingThreshold);
}

export const shippingConfig = {
  flat: env.shippingFlat,
  freeThreshold: env.freeShippingThreshold,
} as const;
