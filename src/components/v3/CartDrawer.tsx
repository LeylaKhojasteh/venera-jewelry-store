'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { formatDigits, formatToman } from '@/lib/money';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, count, subtotal, shipping, total, freeShippingRemaining, pending, update, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="v3-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="v3-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="v3-drawer-head">
              <h2 id="cart-drawer-title">سبد خرید {count > 0 ? `(${formatDigits(count)})` : ''}</h2>
              <button type="button" className="v3-icon" onClick={onClose} aria-label="بستن سبد">
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="v3-drawer-empty">
                <p className="v3-h3">سبد خالی است.</p>
                <p className="v3-body">از اکسسوری‌ها یکی را انتخاب کن؛ همین‌جا اضافه می‌شود.</p>
                <Link href="/products" className="v3-btn v3-btn-solid" onClick={onClose}>
                  دیدن محصولات
                </Link>
              </div>
            ) : (
              <>
                <ul className="v3-drawer-lines">
                  {lines.map((line) => {
                    const key = line.variantId ?? '';
                    return (
                      <li className="v3-drawer-line" key={`${line.productId}-${key}`}>
                        <Link href={`/products/${line.slug}`} className="v3-drawer-media" onClick={onClose}>
                          <Image src={line.image} alt={line.imageAlt} fill sizes="64px" className="object-cover" />
                        </Link>
                        <div>
                          <p className="v3-drawer-name">{line.name}</p>
                          {line.variantLabel ? <p className="v3-drawer-meta">{line.variantLabel}</p> : null}
                          <p className="v3-drawer-meta">{formatToman(line.price)}</p>
                          <div className="v3-drawer-qty">
                            <button
                              type="button"
                              aria-label="کمتر"
                              disabled={pending || line.quantity <= 1}
                              onClick={() => update(line.productId, key, line.quantity - 1)}
                            >
                              <Minus aria-hidden="true" size={13} />
                            </button>
                            <span aria-live="polite">{formatDigits(line.quantity)}</span>
                            <button
                              type="button"
                              aria-label="بیشتر"
                              disabled={pending || line.quantity >= line.maxQuantity}
                              onClick={() => update(line.productId, key, line.quantity + 1)}
                            >
                              <Plus aria-hidden="true" size={13} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="v3-drawer-remove"
                          onClick={() => remove(line.productId, key)}
                          disabled={pending}
                        >
                          حذف
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="v3-drawer-foot">
                  <div className="v3-drawer-row">
                    <span>جمع کالاها</span>
                    <span>{formatToman(subtotal)}</span>
                  </div>
                  <div className="v3-drawer-row">
                    <span>ارسال</span>
                    <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
                  </div>
                  {freeShippingRemaining > 0 ? (
                    <p className="v3-small" style={{ marginTop: '0.35rem' }}>
                      {formatToman(freeShippingRemaining)} تا ارسال رایگان.
                    </p>
                  ) : null}
                  <div className="v3-drawer-row" style={{ marginTop: '0.6rem' }}>
                    <span>جمع کل</span>
                    <strong>{formatToman(total)}</strong>
                  </div>
                  <div className="v3-drawer-actions">
                    <Link href="/checkout" className="v3-btn v3-btn-solid" onClick={onClose}>
                      تسویه حساب
                    </Link>
                    <Link href="/cart" className="v3-btn v3-btn-line" onClick={onClose}>
                      دیدن سبد
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
