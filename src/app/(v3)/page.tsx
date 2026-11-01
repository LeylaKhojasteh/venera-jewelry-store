import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { getProductCards, getHomeContent, getCategories } from '@/lib/catalog';
import { HeroJewelry } from '@/components/v3/HeroJewelry';
import { CategoryRail } from '@/components/v3/CategoryRail';
import { CatalogGrid } from '@/components/v3/CatalogGrid';
import { CategoryStory } from '@/components/v3/CategoryStory';
import { Faq } from '@/components/v3/Faq';
import { Magnetic } from '@/components/v3/Magnetic';
import type { ProductCardData } from '@/types';

export const metadata: Metadata = {
  title: 'ونرا | اکسسوری استیل — برای گردن، گوش، دست',
  description:
    'گردنبند، دستبند، گوشواره و انگشتر استیل؛ طراحی و ساخت تهران. اندازه و وزن هر آیتم در صفحهٔ محصول نوشته شده است.',
  alternates: { canonical: '/' },
};

export default async function V3HomePage() {
  const [products, { bestSellers, discounted }, categories] = await Promise.all([
    getProductCards({
      take: 12,
      orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
    }),
    getHomeContent(),
    getCategories(),
  ]);

  const railOrder = ['necklace', 'bracelet', 'earrings', 'ring'] as const;
  const rail = railOrder
    .map((slug) => products.find((product) => product.categorySlug === slug))
    .filter((product): product is ProductCardData => Boolean(product));
  const railProducts = rail.length > 0 ? rail : products.slice(0, 4);

  return (
    <>
      <section className="v3-hero">
        <div className="v3-shell">
          <div className="v3-hero-grid">
            <div className="v3-hero-copy">
              <h1 className="v3-display">
                برای گردن،
                <br />
                گوش، دست.
              </h1>
              <p className="v3-lead">اکسسوری مدرن برای تمام سلیقه‌ها</p>
              <div className="v3-hero-actions">
                <Magnetic>
                  <Link href="/products" className="v3-btn v3-btn-solid">
                    دیدن کالکشن
                    <ArrowUpLeft aria-hidden="true" size={17} />
                  </Link>
                </Magnetic>
                <Link href="/about" className="v3-btn v3-btn-line">
                  داستان ونرا
                </Link>
              </div>
            </div>

            <HeroJewelry />
          </div>
        </div>
      </section>

      <CategoryRail categories={categories} products={products} />

      <section className="v3-section" aria-labelledby="best-title">
        <div className="v3-shell">
          <div className="v3-rail-head">
            <div>
              <h2 id="best-title" className="v3-h2">
                محبوب‌ها
              </h2>
              <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '38ch' }}>
                آیتم‌هایی که بیشتر از همه انتخاب می‌شوند؛ از گردنبند تا انگشتر.
              </p>
            </div>
            <Link href="/products?sort=bestseller" className="v3-btn v3-btn-line">
              همهٔ محبوب‌ها
            </Link>
          </div>
          <CatalogGrid products={bestSellers.slice(0, 4)} layoutPrefix="best" compact />
        </div>
      </section>

      <section className="v3-section" aria-labelledby="sale-title" style={{ background: 'var(--ink-2)' }}>
        <div className="v3-shell">
          <div className="v3-rail-head">
            <div>
              <h2 id="sale-title" className="v3-h2">
                تخفیف‌دارها
              </h2>
              <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '38ch' }}>
                قیمت پیش از تخفیف خط می‌خورد و مبلغ نهایی همان است که در صفحهٔ محصول می‌بینی.
              </p>
            </div>
            <Link href="/products?discount=1" className="v3-btn v3-btn-line">
              همهٔ تخفیف‌ها
            </Link>
          </div>
          <CatalogGrid products={discounted.slice(0, 4)} layoutPrefix="sale" compact />
        </div>
      </section>

      <CategoryStory products={railProducts} />

      <section className="v3-section" aria-labelledby="faq-title">
        <div className="v3-shell v3-faq">
          <div>
            <h2 id="faq-title" className="v3-h2">
              سؤالات پرتکرار
            </h2>
            <p className="v3-body" style={{ marginTop: '1rem', maxWidth: '30ch' }}>
              پاسخ به سوالات پرتکرار شما
            </p>
          </div>

          <Faq
            items={[
              {
                question: 'چطور می‌تونم پرداخت کنم؟',
                answer: 'از قسمت سبد خرید روی تسویه حساب بزنید و وارد درگاه پرداخت شوید.',
              },
              {
                question: 'محصولات اصل هست؟',
                answer: 'همه محصولات با ضمانت اصالت کالا ارائه می‌شود.',
              },
              {
                question: 'تحویل به چه شکل است؟',
                answer:
                  'تحویل توسط پست و بین ۷ الی ۱۰ روز کاری انجام می‌شود و می‌توانید از قسمت سفارشات پروفایل پیگیری کنید.',
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
