'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tilt } from '@/components/v3/Tilt';
import { QuickView } from '@/components/v3/QuickView';
import { getQuickView } from '@/actions/quick-view';
import { formatToman } from '@/lib/money';
import type { ProductCardData, QuickViewData } from '@/types';

export function ProductRail({ products }: { products: ProductCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<ProductCardData | null>(null);
  const [detail, setDetail] = useState<QuickViewData | null>(null);
  const [loading, startTransition] = useTransition();

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.v3-card');
    const width = card ? card.offsetWidth + 24 : 360;
    track.scrollBy({ left: direction * width, behavior: 'smooth' });
  };

  const open = (product: ProductCardData) => {
    setSelected(product);
    setDetail(null);
    startTransition(async () => {
      try {
        const data = await getQuickView(product.slug);
        setDetail(data);
      } catch {
        setDetail(null);
      }
    });
  };

  return (
    <section className="v3-section" aria-labelledby="pieces-title">
      <div className="v3-shell">
        <div className="v3-rail-head">
          <div>
            <h2 id="pieces-title" className="v3-h2">
              اکسسوری‌ها
            </h2>
            <p className="v3-body" style={{ marginTop: '0.75rem', maxWidth: '38ch' }}>
              گردنبند، دستبند، گوشواره و انگشتر؛ هر کدام با اندازه و وزن مشخص. روی هر آیتم بزن تا
              همین‌جا باز شود.
            </p>
          </div>
          <div className="v3-rail-nav">
            <button type="button" className="v3-icon" aria-label="قبلی" onClick={() => move(1)}>
              <ChevronRight aria-hidden="true" size={20} />
            </button>
            <button type="button" className="v3-icon" aria-label="بعدی" onClick={() => move(-1)}>
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
          </div>
        </div>

        <div className="v3-rail-track" ref={trackRef}>
          {products.map((product) => (
            <Tilt key={product.id} className="v3-card" rotationFactor={6}>
              <button
                type="button"
                className="v3-card-open"
                onClick={() => open(product)}
                aria-label={`نمای سریع ${product.name}`}
              >
                <motion.div layoutId={`rail-media-${product.id}`} className="v3-card-media">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 640px) 80vw, 32vw"
                    className="v3-card-base"
                  />
                  {product.hoverImage ? (
                    <Image
                      src={product.hoverImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 80vw, 32vw"
                      className="v3-card-alt"
                    />
                  ) : null}
                </motion.div>
                <span className="v3-card-body">
                  <span className="v3-card-name">{product.name}</span>
                  <span className="v3-card-price">{formatToman(product.price)}</span>
                </span>
              </button>
            </Tilt>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <QuickView
            key={selected.id}
            product={selected}
            detail={detail}
            loading={loading}
            onClose={() => setSelected(null)}
            layoutPrefix="rail"
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
