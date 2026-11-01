import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatToman } from '@/lib/money';
import { CartView } from '@/components/v3/CartView';
import { CartArt } from '@/components/v3/CartArt';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'سبد خرید ونرا؛ تعداد، موجودی و جمع سفارش را پیش از ثبت سفارش بررسی کن.',
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const suggestions = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    take: 4,
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } } },
  });

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
            سفارشت را بررسی کن و ادامه بده.
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
          {suggestions.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="v3-cart-suggest-item enter-2">
              <span className="v3-cart-suggest-media">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 15vw"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <span className="v3-cart-suggest-body">
                <span className="v3-cart-suggest-name">{product.name}</span>
                <span className="v3-cart-suggest-price">{formatToman(product.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
