export type CatalogParams = Record<string, string | undefined>;

export function buildCatalogHref(
  current: CatalogParams,
  overrides: Record<string, string | number | null | undefined> = {},
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (value) query.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null || value === undefined || value === '') query.delete(key);
    else query.set(key, String(value));
  }
  query.delete('page');
  const suffix = query.toString();
  return suffix ? `/products?${suffix}` : '/products';
}

export const pricePresets = [
  { label: 'تا ۱ میلیون', min: undefined, max: 1_000_000 },
  { label: '۱ تا ۱٫۵ میلیون', min: 1_000_000, max: 1_500_000 },
  { label: '۱٫۵ تا ۲ میلیون', min: 1_500_000, max: 2_000_000 },
  { label: 'بیش از ۲ میلیون', min: 2_000_000, max: undefined },
] as const;

export function presetToParams(preset: (typeof pricePresets)[number]): CatalogParams {
  return {
    min: preset.min !== undefined ? String(preset.min) : undefined,
    max: preset.max !== undefined ? String(preset.max) : undefined,
  };
}
