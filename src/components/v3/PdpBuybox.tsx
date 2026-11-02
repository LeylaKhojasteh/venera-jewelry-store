'use client';

import { useMemo, useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { formatDigits, formatToman } from '@/lib/money';
import type { ProductDetailData } from '@/types';

export function PdpBuybox({ product }: { product: ProductDetailData }) {
  const { add, adding } = useCart();
  const variants = product.variants;
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const first = variants.find((variant) => variant.stock > 0) ?? variants[0];
    return first?.id ?? null;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => variants.find((variant) => variant.id === selectedId) ?? null,
    [selectedId, variants],
  );
  const available = selected ? selected.stock : product.stock;
  const maxQuantity = Math.max(0, Math.min(20, available));
  const canBuy = product.inStock && available > 0 && (!variants.length || Boolean(selected));

  const addToCart = async () => {
    setError(null);
    if (variants.length > 0 && !selected) {
      setError('یک اندازه انتخاب کن.');
      return;
    }
    const ok = await add({
      productId: product.id,
      variantId: selected?.id ?? null,
      quantity: Math.min(quantity, Math.max(1, maxQuantity)),
    });
    if (ok) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 3000);
    } else {
      setError('افزودن انجام نشد؛ دوباره تلاش کن.');
    }
  };

  return (
    <div>
      <h1 className="v3-pdp-title enter" style={{ marginTop: '0.75rem' }}>
        {product.name}
      </h1>

      <p className="v3-pdp-price enter-2">
        {formatToman(product.price)}
        {product.compareAtPrice ? (
          <span className="v3-pdp-compare">{formatToman(product.compareAtPrice)}</span>
        ) : null}
      </p>

      <div className="v3-pdp-badges">
        {product.discount ? <span className="v3-badge">٪{formatDigits(product.discount)}</span> : null}
        {product.isBestSeller ? <span className="v3-badge v3-badge-quiet">پرفروش</span> : null}
      </div>

      {variants.length > 0 ? (
        <fieldset className="v3-filter-group enter-3" style={{ marginTop: '1.5rem' }}>
          <legend>
            {variants[0]?.kind === 'SIZE' ? 'اندازه' : variants[0]?.kind === 'COLOR' ? 'رنگ' : 'پرداخت'}
          </legend>
          <div className="v3-filter-options">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className="v3-choice"
                aria-pressed={selectedId === variant.id}
                disabled={variant.stock <= 0}
                onClick={() => {
                  setSelectedId(variant.id);
                  setQuantity(1);
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
        <p className="v3-qv-error" role="alert" style={{ marginTop: '0.75rem' }}>
          {error}
        </p>
      ) : null}

      <div className="v3-pdp-actions enter-3">
        <div className="v3-qty" aria-label="تعداد">
          <button
            type="button"
            aria-label="کمتر"
            disabled={quantity <= 1 || !canBuy}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus aria-hidden="true" size={15} />
          </button>
          <span aria-live="polite">{formatDigits(quantity)}</span>
          <button
            type="button"
            aria-label="بیشتر"
            disabled={quantity >= maxQuantity || !canBuy}
            onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
          >
            <Plus aria-hidden="true" size={15} />
          </button>
        </div>

        <button
          type="button"
          className="v3-btn v3-btn-solid"
          onClick={addToCart}
          disabled={!canBuy || adding}
        >
          {added ? (
            <>
              <Check aria-hidden="true" size={16} /> به سبد اضافه شد.
            </>
          ) : (
            <>
              <ShoppingBag aria-hidden="true" size={16} />
              {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
            </>
          )}
        </button>
      </div>

      <p className="v3-pdp-stock">
        {available > 0
          ? `${formatDigits(available)} عدد در انبار`
          : 'این گزینه فعلاً موجود نیست.'}
      </p>
    </div>
  );
}
