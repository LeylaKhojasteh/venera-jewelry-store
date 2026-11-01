'use client';

import { useRef, useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';

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
              دنبال چی هستی؟
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
              placeholder="نام محصول…"
              className="w-full bg-transparent text-lg outline-none placeholder:text-ink-soft/60"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary btn-sm shrink-0">
              جست‌وجو
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-soft">جست‌وجو فقط بر اساس نام محصول انجام می‌شود.</p>
        </form>
      </div>
    </Dialog>
  );
}
