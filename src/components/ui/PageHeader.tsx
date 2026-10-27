import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  aside,
  className,
  align = 'start',
}: {
  eyebrow?: string;
  folio?: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
  align?: 'start' | 'center';
}) {
  return (
    <header className={cn('border-b border-line pb-10 md:pb-14', className)}>
      <div
        className={cn(
          'flex flex-col gap-10 md:flex-row md:items-end md:justify-between',
          align === 'center' && 'md:flex-col md:items-center md:text-center',
        )}
      >
        <div className={cn('max-w-2xl', align === 'center' && 'md:mx-auto')}>
          <h1 className="display text-3xl md:text-4xl">{title}</h1>
          {description ? <div className="lead mt-5 max-w-xl">{description}</div> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </header>
  );
}
