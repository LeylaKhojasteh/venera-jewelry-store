import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  folio?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 border-b border-line pb-7 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div>
        <h2 className="display text-2xl md:text-3xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function QuietLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-quiet text-sm text-plum-ink">
      {children}
      <ArrowUpLeft aria-hidden="true" className="size-4 text-gold" />
    </Link>
  );
}
