'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tilt } from '@/components/v3/Tilt';
import { formatToman } from '@/lib/money';
import type { ProductCardData } from '@/types';

export function ProductRail({ products }: { products: ProductCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.v3-card');
    const width = card ? card.offsetWidth + 24 : 360;
    track.scrollBy({ left: direction * width, behavior: 'smooth' });
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
              گردنبند، دستبند، گوشواره و انگشتر؛ هر کدام با اندازه و وزن مشخص. عکس‌ها روی همان زمینهٔ
              روشن گرفته شده‌اند که در ویترین می‌بینی.
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
              <Link href={`/products/${product.slug}`} className="v3-card-link">
                <div className="v3-card-media">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 640px) 80vw, 32vw"
                  />
                </div>
                <div className="v3-card-body">
                  <span className="v3-card-name">{product.name}</span>
                  <span className="v3-card-price">{formatToman(product.price)}</span>
                </div>
                <p className="v3-small" style={{ marginTop: '0.15rem' }}>
                  {product.categoryName} · استیل ۳۱۶
                </p>
              </Link>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
