'use client';

import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Send } from 'lucide-react';
import { submitContactAction } from '@/actions/contact';
import { contactSchema } from '@/lib/validation';
import { formatDigits } from '@/lib/money';

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

const topics = [
  { label: 'سایز و اندازه', subject: 'سؤال دربارهٔ سایز' },
  { label: 'موجودی', subject: 'سؤال دربارهٔ موجودی' },
  { label: 'پیگیری سفارش', subject: 'پیگیری سفارش' },
  { label: 'همکاری', subject: 'همکاری با ونرا' },
];

export function ContactForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactValues>,
    defaultValues: { name: '', email: '', subject: '', message: '', company: '' },
    mode: 'onSubmit',
  });

  const message = form.watch('message');

  const chooseTopic = (item: (typeof topics)[number]) => {
    setTopic(item.label);
    form.setValue('subject', item.subject, { shouldValidate: true });
  };

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
    setReference(result.data.id.slice(0, 8).toUpperCase());
    setSent(true);
    form.reset();
    setTopic(null);
  });

  if (sent) {
    return (
      <div className="v3-contact-success" role="status">
        <span className="v3-contact-success-icon">
          <Check aria-hidden="true" size={22} />
        </span>
        <h2 className="v3-h3">پیامت ثبت شد.</h2>
        <p className="v3-body" style={{ marginTop: '0.5rem', maxWidth: '42ch' }}>
          پیام تو با شمارهٔ پیگیری{' '}
          <strong className="font-latin" dir="ltr">
            {reference}
          </strong>{' '}
          ثبت شد. تیم ونرا معمولاً در اولین روز کاری پاسخ می‌دهد.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => setSent(false)} className="v3-btn v3-btn-solid">
            ارسال پیام دیگر
          </button>
          <a href="mailto:hello@venera.example" className="v3-btn v3-btn-line">
            ایمیل مستقیم
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="v3-contact-form">
      <div className="v3-contact-form-head">
        <h2 className="v3-h3">فرم تماس</h2>
        <p className="v3-small">موضوع را انتخاب کن یا خودت بنویس.</p>
      </div>

      {formError ? (
        <p role="alert" className="v3-qv-error">
          {formError}
        </p>
      ) : null}

      <div className="v3-topic-chips" role="group" aria-label="انتخاب سریع">
        {topics.map((item) => (
          <button
            key={item.label}
            type="button"
            className="v3-choice"
            aria-pressed={topic === item.label}
            onClick={() => chooseTopic(item)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="v3-contact-form-grid">
        <div>
          <label htmlFor="contact-name" className="v3-admin-label">
            نام
          </label>
          <input
            id="contact-name"
            className="v3-admin-input"
            autoComplete="name"
            placeholder="نام تو"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          {form.formState.errors.name ? <p className="v3-qv-error">{form.formState.errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="v3-admin-label">
            ایمیل
          </label>
          <input
            id="contact-email"
            className="v3-admin-input"
            type="email"
            inputMode="email"
            dir="ltr"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />
          {form.formState.errors.email ? <p className="v3-qv-error">{form.formState.errors.email.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="v3-admin-label">
          موضوع
        </label>
        <input
          id="contact-subject"
          className="v3-admin-input"
          placeholder="دربارهٔ چه چیزی می‌نویسی؟"
          aria-invalid={Boolean(form.formState.errors.subject)}
          {...form.register('subject')}
        />
        {form.formState.errors.subject ? <p className="v3-qv-error">{form.formState.errors.subject.message}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="v3-admin-label">
          پیام
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className="v3-admin-input v3-admin-textarea"
          placeholder="سؤالت را بنویس؛ اگر دربارهٔ یک آیتم خاص است، نامش را هم بیاور."
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register('message')}
        />
        <div className="v3-contact-form-foot">
          {form.formState.errors.message ? (
            <p className="v3-qv-error">{form.formState.errors.message.message}</p>
          ) : (
            <span />
          )}
          <span className="v3-small">{formatDigits(message?.length ?? 0)} / ۲۰۰۰</span>
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" {...form.register('company')} />
      </div>

      <button type="submit" disabled={submitting} className="v3-btn v3-btn-solid">
        {submitting ? <Loader2 aria-hidden="true" size={16} className="animate-spin" /> : <Send aria-hidden="true" size={16} />}
        {submitting ? 'در حال ارسال…' : 'ارسال پیام'}
      </button>
    </form>
  );
}
