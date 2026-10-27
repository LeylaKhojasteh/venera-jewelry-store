'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Field';
import { loginAction } from '@/actions/auth';
import { mergeGuestCartAction } from '@/actions/cart';
import { clearGuestCartStorage, readGuestCartStorage } from '@/components/cart/CartProvider';
import { loginSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

type LoginValues = { email: string; password: string };

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginValues>,
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    const result = await loginAction({ ...values, next });
    if (!result.ok) {
      setSubmitting(false);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field === 'email' || field === 'password') {
            form.setError(field, { message: messages[0] });
          }
        }
      }
      setFormError(result.message);
      return;
    }

    // Bring anything the visitor added as a guest into the account cart.
    const guestItems = readGuestCartStorage();
    if (guestItems.length > 0) {
      const merged = await mergeGuestCartAction({ items: guestItems });
      if (merged.ok) clearGuestCartStorage();
    }

    router.push(result.data.next);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
      {formError ? (
        <p role="alert" className="border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          {formError}
        </p>
      ) : null}

      <Input
        label="ایمیل"
        type="email"
        inputMode="email"
        autoComplete="email"
        dir="ltr"
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />

      <div className="relative">
        <Input
          label="گذرواژه"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          dir="ltr"
          placeholder="••••••••"
          error={form.formState.errors.password?.message}
          className="pe-12"
          {...form.register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute end-2 top-[2.15rem] flex size-9 items-center justify-center text-ink-soft"
          aria-label={showPassword ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
        >
          {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      </div>

      <button type="submit" disabled={submitting} className={cn('btn btn-primary btn-block', submitting && 'opacity-70')}>
        {submitting ? 'در حال ورود…' : 'ورود به حساب'}
        <ArrowLeft aria-hidden="true" className="size-4" />
      </button>

      <p className="text-center text-xs text-ink-soft">
        حساب نداری؟{' '}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-plum underline-offset-4 hover:underline">
          یک حساب بساز
        </Link>
      </p>
    </form>
  );
}
