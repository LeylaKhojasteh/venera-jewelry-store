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
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

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
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'پنل من', href: '/profile' },
          { label: 'سفارش‌ها', href: '/profile/orders' },
          { label: order.orderNumber },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-latin text-2xl tracking-[0.14em] text-plum-ink" dir="ltr">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-xs text-ink-soft">{formatJalaliDateTime(order.createdAt)}</p>
        </div>
        <span className={cancelled ? 'badge badge-sale' : 'badge'}>{orderStatusLabels[order.status] ?? order.status}</span>
      </div>

      {!cancelled ? (
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {flow.map((step, index) => {
            const done = currentIndex >= index;
            return (
              <li key={step.key} className="flex items-center gap-2 text-xs">
                <span
                  className={
                    done
                      ? 'flex size-6 items-center justify-center rounded-full bg-plum text-[0.62rem] text-paper'
                      : 'flex size-6 items-center justify-center rounded-full border border-line text-[0.62rem] text-ink-soft'
                  }
                >
                  {new Intl.NumberFormat('fa-IR').format(index + 1)}
                </span>
                <span className={done ? 'text-plum-ink' : 'text-ink-soft'}>{step.label}</span>
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="flex items-center gap-2 font-display text-xl text-plum-ink">
            <Package aria-hidden="true" className="size-4 text-gold" />
            کالاها
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-blush">
                  <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-plum-ink">
                    <Link href={`/products/${item.slug}`} className="hover:text-plum">
                      {item.name}
                    </Link>
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {item.variantLabel ? `${item.variantLabel} · ` : ''}
                    {new Intl.NumberFormat('fa-IR').format(item.quantity)} عدد ·{' '}
                    {formatToman(item.unitPrice)} هر عدد
                  </p>
                  <p className="mt-1 text-[0.65rem] text-ink-soft" dir="ltr">
                    {item.sku}
                  </p>
                </div>
                <p className="tabular text-sm text-plum-ink">{formatToman(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          {order.note ? (
            <div className="mt-6 border border-line bg-paper-soft p-4">
              <p className="text-xs text-ink-soft">یادداشت سفارش</p>
              <p className="mt-1 text-sm leading-7 text-plum-ink">{order.note}</p>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-5">
          <div className="summary-card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg text-plum-ink">
              <MapPin aria-hidden="true" className="size-4 text-gold" />
              نشانی ثبت‌شده
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-soft">
              {address.recipient}
              <br />
              {address.province}، {address.city}
              <br />
              {address.street}
            </p>
            <p className="mt-2 text-[0.68rem] text-ink-soft" dir="ltr">
              {address.phone} · {address.postalCode}
            </p>

            <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">کالاها</dt>
                <dd className="tabular">{formatToman(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">ارسال</dt>
                <dd className="tabular">{order.shipping === 0 ? 'رایگان' : formatToman(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-medium">
                <dt>مبلغ کل</dt>
                <dd className="tabular">{formatToman(order.total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
