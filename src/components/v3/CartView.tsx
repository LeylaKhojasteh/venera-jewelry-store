'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { formatDigits, formatToman } from '@/lib/money';

export function CartView() {
  const {
    lines,
    count,
    subtotal,
    shipping,
    total,
    freeShippingRemaining,
    notices,
    loading,
    pending,
    isAuthenticated,
    update,
    remove,
  } = useCart();

  if (loading) {
    return (
      <div className="v3-cart" aria-busy="true">
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[0, 1].map((item) => (
            <div key={item} className="v3-checkout-line">
              <span className="v3-checkout-media skeleton" />
              <span style={{ display: 'grid', gap: '0.5rem' }}>
                <span className="skeleton" style={{ display: 'block', width: '10rem', height: '1rem' }} />
                <span className="skeleton" style={{ display: 'block', width: '6rem', height: '0.8rem' }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (count === 0) {
    const suggestions = [
      { slug: 'necklace-drop', image: '/images/products/necklace-drop-01.jpg', name: 'گردنبند قطره' },
      { slug: 'bracelet-triple-ring', image: '/images/products/bracelet-triple-ring-01.jpg', name: 'دستبند حلقه سه‌تایی' },
      { slug: 'earrings-clear-flower', image: '/images/products/earrings-clear-flower-01.jpg', name: 'گوشواره گل شفاف' },
      { slug: 'ring-turquoise', image: '/images/products/ring-turquoise-01.jpg', name: 'انگشتر فیروزه‌ای' },
    ];

    return (
      <div className="v3-cart-empty">
        <div className="v3-empty enter" style={{ paddingBlock: '2rem' }}>
          <h2 className="v3-h2 enter">هنوز چیزی به سبدت اضافه نکردی.</h2>
          <p className="v3-body enter-2">از اکسسوری‌ها یکی را انتخاب کن؛ همین‌جا اضافه می‌شود.</p>
          <Link href="/products" className="v3-btn v3-btn-solid enter-3">
            دیدن محصولات
          </Link>
        </div>

        <div className="v3-cart-empty-grid">
          {suggestions.map((item, index) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              className={`v3-cart-empty-item enter-${index < 2 ? 2 : 3}`}
            >
              <span className="v3-cart-empty-media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 40vw, 18vw"
                  className="object-cover"
                />
              </span>
              <span className="v3-cart-empty-name">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const checkoutHref = isAuthenticated ? '/checkout' : '/login?next=%2Fcheckout';

  return (
    <div className="v3-cart">
      <div>
        {notices.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {notices.map((notice) => (
              <p key={notice} className="v3-small" style={{ display: 'flex', gap: '0.4rem' }}>
                <AlertCircle aria-hidden="true" size={14} style={{ marginTop: '0.25rem', flex: 'none' }} />
                {notice}
              </p>
            ))}
          </div>
        ) : null}

        <ul className="v3-cart-lines" style={{ opacity: pending ? 0.75 : 1, transition: 'opacity 180ms ease' }}>
          {lines.map((line) => {
            const variantKey = line.variantId ?? '';
            return (
              <li key={`${line.productId}-${variantKey}`} className="v3-cart-line">
                <Link href={`/products/${line.slug}`} className="v3-cart-media">
                  <Image src={line.image} alt={line.imageAlt} fill sizes="64px" className="object-cover" />
                </Link>

                <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/products/${line.slug}`} className="v3-cart-name">
                        {line.name}
                      </Link>
                      {line.variantLabel ? <p className="v3-small">{line.variantLabel}</p> : null}
                      <p className="v3-small">{formatToman(line.price)}</p>
                      {!line.isActive || line.stock === 0 ? (
                        <p className="v3-qv-error">این آیتم فعلاً قابل سفارش نیست.</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.productId, variantKey)}
                      aria-label={`حذف ${line.name} از سبد`}
                      className="v3-icon"
                    >
                      <Trash2 aria-hidden="true" size={17} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      marginTop: 'auto',
                      paddingTop: '0.6rem',
                    }}
                  >
                    <div className="v3-qty">
                      <button
                        type="button"
                        aria-label="کمتر"
                        disabled={pending || line.quantity <= 1}
                        onClick={() => update(line.productId, variantKey, line.quantity - 1)}
                      >
                        <Minus aria-hidden="true" size={14} />
                      </button>
                      <span aria-live="polite">{formatDigits(line.quantity)}</span>
                      <button
                        type="button"
                        aria-label="بیشتر"
                        disabled={pending || line.quantity >= line.maxQuantity}
                        onClick={() => update(line.productId, variantKey, line.quantity + 1)}
                      >
                        <Plus aria-hidden="true" size={14} />
                      </button>
                    </div>
                    <p style={{ color: 'var(--bone)', fontSize: 14, whiteSpace: 'nowrap' }}>
                      {formatToman(line.lineTotal)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/products" className="link-quiet text-sm">
            افزودن آیتم دیگر
          </Link>
          {pending ? <Loader2 aria-hidden="true" size={14} className="animate-spin" /> : null}
        </div>
      </div>

      <aside>
        <div className="v3-summary">
          <h2 className="v3-h3">خلاصهٔ سفارش</h2>
          <div className="v3-summary-row">
            <span>جمع کالاها ({formatDigits(count)} قلم)</span>
            <span>{formatToman(subtotal)}</span>
          </div>
          <div className="v3-summary-row">
            <span>ارسال</span>
            <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
          </div>
          {freeShippingRemaining > 0 ? (
            <p className="v3-small" style={{ marginTop: '0.5rem' }}>
              {formatToman(freeShippingRemaining)} تا ارسال رایگان.
            </p>
          ) : null}
          <div className="v3-summary-row is-total">
            <span>مبلغ کل</span>
            <strong>{formatToman(total)}</strong>
          </div>
          <Link href={checkoutHref} className="v3-btn v3-btn-solid" style={{ width: '100%', marginTop: '1rem' }}>
            {isAuthenticated ? 'ادامهٔ سفارش' : 'ورود و ادامهٔ سفارش'}
          </Link>
          {!isAuthenticated ? (
            <p className="v3-small" style={{ marginTop: '0.75rem' }}>
              سبدت روی همین مرورگر ذخیره شده؛ بعد از ورود به حسابت منتقل می‌شود.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
