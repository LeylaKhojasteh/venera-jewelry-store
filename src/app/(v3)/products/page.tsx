import type { Metadata } from 'next';
import Link from 'next/link';
import { getCatalog, getCategories } from '@/lib/catalog';
import { productQuerySchema } from '@/lib/validation';
import { CatalogFilters } from '@/components/v3/CatalogFilters';
import { CatalogGrid } from '@/components/v3/CatalogGrid';
import { CatalogPagination } from '@/components/v3/CatalogPagination';
import { formatDigits } from '@/lib/money';
import type { CatalogParams } from '@/lib/catalog-url';

export const metadata: Metadata = {
  title: 'همهٔ زیورآلات',
  description:
    'کاتالوگ ونرا: گردنبند، دستبند، گوشواره و انگشتر استیل با فیلتر دسته‌بندی، جنسیت، قیمت و موجودی.',
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

  return (
    <div className="v3-shell v3-section v3-catalog">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">محصولات</span>
      </nav>

      <div className="v3-catalog-head">
        <div>
          <h1 className="v3-display">همهٔ زیورآلات</h1>
          <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '42ch' }}>
            گردنبند، دستبند، گوشواره و انگشتر؛ همه از استیل ۳۱۶. فیلترها روی سرور اجرا می‌شوند، پس
            هر نتیجه همان چیزی است که در انبار هست.
          </p>
        </div>
        <p className="v3-catalog-count">{formatDigits(catalog.total)} آیتم</p>
      </div>

      <div className="v3-catalog-layout">
        <aside className="v3-catalog-side" aria-label="فیلتر محصولات">
          <CatalogFilters current={current} categories={categories} />
        </aside>

        <div>
          <details className="v3-filters-mobile">
            <summary>فیلترها و مرتب‌سازی</summary>
            <CatalogFilters current={current} categories={categories} idPrefix="mobile" />
          </details>

          {catalog.items.length === 0 ? (
            <div className="v3-empty">
              <h2 className="v3-h2">چیزی با این فیلترها پیدا نشد</h2>
              <p className="v3-body">ترکیب فیلترها را ساده‌تر کن یا جست‌وجو را پاک کن.</p>
              <Link href="/products" className="v3-btn v3-btn-line">
                دیدن همه محصولات
              </Link>
            </div>
          ) : (
            <CatalogGrid products={catalog.items} />
          )}

          <CatalogPagination current={current} page={catalog.page} pageCount={catalog.pageCount} />
        </div>
      </div>
    </div>
  );
}
