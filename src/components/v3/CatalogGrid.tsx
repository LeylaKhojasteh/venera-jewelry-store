'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { QuickView } from '@/components/v3/QuickView';
import { formatDigits, formatToman } from '@/lib/money';
import type { ProductCardData } from '@/types';

export function CatalogGrid({
  products,
  drift = false,
  compact = false,
  motionKind,
}: {
  products: ProductCardData[];
  drift?: boolean;
  compact?: boolean;
  motionKind?: 'float' | 'sway';
}) {
  const [selected, setSelected] = useState<ProductCardData | null>(null);

  const open = (product: ProductCardData) => {
    setSelected(product);
  };

  return (
    <>
      <div className={`v3-grid${compact ? ' v3-grid-compact' : ''}${motionKind ? ` v3-grid-motion-${motionKind}` : ''}`}>
        {products.map((product, index) => (
          <article key={product.id} className="v3-grid-card">
            <button
              type="button"
              className="v3-grid-open"
              onClick={() => open(product)}
              aria-label={`نمای سریع ${product.name}`}
            >
              <div className="v3-grid-media">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw"
                  className={`${drift ? 'animate-drift ' : ''}v3-card-base`}
                />
                {product.hoverImage ? (
                  <Image
                    src={product.hoverImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw"
                    className="v3-card-alt"
                  />
                ) : null}
                <span className="v3-grid-badges">
                  {product.discount ? <span className="v3-badge">٪{formatDigits(product.discount)}</span> : null}
                  {product.isBestSeller ? <span className="v3-badge v3-badge-quiet">پرفروش</span> : null}
                </span>
              </div>
              <span className="v3-grid-body">
                <span className="v3-grid-name" role="heading" aria-level={3}>
                  {product.name}
                </span>
                <span className="v3-grid-price">
                  {formatToman(product.price)}
                  {product.compareAtPrice ? (
                    <span className="v3-grid-compare">{formatToman(product.compareAtPrice)}</span>
                  ) : null}
                </span>
              </span>
            </button>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <QuickView
            key={selected.id}
            product={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
