'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { formatToman } from '@/lib/money';
import type { ProductCardData } from '@/types';

export function QuickView({
  product,
  onClose,
}: {
  product: ProductCardData;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const variants = product.variants;
  const chosen = variantId ?? (variants.length === 1 ? variants[0]?.id : null);
  const image = product.image;
  const imageAlt = product.imageAlt;

  const addToCart = async () => {
    if (variants.length > 0 && !chosen) {
      setError('یک اندازه انتخاب کن.');
      return;
    }
    setError(null);
    setPending(true);
    const ok = await add({ productId: product.id, variantId: chosen, quantity: 1 });
    setPending(false);
    if (ok) {
      onClose();
      window.setTimeout(() => window.dispatchEvent(new Event('venera:open-cart')), 40);
    } else {
      setError('افزودن انجام نشد؛ دوباره تلاش کن.');
    }
  };

  return (
    <motion.div
      className="v3-qv-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="v3-qv"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <button ref={closeRef} type="button" className="v3-icon v3-qv-close" onClick={onClose} aria-label="بستن">
          <X aria-hidden="true" size={20} />
        </button>

        <div className="v3-qv-media">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 42vw" className="object-contain" />
        </div>

        <div className="v3-qv-copy">
          <p className="v3-small">
            {product.categoryName} · {product.materials}
          </p>
          <h2 id="qv-title" className="v3-h2">
            {product.name}
          </h2>
          <p className="v3-qv-price">
            {formatToman(product.price)}
            {product.compareAtPrice ? (
              <span className="v3-qv-compare">{formatToman(product.compareAtPrice)}</span>
            ) : null}
          </p>

          <p className="v3-body v3-qv-desc">{product.description}</p>

          {variants.length > 0 ? (
            <fieldset className="v3-qv-variants">
              <legend className="v3-small">
                {variants[0]?.kind === 'SIZE' ? 'اندازه' : variants[0]?.kind === 'COLOR' ? 'رنگ' : 'پرداخت'}
              </legend>
              <div>
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className="v3-choice"
                    aria-pressed={chosen === variant.id}
                    disabled={variant.stock <= 0}
                    onClick={() => {
                      setVariantId(variant.id);
                      setError(null);
                    }}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {error ? (
            <p className="v3-qv-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="v3-qv-actions">
            <button
              type="button"
              className="v3-btn v3-btn-solid"
              onClick={addToCart}
              disabled={pending || !product.inStock}
            >
              {pending ? 'در حال افزودن…' : 'افزودن به سبد'}
            </button>
            <Link href={`/products/${product.slug}`} className="v3-btn v3-btn-line" onClick={onClose}>
              صفحهٔ کامل
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
