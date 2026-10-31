import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Package } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'جزئیات سفارش',
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

type AddressSnapshot = {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  label: string | null;
};

const flow: { key: 'DEMO_PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'; label: string }[] = [
  { key: 'DEMO_PLACED', label: 'ثبت سفارش' },
  { key: 'PROCESSING', label: 'آماده‌سازی' },
  { key: 'SHIPPED', label: 'ارسال' },
  { key: 'DELIVERED', label: 'تحویل' },
];

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireUser(`/profile/orders/${id}`);

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();

  const address = order.address as AddressSnapshot;
  const cancelled = order.status === 'CANCELLED';
  const currentIndex = flow.findIndex((step) => step.key === order.status);

  return (
    <div>
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/profile">پنل من</Link>
        <span aria-hidden="true">/</span>
        <Link href="/profile/orders">سفارش‌ها</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{order.orderNumber}</span>
      </nav>

      <div className="v3-catalog-head" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="font-latin v3-order-number" dir="ltr" style={{ fontSize: 28 }}>
            {order.orderNumber}
          </h1>
          <p className="v3-small" style={{ marginTop: '0.35rem' }}>
            {formatJalaliDateTime(order.createdAt)}
          </p>
        </div>
        <span className={cancelled ? 'v3-badge' : 'v3-status'}>
          {orderStatusLabels[order.status] ?? order.status}
        </span>
      </div>

      {!cancelled ? (
        <ol className="v3-steps-flow">
          {flow.map((step, index) => {
            const done = currentIndex >= index;
            return (
              <li key={step.key} className={`v3-flow-step${done ? ' is-done' : ''}`}>
                <span className="v3-flow-dot">{new Intl.NumberFormat('fa-IR').format(index + 1)}</span>
                {step.label}
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="v3-checkout" style={{ marginTop: '2rem' }}>
        <div>
          <h2 className="v3-h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Package aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
            کالاها
          </h2>
          <ul style={{ marginTop: '0.75rem' }}>
            {order.items.map((item) => (
              <li key={item.id} className="v3-order-item">
                <span className="v3-order-item-media">
                  <Image src={item.imageUrl} alt="" fill sizes="72px" className="object-cover" />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <Link href={`/products/${item.slug}`} style={{ color: 'var(--bone)', fontSize: 15 }}>
                    {item.name}
                  </Link>
                  <span className="v3-small" style={{ display: 'block' }}>
                    {item.variantLabel ? `${item.variantLabel} · ` : ''}
                    {new Intl.NumberFormat('fa-IR').format(item.quantity)} عدد ·{' '}
                    {formatToman(item.unitPrice)} هر عدد
                  </span>
                  <span className="v3-small" dir="ltr" style={{ display: 'block' }}>
                    {item.sku}
                  </span>
                </span>
                <span className="v3-order-total">{formatToman(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          {order.note ? (
            <div className="v3-order-summary" style={{ marginTop: '1rem' }}>
              <p className="v3-small">یادداشت سفارش</p>
              <p className="v3-body" style={{ marginTop: '0.25rem' }}>
                {order.note}
              </p>
            </div>
          ) : null}
        </div>

        <aside>
          <div className="v3-order-summary">
            <h2 className="v3-h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
              نشانی ثبت‌شده
            </h2>
            <p className="v3-body" style={{ marginTop: '0.75rem' }}>
              {address.recipient}
              <br />
              {address.province}، {address.city}
              <br />
              {address.street}
            </p>
            <p className="v3-small" dir="ltr" style={{ marginTop: '0.35rem' }}>
              {address.phone} · {address.postalCode}
            </p>

            <div className="v3-summary-row" style={{ marginTop: '1.25rem' }}>
              <span>کالاها</span>
              <span>{formatToman(order.subtotal)}</span>
            </div>
            <div className="v3-summary-row">
              <span>ارسال</span>
              <span>{order.shipping === 0 ? 'رایگان' : formatToman(order.shipping)}</span>
            </div>
            <div className="v3-summary-row is-total">
              <span>مبلغ کل</span>
              <strong>{formatToman(order.total)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
