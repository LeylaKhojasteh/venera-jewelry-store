import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Accordion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('divide-y divide-line border-y border-line', className)}>{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-plum-ink [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <Plus
          aria-hidden="true"
          className="size-4 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
        />
      </summary>
      <div className="pb-6 text-sm leading-8 text-ink-soft">{children}</div>
    </details>
  );
}
