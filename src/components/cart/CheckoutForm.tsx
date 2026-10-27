'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Loader2, MapPin, Plus } from 'lucide-react';
import { placeDemoOrderAction } from '@/actions/checkout';
import { formatToman } from '@/lib/money';
import { cn } from '@/lib/utils';
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
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol className="flex items-center gap-3 border-b border-line pb-6 text-xs">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  'tabular flex size-6 items-center justify-center rounded-full border text-[0.65rem]',
                  index < 2 ? 'border-plum bg-plum text-paper' : 'border-line text-ink-soft',
                )}
              >
                {index < 2 ? <Check aria-hidden="true" className="size-3" /> : '۳'}
              </span>
              <span className={index < 2 ? 'text-plum-ink' : 'text-ink-soft'}>{step}</span>
              {index < steps.length - 1 ? <span className="mx-1 h-px w-6 bg-line" aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>

        <section className="mt-8" aria-labelledby="address-step">
          <div className="flex items-center justify-between gap-4">
            <h2 id="address-step" className="flex items-center gap-2 font-display text-xl text-plum-ink">
              <MapPin aria-hidden="true" className="size-4 text-gold" />
              نشانی ارسال
            </h2>
            <Link href="/profile/addresses?next=/checkout" className="flex items-center gap-1 text-xs text-plum">
              <Plus aria-hidden="true" className="size-3.5" />
              نشانی تازه
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {addresses.map((address) => {
              const active = selectedAddress === address.id;
              return (
                <label
                  key={address.id}
                  className={cn(
                    'relative flex cursor-pointer gap-4 border p-4 transition-colors',
                    active ? 'border-plum bg-plum/[0.04]' : 'border-line hover:border-plum/50',
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={active}
                    onChange={() => setSelectedAddress(address.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border',
                      active ? 'border-plum' : 'border-line',
                    )}
                    aria-hidden="true"
                  >
                    {active ? <span className="size-2 rounded-full bg-plum" /> : null}
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-plum-ink">{address.recipient}</span>
                      {address.label ? <span className="badge badge-soft">{address.label}</span> : null}
                      {address.isDefault ? <span className="text-[0.62rem] text-gold">پیش‌فرض</span> : null}
                    </span>
                    <span className="mt-1 block text-xs leading-6 text-ink-soft">
                      {address.province}، {address.city}، {address.street}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-4 text-[0.68rem] text-ink-soft" dir="ltr">
                      <span>{address.phone}</span>
                      <span>کد پستی: {address.postalCode}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="review-step">
          <h2 id="review-step" className="font-display text-xl text-plum-ink">
            بازبینی کالاها
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {cart.lines.map((line) => (
              <li key={`${line.productId}-${line.variantId ?? ''}`} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-blush">
                  <Image src={line.image} alt={line.imageAlt} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-plum-ink">{line.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {line.variantLabel ? `${line.variantLabel} · ` : ''}
                    {new Intl.NumberFormat('fa-IR').format(line.quantity)} عدد
                  </p>
                </div>
                <p className="tabular text-sm text-plum-ink">{formatToman(line.lineTotal)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="note-step">
          <label htmlFor="order-note" className="field-label">
            یادداشت سفارش (اختیاری)
          </label>
          <textarea
            id="order-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={400}
            rows={3}
            placeholder="مثلاً برای بسته‌بندی هدیه…"
            className="field-textarea mt-2"
          />
          <p className="field-hint mt-1">این یادداشت همراه سفارش ذخیره می‌شود؛ ایمیلی ارسال نمی‌شود.</p>
        </section>

        {error ? (
          <p role="alert" className="mt-6 flex items-start gap-2 border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <div className="mt-8 border-t border-line pt-6">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="btn btn-primary btn-block h-12"
          >
            {submitting ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                در حال ثبت…
              </>
            ) : (
              <>
                ثبت سفارش
                <ArrowLeft aria-hidden="true" className="size-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[0.68rem] text-ink-soft">
            پس از ثبت، موجودی انبار به‌روز می‌شود و سفارش در پنل شما قابل پیگیری است.
          </p>
        </div>
      </div>

      <aside className="lg:col-span-5 lg:sticky lg:top-28">
        <div className="summary-card p-6">
          <h2 className="font-display text-xl text-plum-ink">خلاصهٔ پرداخت</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">جمع کالاها</dt>
              <dd className="tabular text-plum-ink">{formatToman(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">هزینهٔ ارسال</dt>
              <dd className="tabular text-plum-ink">
                {totals.shipping === 0 ? <span className="text-success">رایگان</span> : formatToman(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-medium text-plum-ink">مبلغ کل</dt>
              <dd className="tabular font-semibold text-plum-ink">{formatToman(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-[0.68rem] leading-6 text-ink-soft">
            قیمت‌ها و موجودی هنگام ثبت، دوباره روی سرور بررسی می‌شوند. اگر موجودی تغییر کرده باشد، سفارش ثبت
            نمی‌شود و پیام دقیق می‌بینی.
          </p>
        </div>
      </aside>
    </div>
  );
}
