'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { QuickView } from '@/components/v3/QuickView';
import { getQuickView } from '@/actions/quick-view';
import { formatDigits, formatToman } from '@/lib/money';
import type { ProductCardData, QuickViewData } from '@/types';

export function CatalogGrid({
  products,
  drift = false,
  layoutPrefix = 'grid',
  compact = false,
}: {
  products: ProductCardData[];
  drift?: boolean;
  layoutPrefix?: string;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<ProductCardData | null>(null);
  const [detail, setDetail] = useState<QuickViewData | null>(null);
  const [loading, startTransition] = useTransition();

  const open = (product: ProductCardData) => {
    setSelected(product);
    setDetail(null);
    startTransition(async () => {
      try {
        setDetail(await getQuickView(product.slug));
      } catch {
        setDetail(null);
      }
    });
  };

  return (
    <>
      <div className={`v3-grid${compact ? ' v3-grid-compact' : ''}`}>
        {products.map((product, index) => (
          <article key={product.id} className="v3-grid-card">
            <button
              type="button"
              className="v3-grid-open"
              onClick={() => open(product)}
              aria-label={`نمای سریع ${product.name}`}
            >
              <motion.div layoutId={`${layoutPrefix}-media-${product.id}`} className="v3-grid-media">
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
              </motion.div>
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
            detail={detail}
            loading={loading}
            onClose={() => setSelected(null)}
            layoutPrefix={layoutPrefix}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
