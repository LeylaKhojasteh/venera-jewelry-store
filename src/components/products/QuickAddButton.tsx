'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Plus, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { cn } from '@/lib/utils';

export function QuickAddButton({
  productId,
  slug,
  name,
  hasVariants,
  inStock,
}: {
  productId: string;
  slug: string;
  name: string;
  hasVariants: boolean;
  inStock: boolean;
}) {
  const { add, adding } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <span className="flex h-10 items-center justify-center border border-line bg-paper/95 px-3 text-xs text-ink-soft">
        فعلاً ناموجود
      </span>
    );
  }

  if (hasVariants) {
    return (
      <Link
        href={`/products/${slug}`}
        className="flex h-10 items-center justify-center gap-2 border border-plum/25 bg-paper/95 px-3 text-xs text-plum-ink transition-colors hover:border-plum hover:bg-paper"
        aria-label={`انتخاب گزینه‌های ${name}`}
      >
        <SlidersHorizontal aria-hidden="true" className="size-3.5" />
        انتخاب گزینه‌ها
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await add({ productId, quantity: 1 });
        if (ok) {
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2000);
        }
      }}
      disabled={adding}
      className={cn(
        'flex h-10 w-full items-center justify-center gap-2 border px-3 text-xs transition-colors',
        added
          ? 'border-plum bg-plum text-paper'
          : 'border-plum/25 bg-paper/95 text-plum-ink hover:border-plum hover:bg-paper',
        adding && 'opacity-70',
      )}
      aria-label={`افزودن ${name} به سبد`}
    >
      {added ? (
        <>
          <Check aria-hidden="true" className="size-3.5" />
          به سبد اضافه شد
        </>
      ) : (
        <>
          <Plus aria-hidden="true" className="size-3.5" />
          افزودن سریع
        </>
      )}
    </button>
  );
}
