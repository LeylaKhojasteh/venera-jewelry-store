'use client';

import { Minus, Plus } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { formatDigits } from '@/lib/money';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled = false,
  compact = false,
  label = 'تعداد',
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  compact?: boolean;
  label?: string;
  className?: string;
}) {
  const id = useId();
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      <span className="sr-only" id={`${id}-label`}>
        {label}
      </span>
      <div
        className={cn(
          'inline-flex items-center border border-line bg-paper-soft',
          compact ? 'h-10' : 'h-12',
        )}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <button
          type="button"
          onClick={decrease}
          disabled={disabled || value <= min}
          aria-label="کم کردن تعداد"
          className="flex h-full w-10 items-center justify-center text-plum-ink transition-colors hover:bg-blush/50 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <span
          className={cn('tabular inline-flex items-center justify-center border-x border-line', compact ? 'w-10 text-sm' : 'w-12')}
          aria-live="polite"
        >
          {formatDigits(value)}
        </span>
        <button
          type="button"
          onClick={increase}
          disabled={disabled || value >= max}
          aria-label="افزودن تعداد"
          className="flex h-full w-10 items-center justify-center text-plum-ink transition-colors hover:bg-blush/50 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
