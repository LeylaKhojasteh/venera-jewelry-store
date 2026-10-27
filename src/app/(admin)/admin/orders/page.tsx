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
        <h1 className="display text-3xl">سفارش‌ها</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">
          وضعیت را تغییر بده تا در پنل مشتری و صفحهٔ سفارش نمایش داده شود. تغییر وضعیت موجودی را بازنمی‌گرداند؛
          سفارش‌های لغوشده فقط از جمع درآمد کنار می‌روند.
        </p>
      </div>

      {focus ? (
        <p className="mt-5 border-s-2 border-gold bg-paper px-4 py-3 text-xs text-ink-soft">
          سفارش انتخاب‌شده در فهرست مشخص شده است. برای جزئیات کامل، شمارهٔ سفارش را در پنل مشتری ببین.
        </p>
      ) : null}

      <p className="mt-5 text-xs text-ink-soft">
        {new Intl.NumberFormat('fa-IR').format(orders.length)} سفارش ثبت‌شده
      </p>

      <div className="mt-4 space-y-3">
        {orders.length === 0 ? (
          <p className="border border-dashed border-line bg-paper-soft p-8 text-center text-sm text-ink-soft">
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
