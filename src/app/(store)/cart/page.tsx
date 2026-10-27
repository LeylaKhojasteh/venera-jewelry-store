import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'سبد خرید ونرا؛ تعداد، موجودی و جمع سفارش را پیش از ثبت سفارش بررسی کن.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="shell section-tight">
      <PageHeader
        folio="۱۲"
        eyebrow="سبد"
        title="سبد خرید"
        description="آنچه انتخاب کرده‌ای اینجاست. تعداد و گزینه‌ها را می‌توانی همین‌جا تغییر بدهی؛ قیمت‌ها از پایگاه‌داده خوانده می‌شوند."
      />
      <CartView />
    </div>
  );
}
