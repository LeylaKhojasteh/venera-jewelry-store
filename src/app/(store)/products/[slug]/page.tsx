import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductBuybox } from '@/components/products/ProductBuybox';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
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
      // Toman has no ISO code; prices are stored in Toman and exposed as Rial (×10) for schema.org.
      priceCurrency: 'IRR',
      price: product.price * 10,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/products/${product.slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'محصولات', item: '/products' },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categoryName,
        item: `/products?category=${product.categorySlug}`,
      },
      { '@type': 'ListItem', position: 4, name: product.name },
    ],
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="shell section-tight">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'خانه', href: '/' },
            { label: 'محصولات', href: '/products' },
            { label: product.categoryName, href: `/products?category=${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <ProductBuybox product={product} />

            <div className="mt-9 lg:sticky lg:top-28">
              <Accordion>
                <AccordionItem title="داستان قطعه" defaultOpen>
                  {product.story}
                </AccordionItem>
                <AccordionItem title="جنس و اندازه">{product.materials}</AccordionItem>
                <AccordionItem title="نگهداری">{product.care}</AccordionItem>
                <AccordionItem title="ثبت سفارش">
                  موجودی انبار هنگام ثبت سفارش بررسی می‌شود و قیمت‌ها از پایگاه‌داده خوانده می‌شوند. اگر
                  موجودی تغییر کرده باشد، پیش از ثبت به تو اطلاع داده می‌شود.
                </AccordionItem>
              </Accordion>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-ink-soft">کد قطعه</dt>
                  <dd className="mt-1 text-plum-ink" dir="ltr">
                    {product.sku}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">دسته</dt>
                  <dd className="mt-1">
                    <Link href={`/products?category=${product.categorySlug}`} className="text-plum-ink hover:text-plum">
                      {product.categoryName}
                    </Link>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-ink-soft">برچسب‌ها</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span key={tag} className="chip pointer-events-none text-[0.65rem]">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-line">
          <div className="shell section-tight">
            <SectionHeading
              eyebrow="تکمیل انتخاب"
              title="شاید اینها هم به کارت بیاید"
              action={
                <Link href={`/products?category=${product.categorySlug}`} className="link-quiet text-sm">
                  همهٔ {product.categoryName}ها
                </Link>
              }
            />
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-5">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 60}>
                  <ProductCard product={item} sizes="(max-width: 768px) 50vw, 22vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </div>
  );
}
