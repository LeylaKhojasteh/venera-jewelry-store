import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { emptyOrdersMessage, orderStatusLabels } from '@/lib/constants';
import { EmptyState, EmptyLink } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'سفارش‌های من',
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const user = await requireUser('/profile/orders');
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { select: { quantity: true, name: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="display text-3xl">سفارش‌های من</h1>
          <p className="mt-2 text-sm text-ink-soft">
            همهٔ سفارش‌های این حساب، با جزئیات کامل. وضعیت‌ها را تیم ونرا تغییر می‌دهد.
          </p>
        </div>
        <Link href="/products" className="btn btn-outline btn-sm">
          خرید تازه
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="هنوز سفارشی ثبت نکردی."
          description={emptyOrdersMessage}
          action={<EmptyLink href="/products" label="دیدن کالکشن" />}
        />
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/profile/orders/${order.id}`}
                className="group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-latin text-sm tracking-[0.1em] text-plum-ink" dir="ltr">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {formatJalaliDateTime(order.createdAt)} · {order.items.length} قلم ·{' '}
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} عدد
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge badge-soft">{orderStatusLabels[order.status] ?? order.status}</span>
                  <span className="tabular text-sm text-plum-ink">{formatToman(order.total)}</span>
                  <ChevronLeft
                    aria-hidden="true"
                    className="size-4 text-gold transition-transform group-hover:-translate-x-0.5"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
