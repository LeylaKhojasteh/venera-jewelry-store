import Image from 'next/image';
import Link from 'next/link';
import { Price } from '@/components/ui/Price';
import { QuickAddButton } from '@/components/products/QuickAddButton';
import { genderLabels } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { ProductCardData } from '@/types';

export function ProductCard({
  product,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <article className={cn('group relative flex h-full flex-col', className)}>
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="product-media block focus-visible:outline-offset-4"
          aria-label={`${product.name} — ${product.categoryName} ${genderLabels[product.gender] ?? ''}`}
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes={sizes}
            priority={priority}
            className="product-media-base object-cover"
          />
          {product.hoverImage ? (
            <Image
              src={product.hoverImage}
              alt=""
              aria-hidden="true"
              fill
              sizes={sizes}
              className="product-media-alt object-cover"
            />
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            {product.discount ? (
              <span className="badge badge-sale tabular">٪{formatDigits(product.discount)}</span>
            ) : (
              <span />
            )}
            {!product.inStock ? <span className="badge badge-soft">ناموجود</span> : null}
            {product.isBestSeller && product.inStock ? (
              <span className="badge bg-paper/90 text-plum-ink">پرفروش</span>
            ) : null}
          </div>
        </Link>

        <div className="absolute inset-x-3 bottom-3 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
          <QuickAddButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            hasVariants={product.hasVariants}
            inStock={product.inStock}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-line pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-medium leading-7 text-plum-ink">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-plum">
              {product.name}
            </Link>
          </h3>
          <span className="eyebrow shrink-0 pt-1 text-[0.58rem]">{product.categoryName}</span>
        </div>
        <p className="mt-0.5 text-[0.7rem] text-ink-soft">{genderLabels[product.gender]}</p>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-2" />
      </div>
    </article>
  );
}
