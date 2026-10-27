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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl">نمای کلی فروشگاه</h1>
          <p className="mt-2 text-sm text-ink-soft">اعداد از پایگاه‌دادهٔ همین نسخه خوانده می‌شوند.</p>
        </div>
        <Link href="/admin/products" className="btn btn-primary btn-sm">
          مدیریت محصولات
        </Link>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link key={metric.label} href={metric.href} className="group border border-line bg-paper-soft p-5 transition-colors hover:border-plum/40">
              <dt className="flex items-center justify-between text-xs text-ink-soft">
                {metric.label}
                <Icon aria-hidden="true" className="size-4 text-gold" />
              </dt>
              <dd className="tabular mt-3 text-xl text-plum-ink">{metric.value}</dd>
              <dd className="mt-1 text-[0.65rem] text-ink-soft">{metric.detail}</dd>
            </Link>
          );
        })}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-labelledby="admin-recent-orders">
          <div className="flex items-center justify-between">
            <h2 id="admin-recent-orders" className="font-display text-xl text-plum-ink">
              آخرین سفارش‌ها
            </h2>
            <Link href="/admin/orders" className="text-xs text-ink-soft hover:text-plum">
              همه
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto border border-line bg-paper-soft">
            <table className="w-full min-w-[34rem] text-start text-sm">
              <thead className="border-b border-line text-[0.68rem] text-ink-soft">
                <tr>
                  <th className="p-3 text-start font-medium">شماره</th>
                  <th className="p-3 text-start font-medium">مشتری</th>
                  <th className="p-3 text-start font-medium">تاریخ</th>
                  <th className="p-3 text-start font-medium">وضعیت</th>
                  <th className="p-3 text-start font-medium">مبلغ</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs text-ink-soft">
                      هنوز سفارشی ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-3 font-latin text-xs" dir="ltr">
                        {order.orderNumber}
                      </td>
                      <td className="p-3 text-xs">{order.user.name}</td>
                      <td className="p-3 text-xs text-ink-soft">{formatJalali(order.createdAt)}</td>
                      <td className="p-3">
                        <span className="badge badge-soft">{orderStatusLabels[order.status] ?? order.status}</span>
                      </td>
                      <td className="tabular p-3 text-xs">{formatToman(order.total)}</td>
                      <td className="p-3">
                        <Link href={`/admin/orders?focus=${order.id}`} className="text-xs text-plum hover:underline">
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

        <section className="lg:col-span-4" aria-labelledby="admin-low-stock">
          <h2 id="admin-low-stock" className="flex items-center gap-2 font-display text-xl text-plum-ink">
            <TriangleAlert aria-hidden="true" className="size-4 text-gold" />
            موجودی کم
          </h2>
          <ul className="mt-3 divide-y divide-line border-y border-line bg-paper-soft">
            {lowStock.length === 0 ? (
              <li className="p-4 text-xs text-ink-soft">همهٔ محصولات موجودی کافی دارند.</li>
            ) : (
              lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 p-3 text-xs">
                  <Link href={`/products/${product.slug}`} className="truncate text-plum-ink hover:text-plum">
                    {product.name}
                  </Link>
                  <span className="tabular text-ink-soft">{new Intl.NumberFormat('fa-IR').format(product.stock)} عدد</span>
                </li>
              ))
            )}
          </ul>
          <Link href="/admin/products" className="link-quiet mt-4 inline-flex text-xs text-plum-ink">
            به‌روزرسانی موجودی
            <ArrowUpLeft aria-hidden="true" className="size-3.5 text-gold" />
          </Link>
        </section>
      </div>
    </div>
  );
}
