'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { CartSummary } from '@/components/cart/CartSummary';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { EmptyLink, EmptyState } from '@/components/ui/EmptyState';
import { formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';

export function CartView() {
  const { lines, count, subtotal, shipping, total, freeShippingRemaining, notices, loading, pending, isAuthenticated, update, remove } = useCart();

  if (loading) {
    return (
      <div className="mt-10 grid gap-4">
        {[0, 1].map((item) => (
          <div key={item} className="flex gap-4 border border-line p-4">
            <div className="skeleton h-32 w-24 shrink-0" />
            <div className="flex-1 space-y-3 py-2">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mt-10">
        <EmptyState
          title="هنوز چیزی به سبدت اضافه نکردی."
          description="کالکشن کوچک است اما هر آیتم داستان خودش را دارد. از دسته‌بندی‌ها شروع کن یا همه محصولات را ببین."
          icon={<ShoppingBag aria-hidden="true" className="size-8" />}
          action={<EmptyLink href="/products" label="کشف زیورآلات ونرا" />}
        />
      </div>
    );
  }

  const checkoutHref = isAuthenticated ? '/checkout' : '/login?next=%2Fcheckout';

  return (
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {notices.length > 0 ? (
          <div className="mb-6 space-y-2 border-s-2 border-gold bg-paper-deep/60 px-4 py-3">
            {notices.map((notice) => (
              <p key={notice} className="flex items-start gap-2 text-xs leading-6 text-ink-soft">
                <AlertCircle aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-gold" />
                {notice}
              </p>
            ))}
          </div>
        ) : null}

        <ul className={cn('divide-y divide-line border-y border-line', pending && 'opacity-80')}>
          {lines.map((line) => {
            const variantKey = line.variantId ?? '';
            return (
              <li key={`${line.productId}-${variantKey}`} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  href={`/products/${line.slug}`}
                  className="relative h-36 w-28 shrink-0 overflow-hidden bg-blush sm:h-40 sm:w-32"
                >
                  <Image src={line.image} alt={line.imageAlt} fill sizes="128px" className="object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base text-plum-ink">
                        <Link href={`/products/${line.slug}`} className="hover:text-plum">
                          {line.name}
                        </Link>
                      </h2>
                      {line.variantLabel ? (
                        <p className="mt-1 text-xs text-ink-soft">{line.variantLabel}</p>
                      ) : null}
                      <p className="mt-1 text-[0.7rem] text-ink-soft">{formatToman(line.price)}</p>
                      {!line.isActive || line.stock === 0 ? (
                        <p className="mt-2 text-xs text-error">این آیتم فعلاً قابل سفارش نیست.</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.productId, variantKey)}
                      className="flex size-9 shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-error"
                      aria-label={`حذف ${line.name} از سبد`}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                    <QuantityStepper
                      compact
                      value={line.quantity}
                      min={1}
                      max={Math.max(1, line.maxQuantity)}
                      disabled={!line.isActive || line.stock === 0}
                      onChange={(next) => update(line.productId, variantKey, next)}
                    />
                    <p className="tabular text-sm font-medium text-plum-ink">{formatToman(line.lineTotal)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between text-xs text-ink-soft">
          <Link href="/products" className="link-quiet">
            افزودن آیتم دیگر
          </Link>
          <span className="flex items-center gap-1.5">
            {pending ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : null}
            موجودی و قیمت‌ها از پایگاه‌داده خوانده می‌شوند.
          </span>
        </div>
      </div>

      <aside className="lg:col-span-4 lg:sticky lg:top-28">
        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          freeShippingRemaining={freeShippingRemaining}
          count={count}
          cta={
            <Link href={checkoutHref} className="btn btn-primary btn-block">
              {isAuthenticated ? 'ادامهٔ سفارش' : 'ورود و ادامهٔ سفارش'}
            </Link>
          }
          note={
            !isAuthenticated ? (
              <p className="text-[0.68rem] leading-6 text-ink-soft">
                سبدت روی همین مرورگر ذخیره شده؛ بعد از ورود به حسابت منتقل می‌شود.
              </p>
            ) : null
          }
        />
      </aside>
    </div>
  );
}
