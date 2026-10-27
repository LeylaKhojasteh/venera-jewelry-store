'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { FilterControls } from '@/components/products/CatalogControls';
import type { CatalogParams } from '@/lib/catalog-url';
import type { CategoryData } from '@/types';

export function MobileFilterDrawer({
  current,
  categories,
  activeCount,
}: {
  current: CatalogParams;
  categories: CategoryData[];
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 items-center gap-2 border border-line bg-paper-soft px-3 text-xs text-plum-ink lg:hidden"
        aria-haspopup="dialog"
      >
        <SlidersHorizontal aria-hidden="true" className="size-4 text-gold" />
        فیلترها
        {activeCount > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-plum text-[0.6rem] text-paper">
            {new Intl.NumberFormat('fa-IR').format(activeCount)}
          </span>
        ) : null}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} side="end" labelledBy="filters-title" className="bg-paper">
        <div className="flex h-dvh flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="filters-title" className="font-display text-xl text-plum-ink">
              فیلترها
            </h2>
            <button type="button" onClick={() => setOpen(false)} className="icon-btn" aria-label="بستن فیلترها">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterControls current={current} categories={categories} idPrefix="drawer-" />
          </div>
          <div className="border-t border-line p-5">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary btn-block">
              دیدن نتیجه‌ها
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
