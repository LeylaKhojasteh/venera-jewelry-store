import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { formatToman } from '@/lib/money';
import { orderStatusLabels } from '@/lib/constants';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

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
    <div className="shell section-tight">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: 'خانه', href: '/' },
          { label: 'پنل من', href: '/profile' },
          { label: 'سفارش‌ها', href: '/profile/orders' },
          { label: order.orderNumber },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full border border-success/40 text-success">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="text-sm text-plum-ink">{orderStatusLabels[order.status] ?? order.status}</p>
            </div>
          </div>

          <h1 className="display mt-6 text-3xl">ممنون که انتخاب کردی.</h1>
          <p className="mt-4 max-w-xl text-sm leading-8 text-ink-soft">
            سفارش تو ثبت شد و در پنل کاربری‌ات می‌ماند. جزئیات و وضعیت آن را از همان‌جا پیگیری کن.
          </p>

          <div className="mt-8 border border-line bg-paper-soft p-6">
            <p className="text-xs text-ink-soft">شمارهٔ سفارش</p>
            <p className="mt-1 font-latin text-2xl tracking-[0.12em] text-plum-ink" dir="ltr">
              {order.orderNumber}
            </p>
            <p className="mt-2 text-xs text-ink-soft">{formatJalaliDateTime(order.createdAt)}</p>

            <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <MapPin aria-hidden="true" className="size-3.5 text-gold" />
                  نشانی
                </p>
                <p className="mt-2 text-sm leading-7 text-plum-ink">
                  {address.recipient}
                  <br />
                  {address.province}، {address.city}
                  <br />
                  {address.street}
                </p>
                <p className="mt-1 text-[0.68rem] text-ink-soft" dir="ltr">
                  {address.phone} · {address.postalCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">جمع‌بندی</p>
                <dl className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">کالاها</dt>
                    <dd className="tabular">{formatToman(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">ارسال</dt>
                    <dd className="tabular">{order.shipping === 0 ? 'رایگان' : formatToman(order.shipping)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-line pt-2 font-medium">
                    <dt>مبلغ کل</dt>
                    <dd className="tabular">{formatToman(order.total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/profile/orders/${order.id}`} className="btn btn-primary">
              جزئیات سفارش در پنل
            </Link>
            <Link href="/products" className="btn btn-outline">
              ادامهٔ خرید
            </Link>
          </div>

          <p className="mt-6 text-[0.68rem] leading-6 text-ink-soft">
            برای پیگیری، شمارهٔ سفارش را نگه دار یا از پنل کاربری وارد صفحهٔ سفارش شو.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="summary-card p-6">
            <h2 className="font-display text-xl text-plum-ink">کالاهای سفارش</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-blush">
                    <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-plum-ink">{item.name}</p>
                    <p className="mt-0.5 text-[0.68rem] text-ink-soft">
                      {item.variantLabel ? `${item.variantLabel} · ` : ''}
                      {new Intl.NumberFormat('fa-IR').format(item.quantity)} عدد
                    </p>
                  </div>
                  <p className="tabular text-xs text-plum-ink">{formatToman(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            {order.note ? (
              <div className="mt-5">
                <p className="text-xs text-ink-soft">یادداشت</p>
                <p className="mt-1 text-sm leading-7 text-plum-ink">{order.note}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
