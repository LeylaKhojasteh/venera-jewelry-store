'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { formatDigits } from '@/lib/money';

const suggestions = ['گردنبند', 'دستبند', 'گوشواره', 'انگشتر'];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="search-title" className="border border-line bg-paper">
      <div className="p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="search-title" className="display text-2xl">
              دنبال چه چیزی هستی؟
            </h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="بستن جست‌وجو">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <form action="/products" method="get" className="mt-8" role="search">
          <label htmlFor="site-search" className="sr-only">
            جست‌وجوی محصولات
          </label>
          <div className="flex items-center gap-3 border-b border-plum/40 pb-3 focus-within:border-plum">
            <Search aria-hidden="true" className="size-5 shrink-0 text-gold" />
            <input
              ref={inputRef}
              id="site-search"
              name="q"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="نام قطعه، جنس یا دسته‌بندی…"
              className="w-full bg-transparent text-lg outline-none placeholder:text-ink-soft/60"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary btn-sm shrink-0">
              جست‌وجو
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            جست‌وجو روی نام، توضیحات و جنس محصولات انجام می‌شود.
          </p>
        </form>

        <div className="mt-10 border-t border-line pt-6">
          <p className="eyebrow">پیشنهادها</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((item, index) => (
              <li key={item}>
                <Link
                  href={`/products?q=${encodeURIComponent(item)}`}
                  onClick={onClose}
                  className="chip"
                >
                  <span className="tabular text-[0.65rem] text-gold">{formatDigits(index + 1)}</span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
