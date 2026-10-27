'use client';

import { useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Price } from '@/components/ui/Price';
import { useCart } from '@/components/cart/CartProvider';
import { formatDigits, formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { ProductDetailData } from '@/types';

export function ProductBuybox({ product }: { product: ProductDetailData }) {
  const { add, adding } = useCart();
  const variants = product.variants;
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const firstAvailable = variants.find((variant) => variant.stock > 0) ?? variants[0];
    return firstAvailable?.id ?? null;
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
      setError('یک گزینه انتخاب کن.');
      return;
    }
    const ok = await add({
      productId: product.id,
      variantId: selected?.id ?? null,
      quantity: Math.min(quantity, Math.max(1, maxQuantity)),
    });
    if (ok) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2400);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {product.discount ? <span className="badge badge-sale tabular">٪{formatDigits(product.discount)}</span> : null}
        {product.isBestSeller ? <span className="badge badge-soft">پرفروش</span> : null}
      </div>

      <h1 className="display text-3xl">{product.name}</h1>

      <Price
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        size="lg"
        className="mt-5"
      />
      {product.discount ? (
        <p className="mt-1 text-xs text-ink-soft">
          نسبت به قیمت پیش از تخفیف {formatToman((product.compareAtPrice ?? 0) - product.price)} کمتر.
        </p>
      ) : null}

      <p className="mt-5 text-sm leading-8 text-ink-soft">{product.description}</p>

      {variants.length > 0 ? (
        <fieldset className="mt-8">
          <legend className="field-label mb-3">
            {variants[0].kind === 'SIZE' ? 'اندازه' : variants[0].kind === 'COLOR' ? 'رنگ' : 'پرداخت'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const disabled = variant.stock <= 0;
              const isSelected = selectedId === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(variant.id);
                    setQuantity(1);
                    setError(null);
                  }}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className={cn(
                    'min-h-11 border px-4 text-sm transition-colors',
                    isSelected
                      ? 'border-plum bg-plum text-paper'
                      : 'border-line bg-paper-soft text-plum-ink hover:border-plum',
                    disabled && 'cursor-not-allowed border-line/50 text-ink-soft/50 line-through hover:border-line/50',
                  )}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
          {error ? (
            <p className="field-error mt-2" role="alert">
              {error}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-7 flex flex-wrap items-end gap-4">
        <div>
          <p className="field-label mb-2">تعداد</p>
          <QuantityStepper
            value={Math.min(quantity, Math.max(1, maxQuantity))}
            onChange={setQuantity}
            min={1}
            max={Math.max(1, maxQuantity)}
            disabled={!canBuy}
          />        </div>
        <div className="min-w-[12rem] flex-1">
          <button
            type="button"
            onClick={addToCart}
            disabled={!canBuy || adding}
            className={cn(
              'btn btn-primary btn-block h-12',
              added && 'bg-success border-success hover:bg-success',
            )}
          >
            {added ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                به سبد اضافه شد
              </>
            ) : (
              <>
                <ShoppingBag aria-hidden="true" className="size-4" />
                {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
        <p className={cn('flex items-center gap-2', available === 0 && 'text-error')}>
          <span
            className={cn('size-1.5 rounded-full', available > 0 ? 'bg-success' : 'bg-error')}
            aria-hidden="true"
          />
          {available > 0
            ? `${formatDigits(available)} عدد در انبار${selected ? ` (گزینهٔ ${selected.label})` : ''}`
            : 'این گزینه فعلاً موجود نیست.'}
        </p>
      </div>

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/97 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] text-ink-soft">{product.name}</p>
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" showDiscount={false} />
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={!canBuy || adding}
            className="btn btn-primary btn-sm min-w-[9.5rem]"
          >
            {added ? 'اضافه شد' : 'افزودن به سبد'}
          </button>
        </div>
      </div>
    </div>
  );
}
