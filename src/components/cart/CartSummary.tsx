import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';

export function CartSummary({
  subtotal,
  shipping,
  total,
  freeShippingRemaining,
  count,
  cta,
  note,
  className,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  count: number;
  cta: ReactNode;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('summary-card p-6', className)}>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl text-plum-ink">خلاصهٔ سفارش</h2>
        <span className="text-xs text-ink-soft">{new Intl.NumberFormat('fa-IR').format(count)} قلم</span>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">جمع کالاها</dt>
          <dd className="tabular text-plum-ink">{formatToman(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">هزینهٔ ارسال</dt>
          <dd className="tabular text-plum-ink">
            {shipping === 0 ? <span className="text-success">رایگان</span> : formatToman(shipping)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-base">
          <dt className="font-medium text-plum-ink">مبلغ قابل پرداخت</dt>
          <dd className="tabular font-semibold text-plum-ink">{formatToman(total)}</dd>
        </div>
      </dl>

      {freeShippingRemaining > 0 ? (
        <div className="mt-5">
          <div className="h-1 w-full bg-blush">
            <div
              className="h-1 bg-gold"
              style={{ width: `${Math.min(100, Math.round(((subtotal - 0) / (subtotal + freeShippingRemaining)) * 100))}%` }}
            />
          </div>
          <p className="mt-2 text-[0.7rem] leading-5 text-ink-soft">
            {formatToman(freeShippingRemaining)} تا ارسال رایگان باقی مانده است.
          </p>
        </div>
      ) : subtotal > 0 ? (
        <p className="mt-5 text-[0.7rem] text-success">ارسال این سفارش رایگان است.</p>
      ) : null}

      <div className="mt-6">{cta}</div>

      {note ? <div className="mt-4">{note}</div> : null}

      <Link href="/products" className="link-quiet mt-5 inline-flex text-xs text-plum-ink">
        ادامهٔ خرید
      </Link>
    </div>
  );
}
