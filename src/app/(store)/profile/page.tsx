import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpLeft, MapPin, Package, Receipt } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalali } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels, emptyOrdersMessage } from '@/lib/constants';
import { EmptyState, EmptyLink } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'پنل کاربری',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requireUser('/profile');

  const [orders, orderCount, addressCount, defaultAddress] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { items: { select: { quantity: true } } },
    }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.address.findFirst({ where: { userId: user.id, isDefault: true } }),
  ]);

  const spent = await prisma.order.aggregate({
    where: { userId: user.id, status: { not: 'CANCELLED' } },
    _sum: { total: true },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-3xl">سلام، {user.name.split(' ')[0]}.</h1>
          <p className="mt-2 text-sm text-ink-soft">
            وضعیت سفارش‌ها، نشانی‌ها و اطلاعات حسابت اینجاست.
          </p>
        </div>
        <Link href="/products" className="link-quiet text-sm text-plum-ink">
          رفتن به کالکشن
          <ArrowUpLeft aria-hidden="true" className="size-4 text-gold" />
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'سفارش‌های ثبت‌شده', value: new Intl.NumberFormat('fa-IR').format(orderCount) },
          { label: 'مجموع سفارش‌ها', value: formatToman(spent._sum.total ?? 0) },
          { label: 'نشانی‌های ذخیره‌شده', value: new Intl.NumberFormat('fa-IR').format(addressCount) },
          { label: 'نوع حساب', value: user.role === 'ADMIN' ? 'مدیر' : 'مشتری' },
        ].map((item) => (
          <div key={item.label} className="border border-line bg-paper-soft p-4">
            <dt className="text-[0.68rem] text-ink-soft">{item.label}</dt>
            <dd className="tabular mt-2 text-lg text-plum-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="recent-orders">
        <div className="flex items-center justify-between">
          <h2 id="recent-orders" className="flex items-center gap-2 font-display text-xl text-plum-ink">
            <Package aria-hidden="true" className="size-4 text-gold" />
            آخرین سفارش‌ها
          </h2>
          {orderCount > 0 ? (
            <Link href="/profile/orders" className="text-xs text-ink-soft transition-colors hover:text-plum">
              همهٔ سفارش‌ها
            </Link>
          ) : null}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            className="mt-5"
            title="هنوز سفارشی ثبت نکردی."
            description={emptyOrdersMessage}
            action={<EmptyLink href="/products" label="دیدن کالکشن" />}
          />
        ) : (
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-5 transition-colors hover:bg-paper-soft/60"
                >
                  <div>
                    <p className="font-latin text-sm tracking-[0.1em] text-plum-ink" dir="ltr">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {formatJalali(order.createdAt)} ·{' '}
                      {new Intl.NumberFormat('fa-IR').format(order.items.reduce((sum, item) => sum + item.quantity, 0))} قلم
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="badge badge-soft">{orderStatusLabels[order.status] ?? order.status}</span>
                    <span className="tabular text-sm text-plum-ink">{formatToman(order.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10" aria-labelledby="default-address">
        <div className="flex items-center justify-between">
          <h2 id="default-address" className="flex items-center gap-2 font-display text-xl text-plum-ink">
            <MapPin aria-hidden="true" className="size-4 text-gold" />
            نشانی پیش‌فرض
          </h2>
          <Link href="/profile/addresses" className="text-xs text-ink-soft transition-colors hover:text-plum">
            مدیریت نشانی‌ها
          </Link>
        </div>

        {defaultAddress ? (
          <div className="mt-5 border border-line bg-paper-soft p-5 text-sm leading-7">
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-plum-ink">{defaultAddress.recipient}</span>
              {defaultAddress.label ? <span className="badge badge-soft">{defaultAddress.label}</span> : null}
            </p>
            <p className="mt-1 text-ink-soft">
              {defaultAddress.province}، {defaultAddress.city}، {defaultAddress.street}
            </p>
            <p className="mt-1 text-xs text-ink-soft" dir="ltr">
              {defaultAddress.phone} · {defaultAddress.postalCode}
            </p>
          </div>
        ) : (
          <p className="mt-5 border border-dashed border-line px-5 py-6 text-sm text-ink-soft">
            نشانی پیش‌فرضی ثبت نشده.{' '}
            <Link href="/profile/addresses" className="text-plum underline-offset-4 hover:underline">
              افزودن نشانی
            </Link>
          </p>
        )}
      </section>

      <p className="mt-10 flex items-start gap-2 border-t border-line pt-6 text-[0.68rem] leading-6 text-ink-soft">
        <Receipt aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-gold" />
        وضعیت و جزئیات سفارش‌ها از همین پنل قابل پیگیری است.
      </p>
    </div>
  );
}
