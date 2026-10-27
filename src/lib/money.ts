const faNumber = new Intl.NumberFormat('fa-IR');
const faDigits = new Intl.NumberFormat('fa-IR', { useGrouping: false });

/** 1490000 → «۱٬۴۹۰٬۰۰۰ تومان» */
export function formatToman(value: number): string {
  return `${faNumber.format(Math.max(0, Math.round(value)))} تومان`;
}

/** Digits only, no currency unit — for compact price rows. */
export function formatNumber(value: number): string {
  return faNumber.format(Math.max(0, Math.round(value)));
}

export function formatDigits(value: number | string): string {
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(n) ? faDigits.format(n) : String(value);
}

/** Accurate integer percentage, e.g. 1490000 from 1790000 → ۱۷٪ */
export function discountPercent(price: number, compareAtPrice: number | null | undefined): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function tomanFromPersian(input: string): number | null {
  const normalized = input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\d]/g, '');
  if (!normalized) return null;
  const value = Number.parseInt(normalized, 10);
  return Number.isFinite(value) ? value : null;
}

export function cartTotals(subtotal: number, shippingFlat: number, freeShippingThreshold: number) {
  const shipping = subtotal > 0 && subtotal < freeShippingThreshold ? shippingFlat : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}
