'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { buildCatalogHref, pricePresets, type CatalogParams } from '@/lib/catalog-url';
import { genderNav, sortOptions } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';

export function CatalogFilters({
  current,
  categories,
  idPrefix = 'filters',
}: {
  current: CatalogParams;
  categories: CategoryData[];
  idPrefix?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [min, setMin] = useState(current.min ?? '');
  const [max, setMax] = useState(current.max ?? '');

  const go = (overrides: Record<string, string | number | null | undefined>) => {
    startTransition(() => router.push(buildCatalogHref(current, overrides), { scroll: false }));
  };

  const activePreset = pricePresets.findIndex(
    (preset) =>
      String(preset.min ?? '') === (current.min ?? '') && String(preset.max ?? '') === (current.max ?? ''),
  );

  return (
    <div className={cn('v3-filters', pending && 'is-pending')}>
      <div className="v3-filters-head">
        <span>فیلترها</span>
        <button
          type="button"
          onClick={() =>
            go({
              category: null,
              gender: null,
              min: null,
              max: null,
              inStock: null,
              discount: null,
              q: null,
            })
          }
        >
          <RotateCcw aria-hidden="true" size={14} />
          پاک کردن
        </button>
      </div>

      <form action="/products" method="get" className="v3-search">
        <label htmlFor={`${idPrefix}-q`} className="sr-only">
          جست‌وجوی محصولات
        </label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          defaultValue={current.q ?? ''}
          placeholder="نام قطعه…"
          className="v3-field-input"
        />
        {current.category ? <input type="hidden" name="category" value={current.category} /> : null}
        {current.gender ? <input type="hidden" name="gender" value={current.gender} /> : null}
        {current.sort ? <input type="hidden" name="sort" value={current.sort} /> : null}
        <button type="submit" className="v3-btn v3-btn-line">
          جست‌وجو
        </button>
      </form>

      <fieldset className="v3-filter-group">
        <legend>دسته‌بندی</legend>
        <div className="v3-filter-options">
          <button
            type="button"
            className="v3-choice"
            aria-pressed={!current.category}
            onClick={() => go({ category: null })}
          >
            همه
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className="v3-choice"
              aria-pressed={current.category === category.slug}
              onClick={() => go({ category: category.slug })}
            >
              {category.name}
              <span className="v3-filter-count">{formatDigits(category.productCount)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="v3-filter-group">
        <legend>برای چه کسی</legend>
        <div className="v3-filter-options">
          <button type="button" className="v3-choice" aria-pressed={!current.gender} onClick={() => go({ gender: null })}>
            همه
          </button>
          {genderNav.map((gender) => (
            <button
              key={gender.slug}
              type="button"
              className="v3-choice"
              aria-pressed={current.gender === gender.slug}
              onClick={() => go({ gender: gender.slug })}
            >
              {gender.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="v3-filter-group">
        <legend>بازهٔ قیمت</legend>
        <div className="v3-filter-options">
          {pricePresets.map((preset, index) => (
            <button
              key={preset.label}
              type="button"
              className="v3-choice"
              aria-pressed={activePreset === index}
              onClick={() =>
                go({
                  min: preset.min !== undefined ? preset.min : null,
                  max: preset.max !== undefined ? preset.max : null,
                })
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="v3-price-range">
          <input
            aria-label="کمترین قیمت"
            inputMode="numeric"
            value={min}
            onChange={(event) => setMin(event.target.value.replace(/[^\d]/g, ''))}
            placeholder="از"
            className="v3-field-input"
          />
          <span>—</span>
          <input
            aria-label="بیشترین قیمت"
            inputMode="numeric"
            value={max}
            onChange={(event) => setMax(event.target.value.replace(/[^\d]/g, ''))}
            placeholder="تا"
            className="v3-field-input"
          />
          <button
            type="button"
            className="v3-choice"
            onClick={() => go({ min: min || null, max: max || null })}
          >
            اعمال
          </button>
        </div>
      </fieldset>

      <fieldset className="v3-filter-group">
        <legend>وضعیت</legend>
        <div className="v3-filter-options">
          <button
            type="button"
            className="v3-choice"
            aria-pressed={Boolean(current.inStock)}
            onClick={() => go({ inStock: current.inStock ? null : '1' })}
          >
            فقط موجود
          </button>
          <button
            type="button"
            className="v3-choice"
            aria-pressed={Boolean(current.discount)}
            onClick={() => go({ discount: current.discount ? null : '1' })}
          >
            تخفیف‌دار
          </button>
        </div>
      </fieldset>

      <div className="v3-filter-group">
        <label htmlFor={`${idPrefix}-sort`} className="v3-filter-legend">
          مرتب‌سازی
        </label>
        <select
          id={`${idPrefix}-sort`}
          className="v3-field-input"
          value={current.sort ?? 'latest'}
          onChange={(event) => go({ sort: event.target.value })}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
