'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Field';
import { registerAction } from '@/actions/auth';
import { mergeGuestCartAction } from '@/actions/cart';
import { clearGuestCartStorage, readGuestCartStorage } from '@/components/cart/CartProvider';
import { registerSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

type RegisterValues = { name: string; email: string; password: string; confirmPassword: string };

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema) as unknown as Resolver<RegisterValues>,
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    const result = await registerAction({ ...values, next });
    if (!result.ok) {
      setSubmitting(false);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field in form.getValues()) {
            form.setError(field as keyof RegisterValues, { message: messages[0] });
          }
        }
      }
      setFormError(result.message);
      return;
    }

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
        label="نام و نام خانوادگی"
        autoComplete="name"
        placeholder="مثلاً سارا کریمی"
        error={form.formState.errors.name?.message}
        {...form.register('name')}
      />

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

      <div className="v3-password-field">
        <Input
          label="گذرواژه"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          dir="ltr"
          placeholder="حداقل ۸ نویسه، شامل حرف و رقم"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="v3-password-toggle"
          aria-label={showPassword ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
        >
          {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      </div>

      <Input
        label="تکرار گذرواژه"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        dir="ltr"
        placeholder="دوباره وارد کن"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register('confirmPassword')}
      />

      <button type="submit" disabled={submitting} className={cn('btn btn-primary btn-block', submitting && 'opacity-70')}>
        {submitting ? 'در حال ساخت حساب…' : 'ساخت حساب'}
        <ArrowLeft aria-hidden="true" className="size-4" />
      </button>

      <p className="text-center text-xs text-ink-soft">
        قبلاً ثبت‌نام کرده‌ای؟{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-plum underline-offset-4 hover:underline">
          وارد شو
        </Link>
      </p>
    </form>
  );
}
