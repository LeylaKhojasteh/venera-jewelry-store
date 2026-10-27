'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateContactStatusAction } from '@/actions/admin';
import { contactStatusLabels } from '@/lib/constants';
import { cn } from '@/lib/utils';

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  createdAtLabel: string;
};

export function AdminMessageCard({ message }: { message: AdminMessage }) {
  const router = useRouter();
  const [status, setStatus] = useState(message.status);
  const [pending, setPending] = useState(false);

  const update = async (next: AdminMessage['status']) => {
    setPending(true);
    const result = await updateContactStatusAction({ messageId: message.id, status: next });
    setPending(false);
    if (result.ok) {
      setStatus(next);
      router.refresh();
    }
  };

  return (
    <article
      className={cn(
        'border bg-paper-soft p-5',
        status === 'NEW' ? 'border-plum/40' : 'border-line',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-plum-ink">{message.subject}</p>
          <p className="mt-1 text-[0.68rem] text-ink-soft">
            {message.name} · <span dir="ltr">{message.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('badge', status === 'NEW' ? 'badge' : 'badge-soft')}>
            {contactStatusLabels[status]}
          </span>
          <span className="text-[0.62rem] text-ink-soft">{message.createdAtLabel}</span>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-8 text-ink-soft">{message.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3 text-xs">
        {pending ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin text-ink-soft" /> : null}
        {status !== 'READ' ? (
          <button type="button" onClick={() => update('READ')} disabled={pending} className="text-plum hover:underline">
            علامت‌گذاری به‌عنوان خوانده‌شده
          </button>
        ) : null}
        {status !== 'ARCHIVED' ? (
          <button
            type="button"
            onClick={() => update('ARCHIVED')}
            disabled={pending}
            className="text-ink-soft hover:text-plum"
          >
            بایگانی
          </button>
        ) : null}
        {status !== 'NEW' ? (
          <button
            type="button"
            onClick={() => update('NEW')}
            disabled={pending}
            className="text-ink-soft hover:text-plum"
          >
            بازگرداندن به تازه
          </button>
        ) : null}
        <a href={`mailto:${message.email}`} className="ms-auto text-ink-soft hover:text-plum" dir="ltr">
          {message.email}
        </a>
      </div>
    </article>
  );
}
