'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type CSSProperties } from 'react';
import { RotateCcw } from 'lucide-react';
import { buildCatalogHref, type CatalogParams } from '@/lib/catalog-url';
import { genderNav, sortOptions } from '@/lib/constants';
import { formatDigits, formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';

const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;
const PRICE_STEP = 50_000;

function clampPrice(value: number) {
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(value / PRICE_STEP) * PRICE_STEP));
}

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
  const [min, setMin] = useState(() => clampPrice(Number(current.min ?? PRICE_MIN)));
  const [max, setMax] = useState(() => clampPrice(Number(current.max ?? PRICE_MAX)));

  const go = (overrides: Record<string, string | number | null | undefined>) => {
    startTransition(() => router.push(buildCatalogHref(current, overrides), { scroll: false }));
  };

  const commitPrice = (nextMin = min, nextMax = max) => {
    go({
      min: nextMin > PRICE_MIN ? String(nextMin) : null,
      max: nextMax < PRICE_MAX ? String(nextMax) : null,
    });
  };

  const rangeStyle = {
    '--from': `${(min / PRICE_MAX) * 100}%`,
    '--to': `${(max / PRICE_MAX) * 100}%`,
  } as CSSProperties;

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
          placeholder="نام آیتم…"
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
        <div className="v3-price-slider" style={rangeStyle}>
          <div className="v3-price-values">
            <span>{formatToman(min)}</span>
            <span>{max >= PRICE_MAX ? '۲٬۰۰۰٬۰۰۰+ تومان' : formatToman(max)}</span>
          </div>
          <div className="v3-price-track">
            <span className="v3-price-track-fill" aria-hidden="true" />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={min}
              aria-label="کمترین قیمت"
              onChange={(event) => setMin(Math.min(Number(event.target.value), max - PRICE_STEP))}
              onPointerUp={() => commitPrice()}
              onKeyUp={() => commitPrice()}
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={max}
              aria-label="بیشترین قیمت"
              onChange={(event) => setMax(Math.max(Number(event.target.value), min + PRICE_STEP))}
              onPointerUp={() => commitPrice()}
              onKeyUp={() => commitPrice()}
            />
          </div>
          <div className="v3-price-ends">
            <span>ارزان‌تر</span>
            <span>گران‌تر</span>
          </div>
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
