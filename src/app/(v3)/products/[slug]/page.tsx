import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { PdpGallery } from '@/components/v3/PdpGallery';
import { PdpBuybox } from '@/components/v3/PdpBuybox';
import { CatalogGrid } from '@/components/v3/CatalogGrid';
import { formatNumber } from '@/lib/money';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'محصول پیدا نشد' };

  return {
    title: product.name,
    description: `${product.description} — ${product.materials}. قیمت: ${formatNumber(product.price)} تومان.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ونرا`,
      description: product.description,
      images: [{ url: product.image, width: 1000, height: 1250, alt: product.imageAlt }],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}${product.image}`],
    sku: product.sku,
    category: product.categoryName,
    brand: { '@type': 'Brand', name: 'Venera' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: product.price * 10,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/products/${product.slug}`,
    },
  };

  return (
    <div className="v3-section">
      <div className="v3-shell">
        <nav className="v3-crumbs" aria-label="مسیر">
          <Link href="/">خانه</Link>
          <span aria-hidden="true">/</span>
          <Link href="/products">محصولات</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products?category=${product.categorySlug}`}>{product.categoryName}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="v3-pdp">
          <PdpGallery images={product.images} name={product.name} />

          <div>
            <PdpBuybox product={product} />

            <div className="v3-details enter">
              <details open>
                <summary>داستان آیتم</summary>
                <p>{product.story}</p>
              </details>
              <details>
                <summary>جنس و اندازه</summary>
                <p>{product.materials}</p>
              </details>
              <details>
                <summary>نگهداری</summary>
                <p>{product.care}</p>
              </details>
            </div>

            <div className="v3-meta-grid enter-2">
              <div>
                کد آیتم
                <strong dir="ltr">{product.sku}</strong>
              </div>
              <div>
                دسته
                <strong>
                  <Link href={`/products?category=${product.categorySlug}`}>{product.categoryName}</Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="v3-shell" style={{ marginTop: '5rem' }}>
          <div className="v3-rail-head">
            <div>
              <h2 className="v3-h2 enter">شاید این هارو هم دوست داشته باشی</h2>
            </div>
            <Link href={`/products?category=${product.categorySlug}`} className="v3-btn v3-btn-line enter-3">
              همهٔ {product.categoryName}ها
            </Link>
          </div>
          <div className="v3-related-grid">
            <CatalogGrid products={related} compact />
          </div>
        </div>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
