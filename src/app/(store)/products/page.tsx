import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCatalog, getCategories } from '@/lib/catalog';
import { productQuerySchema } from '@/lib/validation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, EmptyLink } from '@/components/ui/EmptyState';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import {
  CatalogSearch,
  FilterControls,
  SortSelect,
} from '@/components/products/CatalogControls';
import { MobileFilterDrawer } from '@/components/products/MobileFilterDrawer';
import { ActiveFilterChips, CountLabel, activeFilterCount } from '@/components/products/FilterChips';
import type { CatalogParams } from '@/lib/catalog-url';

export const metadata: Metadata = {
  title: 'همهٔ زیورآلات',
  description:
    'کاتالوگ کامل ونرا: گردنبند، دستبند، گوشواره و انگشتر زنانه و مردانه با فیلتر دسته‌بندی، جنسیت، قیمت و موجودی.',
  alternates: { canonical: '/products' },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeParams(input: Record<string, string | string[] | undefined>): CatalogParams {
  const result: CatalogParams = {};
  for (const [key, value] of Object.entries(input)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined && first !== '') result[key] = first;
  }
  return result;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const raw = normalizeParams(await searchParams);
  const parsed = productQuerySchema.parse(raw);
  const current: CatalogParams = {
    q: parsed.q,
    category: parsed.category,
    gender: parsed.gender,
    min: parsed.min !== undefined ? String(parsed.min) : undefined,
    max: parsed.max !== undefined ? String(parsed.max) : undefined,
    inStock: parsed.inStock ? '1' : undefined,
    discount: parsed.discount ? '1' : undefined,
    sort: parsed.sort,
    page: parsed.page && parsed.page > 1 ? String(parsed.page) : undefined,
  };

  const [catalog, categories] = await Promise.all([
    getCatalog({
      q: parsed.q,
      category: parsed.category,
      gender: parsed.gender,
      min: parsed.min,
      max: parsed.max,
      inStock: parsed.inStock,
      discount: parsed.discount,
      sort: parsed.sort,
      page: parsed.page ?? 1,
    }),
    getCategories(),
  ]);

  const activeCount = activeFilterCount(current);

  return (
    <div className="shell section-tight">
      <Breadcrumbs items={[{ label: 'خانه', href: '/' }, { label: 'محصولات' }]} className="mb-8" />

      <PageHeader
        folio="۰۵"
        eyebrow="کاتالوگ"
        title="همهٔ زیورآلات"
        description="ده قطعهٔ منتخب در چهار دسته؛ فیلترها را روی سرور اجرا می‌کنیم تا هر نتیجه، دقیقاً همان چیزی باشد که در پایگاه‌داده هست."
        aside={<CountLabel total={catalog.total} sort={current.sort} />}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="hidden lg:col-span-3 lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-28">
            <FilterControls current={current} categories={categories} />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <CatalogSearch current={current} />
            <div className="flex items-center gap-2">
              <MobileFilterDrawer current={current} categories={categories} activeCount={activeCount} />
              <SortSelect current={current} />
            </div>
          </div>

          <div className="mt-5">
            <ActiveFilterChips current={current} categories={categories} />
          </div>

          <Suspense fallback={null}>
            {catalog.items.length === 0 ? (
              <EmptyState
                className="mt-10"
                title="چیزی با این فیلترها پیدا نشد"
                description="ترکیب فیلترها را ساده‌تر کن یا جست‌وجو را پاک کن. همهٔ قطعه‌ها هنوز اینجا هستند."
                action={<EmptyLink href="/products" label="دیدن همهٔ محصولات" />}
              />
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-5">
                {catalog.items.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index, 5) * 50}>
                    <ProductCard
                      product={product}
                      priority={index < 3}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 25vw"
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </Suspense>

          <Pagination basePath="/products" params={current} page={catalog.page} pageCount={catalog.pageCount} />
        </div>
      </div>
    </div>
  );
}
