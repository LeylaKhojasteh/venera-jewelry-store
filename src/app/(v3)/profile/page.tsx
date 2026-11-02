import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpLeft, MapPin } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalali } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { emptyOrdersMessage, orderStatusLabels } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'پنل کاربری',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requireUser('/profile');

  const [orders, orderCount, defaultAddress] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { items: { select: { quantity: true } } },
    }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.address.findFirst({ where: { userId: user.id, isDefault: true } }),
  ]);

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="v3-profile-greeting">سلام، {user.name.split(' ')[0]}.</h1>
        </div>
        <Link href="/products" className="v3-btn v3-btn-line">
          رفتن به کالکشن
          <ArrowUpLeft aria-hidden="true" size={16} />
        </Link>
      </div>

      <dl className="v3-stats">
        <div className="v3-stat">
          <dt>سفارش‌های ثبت‌شده</dt>
          <dd>{new Intl.NumberFormat('fa-IR').format(orderCount)}</dd>
        </div>
      </dl>

      <section aria-labelledby="recent-orders" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
          <h2 id="recent-orders" className="v3-h3">
            آخرین سفارش‌ها
          </h2>
          {orderCount > 0 ? (
            <Link href="/profile/orders" className="v3-small">
              همهٔ سفارش‌ها
            </Link>
          ) : null}
        </div>

        {orders.length === 0 ? (
          <div className="v3-empty" style={{ paddingBlock: '2rem' }}>
            <p className="v3-body">{emptyOrdersMessage}</p>
            <Link href="/products" className="v3-btn v3-btn-line">
              دیدن کالکشن
            </Link>
          </div>
        ) : (
          <ul style={{ marginTop: '0.75rem' }}>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/profile/orders/${order.id}`} className="v3-order-row">
                  <span>
                    <span className="font-latin v3-order-number" dir="ltr">
                      {order.orderNumber}
                    </span>
                    <span className="v3-order-meta" style={{ display: 'block' }}>
                      {formatJalali(order.createdAt)} ·{' '}
                      {new Intl.NumberFormat('fa-IR').format(
                        order.items.reduce((sum, item) => sum + item.quantity, 0),
                      )}{' '}
                      قلم
                    </span>
                  </span>
                  <span className="v3-order-side">
                    <span className="v3-status">{orderStatusLabels[order.status] ?? order.status}</span>
                    <span className="v3-order-total">{formatToman(order.total)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="default-address" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
          <h2 id="default-address" className="v3-h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
            نشانی پیش‌فرض
          </h2>
          <Link href="/profile/addresses" className="v3-small">
            مدیریت نشانی‌ها
          </Link>
        </div>

        {defaultAddress ? (
          <div className="v3-order-summary" style={{ marginTop: '0.75rem' }}>
            <p style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', color: 'var(--bone)' }}>
              <span style={{ fontWeight: 600 }}>{defaultAddress.recipient}</span>
              {defaultAddress.label ? <span className="v3-status">{defaultAddress.label}</span> : null}
            </p>
            <p className="v3-body" style={{ marginTop: '0.35rem' }}>
              {defaultAddress.province}، {defaultAddress.city}، {defaultAddress.street}
            </p>
            <p className="v3-small" dir="ltr" style={{ marginTop: '0.25rem' }}>
              {defaultAddress.phone} · {defaultAddress.postalCode}
            </p>
          </div>
        ) : (
          <p className="v3-body" style={{ marginTop: '0.75rem' }}>
            نشانی پیش‌فرضی ثبت نشده.{' '}
            <Link href="/profile/addresses" style={{ color: 'var(--copper)' }}>
              افزودن نشانی
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
