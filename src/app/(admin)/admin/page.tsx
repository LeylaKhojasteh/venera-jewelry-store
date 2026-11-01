import Link from 'next/link';
import { ArrowUpLeft, MessageSquare, Package, ShoppingCart, TriangleAlert } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatJalali } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels } from '@/lib/constants';

export const metadata = { title: 'نمای کلی' };

export default async function AdminOverviewPage() {
  const [productCount, activeCount, orderCount, newMessages, recentOrders, lowStock, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 4 }, isActive: true },
      orderBy: { stock: 'asc' },
      take: 6,
      select: { id: true, name: true, stock: true, slug: true },
    }),
    prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true } }),
  ]);

  const metrics = [
    { label: 'محصولات', value: new Intl.NumberFormat('fa-IR').format(productCount), detail: `${new Intl.NumberFormat('fa-IR').format(activeCount)} فعال`, href: '/admin/products', icon: Package },
    { label: 'سفارش‌ها', value: new Intl.NumberFormat('fa-IR').format(orderCount), detail: 'همه', href: '/admin/orders', icon: ShoppingCart },
    { label: 'پیام‌های تازه', value: new Intl.NumberFormat('fa-IR').format(newMessages), detail: 'خوانده‌نشده', href: '/admin/messages', icon: MessageSquare },
    { label: 'جمع سفارش‌ها', value: formatToman(revenue._sum.total ?? 0), detail: 'به‌جز لغوشده‌ها', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">نمای کلی فروشگاه</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem', maxWidth: '40ch' }}>
            اعداد از پایگاه‌دادهٔ همین نسخه خوانده می‌شوند.
          </p>
        </div>
        <Link href="/admin/products" className="v3-btn v3-btn-solid">
          مدیریت محصولات
        </Link>
      </div>

      <div className="v3-admin-metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link key={metric.label} href={metric.href} className="v3-admin-card">
              <span className="v3-admin-card-head">
                {metric.label}
                <Icon aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
              </span>
              <span className="v3-admin-card-value">{metric.value}</span>
              <span className="v3-admin-card-detail">{metric.detail}</span>
            </Link>
          );
        })}
      </div>

      <div className="v3-checkout" style={{ marginTop: '2rem' }}>
        <section aria-labelledby="admin-recent-orders">
          <div className="v3-admin-section-title">
            <h2 id="admin-recent-orders" className="v3-h3">
              آخرین سفارش‌ها
            </h2>
            <Link href="/admin/orders" className="v3-small">
              همه
            </Link>
          </div>

          <div className="v3-admin-table-wrap" style={{ marginTop: '0.75rem' }}>
            <table className="v3-admin-table">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>مشتری</th>
                  <th>تاریخ</th>
                  <th>وضعیت</th>
                  <th>مبلغ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="v3-admin-muted" style={{ textAlign: 'center', padding: '1.5rem' }}>
                      هنوز سفارشی ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-latin" dir="ltr" style={{ fontSize: 13 }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ fontSize: 13 }}>{order.user.name}</td>
                      <td className="v3-admin-muted">{formatJalali(order.createdAt)}</td>
                      <td>
                        <span className="v3-status">{orderStatusLabels[order.status] ?? order.status}</span>
                      </td>
                      <td style={{ fontSize: 13 }}>{formatToman(order.total)}</td>
                      <td>
                        <Link href={`/admin/orders?focus=${order.id}`} className="v3-small">
                          مدیریت
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside aria-labelledby="admin-low-stock">
          <h2 id="admin-low-stock" className="v3-h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TriangleAlert aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
            موجودی کم
          </h2>
          <ul className="v3-order-summary" style={{ marginTop: '0.75rem' }}>
            {lowStock.length === 0 ? (
              <li className="v3-body">همهٔ محصولات موجودی کافی دارند.</li>
            ) : (
              lowStock.map((product) => (
                <li key={product.id} className="v3-drawer-row" style={{ paddingBlock: '0.5rem' }}>
                  <Link href={`/products/${product.slug}`} style={{ color: 'var(--bone)' }}>
                    {product.name}
                  </Link>
                  <span>{new Intl.NumberFormat('fa-IR').format(product.stock)} عدد</span>
                </li>
              ))
            )}
          </ul>
          <Link href="/admin/products" className="v3-small" style={{ display: 'inline-flex', gap: '0.3rem', marginTop: '0.75rem' }}>
            به‌روزرسانی موجودی
            <ArrowUpLeft aria-hidden="true" size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
