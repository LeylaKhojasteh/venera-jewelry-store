import { discountPercent, formatDigits, formatNumber, formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';

export function Price({
  price,
  compareAtPrice,
  size = 'md',
  showDiscount = true,
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}) {
  const discount = discountPercent(price, compareAtPrice);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span
        className={cn(
          'tabular text-plum-ink',
          size === 'lg' && 'text-xl font-semibold',
          size === 'md' && 'text-base font-medium',
          size === 'sm' && 'text-sm',
        )}
      >
        {formatToman(price)}
      </span>
      {compareAtPrice && compareAtPrice > price ? (
        <span className="tabular text-xs text-ink-soft">
          <span className="sr-only">قیمت پیش از تخفیف: </span>
          <s className="decoration-gold/70">{formatNumber(compareAtPrice)}</s>
        </span>
      ) : null}
      {showDiscount && discount ? (
        <span className="badge badge-sale tabular">٪{formatDigits(discount)}</span>
      ) : null}
    </div>
  );
}
