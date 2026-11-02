'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { resetPasswordAction } from '@/actions/password-reset';

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await resetPasswordAction({ token, password, confirmPassword });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(result.data.next);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
      {error ? (
        <p role="alert" className="border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="new-password" className="field-label">
          گذرواژهٔ تازه
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            dir="ltr"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="حداقل ۸ نویسه، شامل حرف و رقم"
            className="field-input pe-12"
            required
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            className="absolute end-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-ink-soft"
            aria-label={show ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
          >
            {show ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="field-label">
          تکرار گذرواژه
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          dir="ltr"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="دوباره وارد کن"
          className="field-input"
          required
        />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-block">
        {pending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {pending ? 'در حال ذخیره…' : 'تعیین گذرواژهٔ تازه'}
        {!pending ? <ArrowLeft aria-hidden="true" className="size-4" /> : null}
      </button>

      <p className="text-center text-xs text-ink-soft">
        <Link href="/forgot-password" className="text-plum underline-offset-4 hover:underline">
          درخواست پیوند تازه
        </Link>
      </p>
    </form>
  );
}
