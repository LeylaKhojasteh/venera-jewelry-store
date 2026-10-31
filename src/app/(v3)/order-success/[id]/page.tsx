import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'سفارش ثبت شد',
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

export default async function OrderSuccessPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireUser(`/order-success/${id}`);

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();

  const address = order.address as AddressSnapshot;

  return (
    <div className="v3-shell v3-section">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <Link href="/profile">پنل من</Link>
        <span aria-hidden="true">/</span>
        <Link href="/profile/orders">سفارش‌ها</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{order.orderNumber}</span>
      </nav>

      <div className="v3-checkout">
        <div>
          <div className="v3-order-hero">
            <span className="v3-order-hero-mark" aria-hidden="true">
              <Check size={22} />
            </span>
            <p className="v3-small">{orderStatusLabels[order.status] ?? order.status}</p>
          </div>

          <h1 className="v3-display" style={{ marginTop: '1.25rem' }}>
            ممنون که انتخاب کردی.
          </h1>
          <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '40ch' }}>
            سفارش تو ثبت شد و در پنل کاربری‌ات می‌ماند. جزئیات و وضعیت آن را از همان‌جا پیگیری کن.
          </p>

          <div className="v3-order-summary" style={{ marginTop: '2rem' }}>
            <p className="v3-small">شمارهٔ سفارش</p>
            <p className="font-latin v3-order-number" dir="ltr" style={{ marginTop: '0.35rem', fontSize: 26 }}>
              {order.orderNumber}
            </p>
            <p className="v3-small" style={{ marginTop: '0.35rem' }}>
              {formatJalaliDateTime(order.createdAt)}
            </p>

            <div className="v3-summary-row" style={{ marginTop: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin aria-hidden="true" size={14} /> نشانی
              </span>
            </div>
            <p className="v3-body" style={{ marginTop: '0.35rem' }}>
              {address.recipient}
              <br />
              {address.province}، {address.city}، {address.street}
              <br />
              <span dir="ltr" style={{ fontSize: 13 }}>
                {address.phone} · {address.postalCode}
              </span>
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
            <Link href={`/profile/orders/${order.id}`} className="v3-btn v3-btn-solid">
              جزئیات سفارش در پنل
            </Link>
            <Link href="/products" className="v3-btn v3-btn-line">
              ادامهٔ خرید
            </Link>
          </div>
        </div>

        <aside>
          <div className="v3-order-summary">
            <h2 className="v3-h3">کالاهای سفارش</h2>
            <ul style={{ marginTop: '0.75rem' }}>
              {order.items.map((item) => (
                <li key={item.id} className="v3-order-item">
                  <span className="v3-order-item-media">
                    <Image src={item.imageUrl} alt="" fill sizes="72px" className="object-cover" />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', color: 'var(--bone)', fontSize: 15 }}>{item.name}</span>
                    <span className="v3-small" style={{ display: 'block' }}>
                      {item.variantLabel ? `${item.variantLabel} · ` : ''}
                      {new Intl.NumberFormat('fa-IR').format(item.quantity)} عدد
                    </span>
                  </span>
                  <span className="v3-order-total">{formatToman(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            {order.note ? (
              <div style={{ marginTop: '1rem' }}>
                <p className="v3-small">یادداشت</p>
                <p className="v3-body" style={{ marginTop: '0.25rem' }}>
                  {order.note}
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
