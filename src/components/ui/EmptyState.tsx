import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border border-dashed border-line bg-paper-soft/60 px-6 py-16 text-center',
        className,
      )}
    >
      {icon ? <div className="mb-5 text-gold">{icon}</div> : null}
      <p className="font-display text-2xl text-plum-ink">{title}</p>
      {description ? <p className="mt-3 max-w-md text-sm leading-8 text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

export function EmptyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn btn-primary">
      {label}
    </Link>
  );
}
