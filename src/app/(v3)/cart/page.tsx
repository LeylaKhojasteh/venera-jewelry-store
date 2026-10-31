import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CartView } from '@/components/v3/CartView';
import { CartArt } from '@/components/v3/CartArt';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'سبد خرید ونرا؛ تعداد، موجودی و جمع سفارش را پیش از ثبت سفارش بررسی کن.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="v3-shell v3-section">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">سبد خرید</span>
      </nav>

      <div className="v3-catalog-head">
        <div>
          <h1 className="v3-display enter">سبد خرید</h1>
          <p className="v3-lead enter-2" style={{ marginTop: '1rem', maxWidth: '40ch' }}>
            آنچه انتخاب کرده‌ای اینجاست. تعداد را می‌توانی همین‌جا عوض کنی؛ قیمت‌ها از پایگاه‌داده
            خوانده می‌شوند.
          </p>
        </div>
        <CartArt />
      </div>

      <CartView />

      <section className="v3-cart-suggest" aria-labelledby="cart-suggest">
        <h2 id="cart-suggest" className="v3-h3 enter">
          پیشنهاد برای تو
        </h2>
        <div className="v3-cart-suggest-grid">
          {[
            { src: '/images/products/necklace-nilo-01.jpg', alt: 'گردنبند نیلو' },
            { src: '/images/products/bracelet-ares-01.jpg', alt: 'دستبند آرس' },
            { src: '/images/products/earrings-alara-01.jpg', alt: 'گوشواره الانا' },
            { src: '/images/products/ring-diyar-01.jpg', alt: 'انگشتر دیار' },
          ].map((item) => (
            <Link key={item.src} href="/products" className="v3-cart-suggest-item enter-2">
              <span className="v3-cart-suggest-media">
                <Image src={item.src} alt={item.alt} fill sizes="22vw" className="animate-drift object-cover" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
