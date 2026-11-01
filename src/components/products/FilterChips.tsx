import Link from 'next/link';
import { X } from 'lucide-react';
import { buildCatalogHref, type CatalogParams } from '@/lib/catalog-url';
import { formatNumber } from '@/lib/money';
import { genderLabels, sortOptions } from '@/lib/constants';
import type { CategoryData } from '@/types';

export function ActiveFilterChips({
  current,
  categories,
}: {
  current: CatalogParams;
  categories: CategoryData[];
}) {
  const chips: { key: string; label: string }[] = [];

  if (current.q) chips.push({ key: 'q', label: `جست‌وجو: ${current.q}` });
  if (current.category) {
    const match = categories.find((category) => category.slug === current.category);
    chips.push({ key: 'category', label: match?.name ?? current.category });
  }
  if (current.gender === 'women' || current.gender === 'men') {
    chips.push({ key: 'gender', label: genderLabels[current.gender === 'women' ? 'WOMEN' : 'MEN'] ?? current.gender });
  }
  if (current.min) chips.push({ key: 'min', label: `از ${formatNumber(Number(current.min))} تومان` });
  if (current.max) chips.push({ key: 'max', label: `تا ${formatNumber(Number(current.max))} تومان` });
  if (current.inStock) chips.push({ key: 'inStock', label: 'فقط موجود' });
  if (current.discount) chips.push({ key: 'discount', label: 'تخفیف‌دار' });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildCatalogHref(current, { [chip.key]: null })}
          className="chip"
          aria-label={`حذف فیلتر ${chip.label}`}
        >
          {chip.label}
          <X aria-hidden="true" className="size-3" />
        </Link>
      ))}
      <Link href="/products" className="text-xs text-ink-soft underline-offset-4 transition-colors hover:text-plum hover:underline">
        پاک کردن همه
      </Link>
    </div>
  );
}

export function CountLabel({ total, sort }: { total: number; sort?: string }) {
  const sortLabel = sortOptions.find((option) => option.value === (sort ?? 'latest'))?.label;
  return (
    <p className="text-xs text-ink-soft">
      <span className="tabular text-plum-ink">{new Intl.NumberFormat('fa-IR').format(total)}</span> آیتم
      {sortLabel ? <span className="text-ink-soft/70"> · {sortLabel}</span> : null}
    </p>
  );
}

export function activeFilterCount(current: CatalogParams): number {
  return ['q', 'category', 'gender', 'min', 'max', 'inStock', 'discount'].filter((key) => Boolean(current[key])).length;
}
