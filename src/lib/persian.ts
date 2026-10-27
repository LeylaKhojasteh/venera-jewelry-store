const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Convert Persian/Arabic-Indic digits to ASCII digits. */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/** Normalise Persian text before comparing or validating it. */
export function normalizePersian(input: string): string {
  return input
    .replace(/\u064A/g, '\u06CC') // Arabic yeh → Persian yeh
    .replace(/\u0643/g, '\u06A9') // Arabic kaf → Persian kaf
    .replace(/\u0640/g, '') // tatweel
    .replace(/\u200B/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidIranMobile(input: string): boolean {
  const digits = toEnglishDigits(input).replace(/[\s-]/g, '');
  return /^09\d{9}$/.test(digits);
}

export function normalizeMobile(input: string): string {
  return toEnglishDigits(input).replace(/[\s-]/g, '');
}

export function isValidPostalCode(input: string): boolean {
  const digits = toEnglishDigits(input).replace(/[\s-]/g, '');
  return /^\d{10}$/.test(digits);
}

/** Latin-safe slug check. */
export function isSlug(input: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input);
}

/** A reading-friendly Persian ordinal for editorial folios: 1 → «۰۱» */
export function folio(n: number): string {
  return new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(n);
}
