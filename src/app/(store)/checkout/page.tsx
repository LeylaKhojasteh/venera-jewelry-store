import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { getCartForUser } from '@/lib/cart';
import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyLink, EmptyState } from '@/components/ui/EmptyState';
import { CheckoutForm } from '@/components/cart/CheckoutForm';

export const metadata: Metadata = {
  title: 'تکمیل سفارش',
  description: 'بازبینی نشانی، کالاها و مبلغ سفارش ونرا.',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await requireUser('/checkout');
  const [cart, addresses] = await Promise.all([
    getCartForUser(user.id),
    prisma.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] }),
  ]);

  if (cart.lines.length === 0) {
    return (
      <div className="shell section-tight">
        <PageHeader folio="۱۳" eyebrow="تکمیل سفارش" title="چیزی برای ثبت نیست" />
        <EmptyState
          className="mt-10"
          title="سبد خرید خالی است."
          description="پیش از تکمیل سفارش، یک قطعه انتخاب کن."
          action={<EmptyLink href="/products" label="دیدن کالکشن" />}
        />
      </div>
    );
  }

  if (addresses.length === 0) {
    redirect('/profile/addresses?next=/checkout');
  }

  return (
    <div className="shell section-tight">
      <PageHeader
        folio="۱۳"
        eyebrow="تکمیل سفارش"
        title="یک قدم تا ثبت"
        description="نشانی را انتخاب کن، کالاها را بازبینی کن و سفارش را ثبت کن."
        aside={
          <Link href="/cart" className="link-quiet text-sm text-plum-ink">
            بازگشت به سبد
          </Link>
        }
      />
      <CheckoutForm
        addresses={addresses.map((address) => ({
          id: address.id,
          recipient: address.recipient,
          phone: address.phone,
          province: address.province,
          city: address.city,
          postalCode: address.postalCode,
          street: address.street,
          label: address.label,
          isDefault: address.isDefault,
        }))}
        cart={cart}
      />
    </div>
  );
}
