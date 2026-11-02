'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { lookupOrderAction } from '@/actions/order-lookup';

export function OrderLookup({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <div className="v3-contact-card">
        <h2 className="v3-h3">پیگیری سفارش</h2>
        <p className="v3-small" style={{ marginTop: '0.4rem' }}>
          برای دیدن وضعیت سفارش، وارد حسابت شو.
        </p>
        <Link href="/login?next=%2Fprofile%2Forders" className="v3-btn v3-btn-line" style={{ marginTop: '0.75rem' }}>
          ورود به حساب
        </Link>
      </div>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await lookupOrderAction({ orderNumber });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(`/profile/orders/${result.data.id}`);
  };

  return (
    <div className="v3-contact-card">
      <h2 className="v3-h3">پیگیری سفارش</h2>
      <p className="v3-small" style={{ marginTop: '0.4rem' }}>
        شمارهٔ سفارش را وارد کن تا مستقیم به جزئیات بروی.
      </p>
      <form onSubmit={submit} className="v3-order-lookup">
        <label htmlFor="order-number" className="sr-only">
          شمارهٔ سفارش
        </label>
        <input
          id="order-number"
          className="v3-admin-input"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="VNR-..."
          dir="ltr"
          autoComplete="off"
        />
        <button type="submit" className="v3-btn v3-btn-solid" disabled={pending}>
          {pending ? <Loader2 aria-hidden="true" size={15} className="animate-spin" /> : <Search aria-hidden="true" size={15} />}
          پیگیری
        </button>
      </form>
      {error ? (
        <p className="v3-qv-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
