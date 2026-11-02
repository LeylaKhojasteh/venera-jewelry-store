import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels } from '@/lib/constants';
import { AdminOrderRow } from '@/components/admin/AdminOrderRow';

export const metadata = { title: 'جزئیات سفارش' };

type OrderAddress = {
  recipient?: string;
  phone?: string;
  province?: string;
  city?: string;
  street?: string;
  postalCode?: string;
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!order) notFound();

  const address = (order.address ?? {}) as OrderAddress;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">سفارش {order.orderNumber}</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem' }}>
            {formatJalaliDateTime(order.createdAt)} · {orderStatusLabels[order.status]}
          </p>
        </div>
        <Link href="/admin/orders" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>

      <AdminOrderRow
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.user.name,
          city: address.city ?? '—',
          total: order.total,
          status: order.status,
          createdAtLabel: formatJalaliDateTime(order.createdAt),
          itemCount,
        }}
      />

      <div className="v3-checkout" style={{ marginTop: '1rem' }}>
        <section className="v3-admin-card">
          <h2 className="v3-h3">مشتری و نشانی</h2>
          <p className="v3-body" style={{ marginTop: '0.75rem' }}>
            {order.user.name}
            <br />
            <span dir="ltr">{order.user.email}</span>
          </p>
          <p className="v3-body" style={{ marginTop: '0.75rem' }}>
            {address.recipient} · {address.phone}
            <br />
            {address.province}، {address.city}، {address.street}
            <br />
            کد پستی: {address.postalCode}
          </p>
        </section>

        <aside className="v3-admin-card">
          <h2 className="v3-h3">جمع سفارش</h2>
          <div className="v3-summary-row" style={{ marginTop: '0.75rem' }}>
            <span>کالاها</span>
            <span>{formatToman(order.subtotal)}</span>
          </div>
          <div className="v3-summary-row">
            <span>ارسال</span>
            <span>{formatToman(order.shipping)}</span>
          </div>
          <div className="v3-summary-row is-total">
            <span>کل</span>
            <strong>{formatToman(order.total)}</strong>
          </div>
          {order.note ? <p className="v3-small" style={{ marginTop: '0.75rem' }}>یادداشت: {order.note}</p> : null}
        </aside>
      </div>

      <div className="v3-admin-table-wrap" style={{ marginTop: '1rem' }}>
        <table className="v3-admin-table">
          <thead>
            <tr>
              <th>محصول</th>
              <th>تنوع</th>
              <th>تعداد</th>
              <th>قیمت واحد</th>
              <th>جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.variantLabel ?? '—'}</td>
                <td>{new Intl.NumberFormat('fa-IR').format(item.quantity)}</td>
                <td>{formatToman(item.unitPrice)}</td>
                <td>{formatToman(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
