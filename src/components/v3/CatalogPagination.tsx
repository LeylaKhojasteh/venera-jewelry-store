import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CatalogParams } from '@/lib/catalog-url';

function hrefFor(current: CatalogParams, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (key === 'page' || !value) continue;
    query.set(key, value);
  }
  if (page > 1) query.set('page', String(page));
  const suffix = query.toString();
  return suffix ? `/products?${suffix}` : '/products';
}

export function CatalogPagination({
  current,
  page,
  pageCount,
}: {
  current: CatalogParams;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === pageCount || Math.abs(item - page) <= 1,
  );

  return (
    <nav className="v3-pagination" aria-label="صفحه‌بندی">
      {page > 1 ? (
        <Link href={hrefFor(current, page - 1)} className="v3-pagination-step" aria-label="صفحهٔ قبل">
          <ChevronRight aria-hidden="true" size={18} />
        </Link>
      ) : null}

      {pages.map((item, index) => {
        const previous = pages[index - 1];
        const gap = previous && item - previous > 1;
        return (
          <span key={item} className="v3-pagination-item">
            {gap ? <span className="v3-pagination-gap">…</span> : null}
            <Link
              href={hrefFor(current, item)}
              aria-current={item === page ? 'page' : undefined}
              className="v3-pagination-link"
            >
              {new Intl.NumberFormat('fa-IR').format(item)}
            </Link>
          </span>
        );
      })}

      {page < pageCount ? (
        <Link href={hrefFor(current, page + 1)} className="v3-pagination-step" aria-label="صفحهٔ بعد">
          <ChevronLeft aria-hidden="true" size={18} />
        </Link>
      ) : null}
    </nav>
  );
}
