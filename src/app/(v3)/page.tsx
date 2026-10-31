import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { getProductCards, getHomeContent } from '@/lib/catalog';
import { NecklaceLine } from '@/components/v3/NecklaceLine';
import { ProductRail } from '@/components/v3/ProductRail';
import { CatalogGrid } from '@/components/v3/CatalogGrid';
import { CategoryStory } from '@/components/v3/CategoryStory';
import { Magnetic } from '@/components/v3/Magnetic';
import { demoContact } from '@/lib/constants';
import { formatDigits, formatToman } from '@/lib/money';
import type { ProductCardData } from '@/types';

export const metadata: Metadata = {
  title: 'ونرا | اکسسوری استیل — برای گردن، گوش، دست',
  description:
    'گردنبند، دستبند، گوشواره و انگشتر استیل؛ طراحی و ساخت تهران. اندازه و وزن هر قطعه در صفحهٔ محصول نوشته شده است.',
  alternates: { canonical: '/' },
};

export default async function V3HomePage() {
  const products = await getProductCards({
    take: 12,
    orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
  });
  const { bestSellers, discounted } = await getHomeContent();

  const railOrder = ['necklace', 'bracelet', 'earrings', 'ring'] as const;
  const rail = railOrder
    .map((slug) => products.find((product) => product.categorySlug === slug))
    .filter((product): product is ProductCardData => Boolean(product));
  const railProducts = rail.length > 0 ? rail : products.slice(0, 4);
  const cover = products.find((product) => product.categorySlug === 'bracelet') ?? products[0];
  const countOf = (slug: string) => products.filter((product) => product.categorySlug === slug).length;

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
              <p className="v3-lead">
                گردنبند، دستبند، گوشواره و انگشتر استیل؛ طراحی و ساخت تهران. اندازه و وزن هر قطعه
                در صفحهٔ محصول نوشته شده است.
              </p>
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
              <div className="v3-hero-meta">
                <span>
                  <strong>{formatDigits(countOf('necklace'))} گردنبند</strong>
                  برای گردن
                </span>
                <span>
                  <strong>{formatDigits(countOf('bracelet'))} دستبند</strong>
                  برای مچ
                </span>
                <span>
                  <strong>{formatDigits(countOf('earrings'))} گوشواره</strong>
                  برای گوش
                </span>
                <span>
                  <strong>{formatDigits(countOf('ring'))} انگشتر</strong>
                  برای انگشت
                </span>
              </div>
            </div>

            <NecklaceLine />
          </div>
        </div>
      </section>

      <ProductRail products={railProducts} />

      <section className="v3-section" aria-labelledby="best-title">
        <div className="v3-shell">
          <div className="v3-rail-head">
            <div>
              <h2 id="best-title" className="v3-h2">
                محبوب‌ها
              </h2>
              <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '38ch' }}>
                قطعه‌هایی که بیشتر از همه انتخاب می‌شوند؛ از گردنبند تا انگشتر.
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

      <section className="v3-section" aria-labelledby="index-title">
        <div className="v3-shell">
          <div className="v3-index-head">
            <div>
              <h2 id="index-title" className="v3-h2">
                با نام و قیمت
              </h2>
              <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '36ch' }}>
                همهٔ قطعه‌ها، از گردنبند و دستبند تا گوشواره و انگشتر. قیمت‌ها به تومان و موجودی در
                صفحهٔ هر قطعه به‌روز است.
              </p>
            </div>
            <Link href="/products" className="v3-btn v3-btn-line">
              همهٔ محصولات
            </Link>
          </div>

          <div className="v3-index-layout">
            {cover ? (
              <div className="v3-index-media">
                <Image
                  src={cover.image}
                  alt={cover.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 38vw"
                />
              </div>
            ) : null}

            <div className="v3-index">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="v3-row">
                  <span className="v3-row-media">
                    <Image src={product.image} alt={product.imageAlt} fill sizes="64px" />
                  </span>
                  <span className="v3-row-text">
                    <span className="v3-row-name">{product.name}</span>
                    <span className="v3-row-meta">
                      {product.categoryName} · استیل ۳۱۶ ·{' '}
                      <span className="v3-row-price">{formatToman(product.price)}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="v3-shell" aria-labelledby="close-title">
        <div className="v3-close">
          <div>
            <h2 id="close-title" className="v3-display">
              قطعه‌ات را
              <br />
              انتخاب کن.
            </h2>
            <p className="v3-body" style={{ marginTop: '1.25rem', maxWidth: '34ch' }}>
              گردنبند، دستبند یا گوشواره؛ اگر بین دو اندازه ماندی بنویس، با هم انتخاب می‌کنیم. سفارش‌ها
              از همین سایت ثبت می‌شوند.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
              <Magnetic>
                <Link href="/products" className="v3-btn v3-btn-solid">
                  دیدن کالکشن
                </Link>
              </Magnetic>
              <a href={`mailto:${demoContact.email}`} className="v3-btn v3-btn-line">
                نوشتن به ونرا
              </a>
            </div>
          </div>

          <svg
            className="v3-close-art"
            viewBox="0 0 300 380"
            role="img"
            aria-label="طرح خطی گردنبند"
            style={{ color: 'var(--bone)' }}
          >
            <path
              d="M40 24 C40 220 100 340 150 340 C200 340 260 220 260 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            {[
              [60, 130],
              [78, 205],
              [105, 275],
              [150, 318],
              [195, 275],
              [222, 205],
              [240, 130],
            ].map(([cx, cy], index) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={index === 3 ? 5 : 3.2}
                style={{ fill: index === 3 ? 'var(--copper)' : 'currentColor' }}
                fillOpacity={index === 3 ? 1 : 0.8}
              />
            ))}
            <path
              d="M150 340 L166 362 L150 382 L134 362 Z"
              fill="none"
              style={{ stroke: 'var(--copper)' }}
              strokeWidth="1.4"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
