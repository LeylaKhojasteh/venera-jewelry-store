'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Loader2, MapPin, Plus } from 'lucide-react';
import { placeDemoOrderAction } from '@/actions/checkout';
import { formatDigits, formatToman } from '@/lib/money';
import type { CartData } from '@/types';

type AddressShape = {
  id: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  label: string | null;
  isDefault: boolean;
};

const steps = ['نشانی', 'بازبینی', 'ثبت'];

export function CheckoutForm({ addresses, cart }: { addresses: AddressShape[]; cart: CartData }) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(
    () => addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? '',
  );
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `idem-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  });

  const totals = useMemo(
    () => ({ subtotal: cart.subtotal, shipping: cart.shipping, total: cart.total }),
    [cart.subtotal, cart.shipping, cart.total],
  );

  const submit = async () => {
    setError(null);
    if (!selectedAddress) {
      setError('یک نشانی انتخاب کن.');
      return;
    }
    setSubmitting(true);
    const result = await placeDemoOrderAction({ addressId: selectedAddress, idempotencyKey, note });
    if (!result.ok) {
      setSubmitting(false);
      setError(result.message);
      return;
    }
    router.push(`/order-success/${result.data.orderId}`);
    router.refresh();
  };

  return (
    <div className="v3-checkout">
      <div>
        <ol className="v3-steps">
          {steps.map((step, index) => (
            <li key={step} className={`v3-step${index < 2 ? ' is-done' : ''}`}>
              <span className="v3-step-dot" aria-hidden="true">
                {index < 2 ? <Check size={12} /> : formatDigits(index + 1)}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <section aria-labelledby="address-step">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <h2 id="address-step" className="v3-h3" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin aria-hidden="true" size={16} style={{ color: 'var(--copper)' }} />
              نشانی ارسال
            </h2>
            <Link href="/profile/addresses?next=/checkout" className="v3-small" style={{ display: 'inline-flex', gap: '0.3rem', alignItems: 'center' }}>
              <Plus aria-hidden="true" size={14} />
              نشانی تازه
            </Link>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {addresses.map((address) => {
              const active = selectedAddress === address.id;
              return (
                <label key={address.id} className="v3-address" data-active={active}>
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={active}
                    onChange={() => setSelectedAddress(address.id)}
                    className="sr-only"
                  />
                  <span className="v3-address-dot" aria-hidden="true" />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--bone)', fontWeight: 600 }}>{address.recipient}</span>
                      {address.label ? <span className="v3-badge v3-badge-quiet">{address.label}</span> : null}
                      {address.isDefault ? <span className="v3-small">پیش‌فرض</span> : null}
                    </span>
                    <span className="v3-small" style={{ display: 'block', marginTop: '0.2rem' }}>
                      {address.province}، {address.city}، {address.street}
                    </span>
                    <span className="v3-small" style={{ display: 'flex', flexWrap: 'wrap', gap: '0 1rem', marginTop: '0.2rem' }} dir="ltr">
                      <span>{address.phone}</span>
                      <span>کد پستی: {address.postalCode}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="review-step" style={{ marginTop: '2rem' }}>
          <h2 id="review-step" className="v3-h3">
            بازبینی کالاها
          </h2>
          <ul style={{ marginTop: '0.75rem' }}>
            {cart.lines.map((line) => (
              <li key={`${line.productId}-${line.variantId ?? ''}`} className="v3-checkout-line">
                <span className="v3-checkout-media">
                  <Image src={line.image} alt={line.imageAlt} fill sizes="64px" className="object-cover" />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', color: 'var(--bone)', fontSize: 16 }}>{line.name}</span>
                  <span className="v3-small" style={{ display: 'block' }}>
                    {line.variantLabel ? `${line.variantLabel} · ` : ''}
                    {formatDigits(line.quantity)} عدد
                  </span>
                </span>
                <span style={{ color: 'var(--bone)', fontSize: 15, whiteSpace: 'nowrap' }}>
                  {formatToman(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="note-step" style={{ marginTop: '2rem' }}>
          <label htmlFor="order-note" className="v3-filter-legend">
            یادداشت سفارش (اختیاری)
          </label>
          <textarea
            id="order-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={400}
            rows={3}
            placeholder="مثلاً برای بسته‌بندی هدیه…"
            className="v3-field-textarea"
          />
          <p className="v3-small" style={{ marginTop: '0.4rem' }}>
            این یادداشت همراه سفارش ذخیره می‌شود؛ ایمیلی ارسال نمی‌شود.
          </p>
        </section>

        {error ? (
          <p role="alert" className="v3-qv-error" style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem' }}>
            <AlertCircle aria-hidden="true" size={16} />
            {error}
          </p>
        ) : null}

        <div style={{ marginTop: '2rem' }}>
          <button type="button" onClick={submit} disabled={submitting} className="v3-btn v3-btn-solid" style={{ width: '100%' }}>
            {submitting ? (
              <>
                <Loader2 aria-hidden="true" size={16} className="animate-spin" />
                در حال ثبت…
              </>
            ) : (
              <>
                ثبت سفارش
                <ArrowLeft aria-hidden="true" size={16} />
              </>
            )}
          </button>
          <p className="v3-small" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
            پس از ثبت، موجودی انبار به‌روز می‌شود و سفارش در پنل شما قابل پیگیری است.
          </p>
        </div>
      </div>

      <aside>
        <div className="v3-summary">
          <h2 className="v3-h3">خلاصهٔ پرداخت</h2>
          <div className="v3-summary-row">
            <span>جمع کالاها</span>
            <span>{formatToman(totals.subtotal)}</span>
          </div>
          <div className="v3-summary-row">
            <span>هزینهٔ ارسال</span>
            <span>{totals.shipping === 0 ? 'رایگان' : formatToman(totals.shipping)}</span>
          </div>
          <div className="v3-summary-row is-total">
            <span>مبلغ کل</span>
            <strong>{formatToman(totals.total)}</strong>
          </div>
          <p className="v3-small" style={{ marginTop: '1.25rem' }}>
            قیمت‌ها و موجودی هنگام ثبت دوباره روی سرور بررسی می‌شوند. اگر موجودی تغییر کرده باشد،
            سفارش ثبت نمی‌شود و پیام دقیق می‌بینی.
          </p>
        </div>
      </aside>
    </div>
  );
}
