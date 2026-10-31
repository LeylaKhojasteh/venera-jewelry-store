import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { getProductCards } from '@/lib/catalog';
import { NecklaceLine } from '@/components/v3/NecklaceLine';
import { ProductRail } from '@/components/v3/ProductRail';
import { LengthGuide } from '@/components/v3/LengthGuide';
import { demoContact } from '@/lib/constants';
import { formatToman } from '@/lib/money';

export const metadata: Metadata = {
  title: 'ونرا | زیورآلات استیل — خطی که می‌ماند',
  description:
    'چهار گردنبند استیل، طراحی و ساخت تهران. خطی که روی گردن می‌نشیند و با تو می‌ماند.',
  alternates: { canonical: '/' },
};

export default async function V3HomePage() {
  const necklaces = await getProductCards({
    where: { category: { slug: 'necklace' } },
    take: 4,
    orderBy: [{ price: 'asc' }],
  });
  const cover = necklaces[3] ?? necklaces[0];

  return (
    <>
      <section className="v3-hero">
        <div className="v3-shell">
          <div className="v3-hero-grid">
            <div className="v3-hero-copy">
              <h1 className="v3-display">
                خطی که
                <br />
                می‌ماند.
              </h1>
              <p className="v3-lead">
                چهار گردنبند استیل، طراحی و ساخت تهران. خطی که روی گردن می‌نشیند و با تو می‌ماند.
              </p>
              <div className="v3-hero-actions">
                <Link href="/products" className="v3-btn v3-btn-solid">
                  دیدن کالکشن
                  <ArrowUpLeft aria-hidden="true" size={17} />
                </Link>
                <Link href="/about" className="v3-btn v3-btn-line">
                  داستان ونرا
                </Link>
              </div>
              <div className="v3-hero-meta">
                <span>
                  <strong>۴ قطعه</strong>
                  کالکشن گردنبند
                </span>
                <span>
                  <strong>استیل ۳۱۶</strong>
                  بدون آبکاری رنگی
                </span>
                <span>
                  <strong>تهران</strong>
                  طراحی و ساخت
                </span>
              </div>
            </div>

            <NecklaceLine />
          </div>
        </div>
      </section>

      <ProductRail products={necklaces} />

      <LengthGuide />

      <section className="v3-section" aria-labelledby="index-title">
        <div className="v3-shell">
          <div className="v3-index-head">
            <div>
              <h2 id="index-title" className="v3-h2">
                فهرست
              </h2>
              <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '36ch' }}>
                چهار گردنبند، از کوتاه تا بلند. قیمت‌ها به تومان و موجودی در صفحهٔ هر قطعه به‌روز است.
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
              {necklaces.map((product) => (
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

      <section className="v3-section" aria-labelledby="materials-title" style={{ background: 'var(--ink-2)' }}>
        <div className="v3-shell v3-materials">
          <div>
            <h2 id="materials-title" className="v3-h2">
              استیل، بدون ادعا.
            </h2>
            <p className="v3-lead" style={{ marginTop: '1.25rem', maxWidth: '34ch' }}>
              فلز، استیل ۳۱۶ است؛ بدون آبکاری طلایی و بدون روکش رنگی. مرواریدها پرورشی‌اند. چیزی که
              می‌بینی همان چیزی است که می‌رسد.
            </p>
          </div>
          <div className="v3-materials-facts">
            <span>استیل ۳۱۶</span>
            <span>مروارید پرورشی</span>
            <span>ساخت تهران</span>
            <span>کالکشن ۱۴۰۵</span>
          </div>
        </div>
      </section>

      <section className="v3-shell" aria-labelledby="close-title">
        <div className="v3-close">
          <div>
            <h2 id="close-title" className="v3-display">
              چیزی برای
              <br />
              ماندن.
            </h2>
            <p className="v3-body" style={{ marginTop: '1.25rem', maxWidth: '34ch' }}>
              اگر بین دو طول ماندی، بنویس؛ با هم انتخاب می‌کنیم. سفارش‌ها از همین سایت ثبت می‌شوند.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
              <Link href="/products" className="v3-btn v3-btn-solid">
                دیدن کالکشن
              </Link>
              <a href={`mailto:${demoContact.email}`} className="v3-btn v3-btn-line">
                نوشتن به ونرا
              </a>
            </div>
          </div>

          <svg className="v3-close-art" viewBox="0 0 300 380" role="img" aria-label="طرح خطی گردنبند">
            <path
              d="M40 24 C40 220 100 340 150 340 C200 340 260 220 260 24"
              fill="none"
              stroke="#EDE6D8"
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
                fill={index === 3 ? '#C4714C' : '#EDE6D8'}
                fillOpacity={index === 3 ? 1 : 0.8}
              />
            ))}
            <path d="M150 340 L166 362 L150 382 L134 362 Z" fill="none" stroke="#C4714C" strokeWidth="1.4" />
          </svg>
        </div>
      </section>
    </>
  );
}
