'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateContactStatusAction } from '@/actions/admin';
import { contactStatusLabels } from '@/lib/constants';

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
    <article className={`v3-admin-message${status === 'NEW' ? ' is-new' : ''}`}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <p style={{ color: 'var(--bone)', fontSize: 16, fontWeight: 600 }}>{message.subject}</p>
          <p className="v3-small" style={{ marginTop: '0.25rem' }}>
            {message.name} · <span dir="ltr">{message.email}</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="v3-status">{contactStatusLabels[status]}</span>
          <span className="v3-small">{message.createdAtLabel}</span>
        </div>
      </div>

      <p className="v3-body" style={{ marginTop: '0.75rem', whiteSpace: 'pre-line' }}>
        {message.message}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--line)', fontSize: 13 }}>
        {pending ? <Loader2 aria-hidden="true" size={14} className="animate-spin" /> : null}
        {status !== 'READ' ? (
          <button type="button" onClick={() => update('READ')} disabled={pending} className="v3-small">
            علامت‌گذاری به‌عنوان خوانده‌شده
          </button>
        ) : null}
        {status !== 'ARCHIVED' ? (
          <button type="button" onClick={() => update('ARCHIVED')} disabled={pending} className="v3-small">
            بایگانی
          </button>
        ) : null}
        {status !== 'NEW' ? (
          <button type="button" onClick={() => update('NEW')} disabled={pending} className="v3-small">
            بازگرداندن به تازه
          </button>
        ) : null}
        <a href={`mailto:${message.email}`} className="v3-small" style={{ marginInlineStart: 'auto' }} dir="ltr">
          {message.email}
        </a>
      </div>
    </article>
  );
}
