import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDigits } from '@/lib/money';

export function Pagination({
  basePath,
  params,
  page,
  pageCount,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value && key !== 'page') query.set(key, value);
    }
    if (target > 1) query.set('page', String(target));
    const suffix = query.toString();
    return suffix ? `${basePath}?${suffix}` : basePath;
  };

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav aria-label="صفحه‌بندی محصولات" className="mt-14 flex items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        aria-label="صفحهٔ قبل"
        className={cn('icon-btn border border-line', page === 1 && 'pointer-events-none opacity-40')}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
      {pages.map((item) => (
        <Link
          key={item}
          href={hrefFor(item)}
          aria-current={item === page ? 'page' : undefined}
          className={cn(
            'tabular flex size-11 items-center justify-center border text-sm transition-colors',
            item === page
              ? 'border-plum bg-plum text-paper'
              : 'border-line text-plum-ink hover:border-plum hover:bg-blush/40',
          )}
        >
          {formatDigits(item)}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        aria-label="صفحهٔ بعد"
        className={cn('icon-btn border border-line', page === pageCount && 'pointer-events-none opacity-40')}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </Link>
    </nav>
  );
}
