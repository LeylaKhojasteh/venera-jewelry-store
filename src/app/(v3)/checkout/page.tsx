import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { getCartForUser } from '@/lib/cart';
import { prisma } from '@/lib/db';
import { CheckoutForm } from '@/components/v3/CheckoutForm';

export const metadata: Metadata = {
  title: 'تکمیل سفارش',
  description: 'بازبینی نشانی، کالاها و مبلغ سفارش ونرا.',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await requireUser('/checkout');
  const [cart, addresses] = await Promise.all([
    getCartForUser(user.id),
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  if (cart.lines.length === 0) {
    return (
      <div className="v3-shell v3-section">
        <h1 className="v3-display">چیزی برای ثبت نیست</h1>
        <p className="v3-body" style={{ marginTop: '1rem', maxWidth: '38ch' }}>
          سبد خرید خالی است. پیش از تکمیل سفارش، یک قطعه انتخاب کن.
        </p>
        <Link href="/products" className="v3-btn v3-btn-solid" style={{ marginTop: '1.5rem' }}>
          دیدن کالکشن
        </Link>
      </div>
    );
  }

  if (addresses.length === 0) {
    redirect('/profile/addresses?next=/checkout');
  }

  return (
    <div className="v3-shell v3-section">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <Link href="/cart">سبد خرید</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">تکمیل سفارش</span>
      </nav>

      <div className="v3-catalog-head">
        <div>
          <h1 className="v3-display">یک قدم تا ثبت</h1>
          <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '40ch' }}>
            نشانی را انتخاب کن، کالاها را بازبینی کن و سفارش را ثبت کن.
          </p>
        </div>
        <Link href="/cart" className="v3-btn v3-btn-line">
          بازگشت به سبد
        </Link>
      </div>

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
