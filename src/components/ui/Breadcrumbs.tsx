import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="مسیر صفحه" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-plum">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-plum-ink' : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronLeft aria-hidden="true" className="size-3 text-gold" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
