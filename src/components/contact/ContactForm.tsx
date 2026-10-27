'use client';

import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Send } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Field';
import { submitContactAction } from '@/actions/contact';
import { contactSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

export function ContactForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactValues>,
    defaultValues: { name: '', email: '', subject: '', message: '', company: '' },
    mode: 'onSubmit',
  });

  const message = form.watch('message');

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    const result = await submitContactAction({ ...values, startedAt });
    setSubmitting(false);
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field in values) form.setError(field as keyof ContactValues, { message: messages[0] });
        }
      }
      setFormError(result.message);
      return;
    }
    setSent(true);
    form.reset();
  });

  if (sent) {
    return (
      <div className="border border-line bg-paper-soft p-8 text-center sm:p-12" role="status">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-success/40 text-success">
          <Check aria-hidden="true" className="size-6" />
        </span>
        <h2 className="display mt-5 text-2xl">پیامت ثبت شد.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-ink-soft">
          پیامت ثبت شد. تیم ونرا در اولین فرصت آن را می‌بیند و اگر لازم باشد پاسخ می‌دهد.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-outline mt-7">
          ارسال پیام دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-line bg-paper-soft p-6 sm:p-8">
      {formError ? (
        <p role="alert" className="mb-5 border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="نام"
          autoComplete="name"
          placeholder="نام تو"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <Input
          label="ایمیل"
          type="email"
          inputMode="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
      </div>

      <div className="mt-4">
        <Input
          label="موضوع"
          placeholder="دربارهٔ چه چیزی می‌نویسی؟"
          error={form.formState.errors.subject?.message}
          {...form.register('subject')}
        />
      </div>

      <div className="mt-4">
        <Textarea
          label="پیام"
          rows={6}
          placeholder="سؤالت را بنویس؛ اگر دربارهٔ یک قطعهٔ خاص است، نامش را هم بیاور."
          error={form.formState.errors.message?.message}
          {...form.register('message')}
        />
        <p className="mt-1 text-end text-[0.65rem] text-ink-soft">{new Intl.NumberFormat('fa-IR').format(message?.length ?? 0)} / ۲۰۰۰</p>
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" {...form.register('company')} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-sm text-[0.68rem] leading-6 text-ink-soft">
          اطلاعات این فرم فقط برای پاسخ‌گویی استفاده می‌شود.
        </p>
        <button type="submit" disabled={submitting} className={cn('btn btn-primary min-w-[10rem]', submitting && 'opacity-70')}>
          {submitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
          {submitting ? 'در حال ارسال…' : 'ارسال پیام'}
        </button>
      </div>
    </form>
  );
}
