'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { requestPasswordResetAction } from '@/actions/password-reset';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const result = await requestPasswordResetAction({ email });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(result.message ?? null);
    setEmail('');
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
      {error ? (
        <p role="alert" className="border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="border-s-2 border-success bg-success/5 px-4 py-3 text-sm text-success">
          {message}
        </p>
      ) : null}

      <div>
        <label htmlFor="reset-email" className="field-label">
          ایمیل حساب
        </label>
        <input
          id="reset-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="field-input"
          required
        />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-block">
        {pending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {pending ? 'در حال ارسال…' : 'فرستادن پیوند بازیابی'}
        {!pending ? <ArrowLeft aria-hidden="true" className="size-4" /> : null}
      </button>

      <p className="text-center text-xs text-ink-soft">
        <Link href="/login" className="text-plum underline-offset-4 hover:underline">
          بازگشت به ورود
        </Link>
      </p>
    </form>
  );
}
