import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { AdminOrderRow } from '@/components/admin/AdminOrderRow';

export const metadata = { title: 'مدیریت سفارش‌ها' };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const focus = Array.isArray(params.focus) ? params.focus[0] : params.focus;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      items: { select: { quantity: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div>
      <div>
        <h1 className="v3-display">سفارش‌ها</h1>
        <p className="v3-lead" style={{ marginTop: '0.75rem', maxWidth: '56ch' }}>
          وضعیت را تغییر بده تا در پنل مشتری و صفحهٔ سفارش نمایش داده شود. تغییر وضعیت موجودی را بازنمی‌گرداند؛
          سفارش‌های لغوشده فقط از جمع درآمد کنار می‌روند.
        </p>
      </div>

      {focus ? (
        <p className="v3-small" style={{ marginTop: '1rem', background: 'var(--ink-2)', padding: '0.75rem' }}>
          سفارش انتخاب‌شده در فهرست مشخص شده است. برای جزئیات کامل، شمارهٔ سفارش را در پنل مشتری ببین.
        </p>
      ) : null}

      <p className="v3-small" style={{ marginTop: '1rem' }}>
        {new Intl.NumberFormat('fa-IR').format(orders.length)} سفارش ثبت‌شده
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
        {orders.length === 0 ? (
          <p className="v3-empty" style={{ background: 'var(--ink-2)', padding: '2rem', textAlign: 'center' }}>
            هنوز سفارشی ثبت نشده است.
          </p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={focus === order.id ? 'ring-1 ring-plum/40' : undefined}>
              <AdminOrderRow
                order={{
                  id: order.id,
                  orderNumber: order.orderNumber,
                  customer: order.user.name,
                  city: (order.address as { city?: string }).city ?? '—',
                  total: order.total,
                  status: order.status,
                  createdAtLabel: formatJalaliDateTime(order.createdAt),
                  itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
