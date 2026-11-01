'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { CategoryStage } from '@/components/v3/CategoryStage';
import { formatToman } from '@/lib/money';
import type { ProductCardData } from '@/types';

const shapes = [
  {
    slug: 'necklace',
    label: 'گردنبند',
    svg: (
      <>
        <path d="M90 70 C90 260 150 340 200 340 C250 340 310 260 310 70" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M200 340 L216 364 L200 388 L184 364 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="200" cy="364" r="2.6" fill="currentColor" />
      </>
    ),
  },
  {
    slug: 'bracelet',
    label: 'دستبند',
    svg: (
      <>
        <path d="M118 200 C118 130 155 96 200 96 C245 96 282 130 282 200 C282 270 245 304 200 304 C155 304 118 270 118 200" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M118 200 L96 200 M282 200 L304 200" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="96" cy="200" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="304" cy="200" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
  },
  {
    slug: 'earrings',
    label: 'گوشواره',
    svg: (
      <>
        <path d="M200 70 C200 40 236 36 246 62 C254 84 236 96 220 96" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M220 96 L220 150" stroke="currentColor" strokeWidth="1.2" />
        <path d="M220 150 C260 190 260 250 220 280 C180 250 180 190 220 150 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="220" cy="300" r="4" fill="currentColor" />
      </>
    ),
  },
  {
    slug: 'ring',
    label: 'انگشتر',
    svg: (
      <>
        <circle cx="200" cy="232" r="74" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M200 120 L230 158 L200 196 L170 158 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M170 158 L200 168 L230 158" fill="none" stroke="currentColor" strokeWidth="1.1" />
      </>
    ),
  },
];

export function CategoryStory({ products }: { products: ProductCardData[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(products.length - 1, Math.max(0, Math.floor(value * products.length)));
    setActive((current) => (current === next ? current : next));
  });

  if (products.length === 0) return null;

  const activeShape =
    shapes.find((shape) => shape.slug === products[active]?.categorySlug) ?? shapes[0];

  return (
    <section className="v3-story" ref={ref} aria-labelledby="story-title">
      <div className="v3-story-sticky">
        <div className="v3-shell v3-story-grid">
          <div className="v3-story-art" aria-hidden="true">
            <CategoryStage
              kind={activeShape.slug}
              fallback={<svg viewBox="0 0 400 400">{activeShape.svg}</svg>}
            />
          </div>

          <div className="v3-story-copy">
            <h2 id="story-title" className="v3-h2">
              تنوع به سبک ونرا
            </h2>

            <div className="v3-story-panels">
              {products.map((product, index) => {
                return (
                  <div
                    key={product.id}
                    className={`v3-story-panel${index === active ? ' is-active' : ''}`}
                    aria-hidden={index !== active}
                  >
                    <div className="v3-story-photo">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 900px) 60vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="v3-story-text">
                      <h3 className="v3-story-name">{product.name}</h3>
                      <p className="v3-story-price">{formatToman(product.price)}</p>
                      <Link
                        href={`/products/${product.slug}`}
                        className="v3-btn v3-btn-line"
                        tabIndex={index === active ? 0 : -1}
                      >
                        دیدن آیتم
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="v3-story-dots" aria-hidden="true">
              {products.map((product, index) => (
                <span key={product.id} className={index === active ? 'is-active' : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="v3-story-mobile v3-shell">
        <h2 className="v3-h2">تنوع به سبک ونرا</h2>
        <div className="v3-story-mobile-list">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="v3-story-mobile-row">
              <span className="v3-story-mobile-media">
                <Image src={product.image} alt={product.imageAlt} fill sizes="96px" className="object-cover" />
              </span>
              <span>
                <span className="v3-story-name">{product.name}</span>
              </span>
              <span className="v3-story-mobile-price">{formatToman(product.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
