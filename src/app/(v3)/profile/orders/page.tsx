import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { emptyOrdersMessage, orderStatusLabels } from '@/lib/constants';

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
      <div className="v3-catalog-head" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="v3-display">سفارش‌های من</h1>
          <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '38ch' }}>
            همهٔ سفارش‌های این حساب، با جزئیات کامل. وضعیت‌ها را تیم ونرا تغییر می‌دهد.
          </p>
        </div>
        <Link href="/products" className="v3-btn v3-btn-line">
          خرید تازه
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="v3-empty" style={{ paddingBlock: '2rem' }}>
          <p className="v3-body">{emptyOrdersMessage}</p>
          <Link href="/products" className="v3-btn v3-btn-line">
            دیدن کالکشن
          </Link>
        </div>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/profile/orders/${order.id}`} className="v3-order-row">
                <span>
                  <span className="font-latin v3-order-number" dir="ltr">
                    {order.orderNumber}
                  </span>
                  <span className="v3-order-meta" style={{ display: 'block' }}>
                    {formatJalaliDateTime(order.createdAt)} · {order.items.length} قلم ·{' '}
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} عدد
                  </span>
                </span>
                <span className="v3-order-side">
                  <span className="v3-status">{orderStatusLabels[order.status] ?? order.status}</span>
                  <span className="v3-order-total">{formatToman(order.total)}</span>
                  <ChevronLeft aria-hidden="true" size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
