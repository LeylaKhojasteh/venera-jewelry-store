'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { buildCatalogHref, pricePresets, type CatalogParams } from '@/lib/catalog-url';
import { genderNav, sortOptions } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';

export function useCatalogNavigation(current: CatalogParams) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (overrides: Record<string, string | number | null | undefined>) => {
    const href = buildCatalogHref(current, overrides);
    startTransition(() => router.push(href, { scroll: false }));
  };

  return { go, pending };
}

export function FilterControls({
  current,
  categories,
  idPrefix = '',
}: {
  current: CatalogParams;
  categories: CategoryData[];
  idPrefix?: string;
}) {
  const { go, pending } = useCatalogNavigation(current);
  const activePreset = pricePresets.findIndex(
    (preset) => String(preset.min ?? '') === (current.min ?? '') && String(preset.max ?? '') === (current.max ?? ''),
  );

  const group = (label: string, children: React.ReactNode) => (
    <fieldset className="border-t border-line pt-5">
      <legend className="eyebrow mb-3">{label}</legend>
      {children}
    </fieldset>
  );

  return (
    <div className={cn('space-y-6', pending && 'opacity-70 transition-opacity')}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-medium text-plum-ink">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-gold" />
          فیلترها
        </p>
        <button
          type="button"
          onClick={() => go({ category: null, gender: null, min: null, max: null, inStock: null, discount: null, q: null })}
          className="flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-plum"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          پاک کردن همه
        </button>
      </div>

      {group(
        'دسته‌بندی',
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => go({ category: null })}
            className="chip"
            data-active={!current.category}
            aria-pressed={!current.category}
          >
            همه
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => go({ category: category.slug })}
              className="chip"
              data-active={current.category === category.slug}
              aria-pressed={current.category === category.slug}
            >
              {category.name}
              <span className="tabular text-[0.62rem] opacity-60">{formatDigits(category.productCount)}</span>
            </button>
          ))}
        </div>,
      )}

      {group(
        'برای چه کسی',
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => go({ gender: null })}
            className="chip"
            data-active={!current.gender}
            aria-pressed={!current.gender}
          >
            همه
          </button>
          {genderNav.map((gender) => (
            <button
              key={gender.slug}
              type="button"
              onClick={() => go({ gender: gender.slug })}
              className="chip"
              data-active={current.gender === gender.slug}
              aria-pressed={current.gender === gender.slug}
            >
              {gender.name}
            </button>
          ))}
        </div>,
      )}

      {group(
        'بازهٔ قیمت',
        <div className="flex flex-wrap gap-2">
          {pricePresets.map((preset, index) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                go(
                  activePreset === index
                    ? { min: null, max: null }
                    : { min: preset.min ?? null, max: preset.max ?? null },
                )
              }
              className="chip"
              data-active={activePreset === index}
              aria-pressed={activePreset === index}
            >
              {preset.label}
            </button>
          ))}
        </div>,
      )}

      {group(
        'دیگر گزینه‌ها',
        <div className="space-y-3">
          <label htmlFor={`${idPrefix}in-stock`} className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
            <span
              className={cn(
                'flex size-5 items-center justify-center border transition-colors',
                current.inStock ? 'border-plum bg-plum text-paper' : 'border-line bg-paper-soft',
              )}
            >
              {current.inStock ? <Check aria-hidden="true" className="size-3" /> : null}
            </span>
            <input
              id={`${idPrefix}in-stock`}
              type="checkbox"
              className="sr-only"
              checked={Boolean(current.inStock)}
              onChange={(event) => go({ inStock: event.target.checked ? '1' : null })}
            />
            فقط کالاهای موجود
          </label>

          <label htmlFor={`${idPrefix}discount`} className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
            <span
              className={cn(
                'flex size-5 items-center justify-center border transition-colors',
                current.discount ? 'border-plum bg-plum text-paper' : 'border-line bg-paper-soft',
              )}
            >
              {current.discount ? <Check aria-hidden="true" className="size-3" /> : null}
            </span>
            <input
              id={`${idPrefix}discount`}
              type="checkbox"
              className="sr-only"
              checked={Boolean(current.discount)}
              onChange={(event) => go({ discount: event.target.checked ? '1' : null })}
            />
            فقط تخفیف‌دارها
          </label>
        </div>,
      )}
    </div>
  );
}

export function SortSelect({ current }: { current: CatalogParams }) {
  const { go } = useCatalogNavigation(current);
  return (
    <label className="flex items-center gap-2 text-xs text-ink-soft">
      <span className="hidden sm:inline">مرتب‌سازی:</span>
      <select
        value={current.sort ?? 'latest'}
        onChange={(event) => go({ sort: event.target.value === 'latest' ? null : event.target.value })}
        className="min-h-10 border border-line bg-paper-soft px-3 text-xs text-plum-ink"
        aria-label="مرتب‌سازی محصولات"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CatalogSearch({ current }: { current: CatalogParams }) {
  const { go } = useCatalogNavigation(current);
  return (
    <form
      role="search"
      className="flex min-h-11 flex-1 items-center gap-2 border border-line bg-paper-soft px-3 focus-within:border-plum"
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get('q');
        go({ q: typeof value === 'string' && value.trim() ? value.trim() : null });
      }}
    >
      <label htmlFor="catalog-q" className="sr-only">
        جست‌وجو در محصولات
      </label>
      <input
        id="catalog-q"
        name="q"
        defaultValue={current.q ?? ''}
        placeholder="جست‌وجو در کالکشن…"
        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-soft/60"
      />
      <button type="submit" className="text-xs text-plum transition-colors hover:text-plum-ink">
        جست‌وجو
      </button>
    </form>
  );
}
