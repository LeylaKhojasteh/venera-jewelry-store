'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateOrderStatusAction } from '@/actions/admin';
import { orderStatusLabels } from '@/lib/constants';
import { formatToman } from '@/lib/money';

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  city: string;
  total: number;
  status: 'DEMO_PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAtLabel: string;
  itemCount: number;
};

export function AdminOrderRow({ order }: { order: AdminOrder }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = async (next: AdminOrder['status']) => {
    setStatus(next);
    setSaving(true);
    setMessage(null);
    const result = await updateOrderStatusAction({ orderId: order.id, status: next });
    setSaving(false);
    if (!result.ok) {
      setStatus(order.status);
      setMessage(result.message);
      return;
    }
    setMessage('ذخیره شد');
    router.refresh();
    window.setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="v3-admin-row v3-admin-order-row grid">
      <div>
        <p className="font-latin" style={{ color: 'var(--bone)', fontSize: 14, letterSpacing: '0.06em' }} dir="ltr">
          {order.orderNumber}
        </p>
        <p className="v3-small">{order.createdAtLabel}</p>
      </div>
      <div style={{ fontSize: 14 }}>
        <p style={{ color: 'var(--bone)' }}>{order.customer}</p>
        <p className="v3-small">{order.city}</p>
      </div>
      <div className="v3-small">{new Intl.NumberFormat('fa-IR').format(order.itemCount)} عدد</div>
      <div style={{ color: 'var(--bone)', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
        {formatToman(order.total)}
      </div>
      <div>
        <label htmlFor={`status-${order.id}`} className="sr-only">
          وضعیت سفارش {order.orderNumber}
        </label>
        <select
          id={`status-${order.id}`}
          value={status}
          disabled={saving}
          onChange={(event) => update(event.target.value as AdminOrder['status'])}
          className="v3-admin-input"
        >
          {Object.entries(orderStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="v3-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
          {saving ? <Loader2 aria-hidden="true" size={12} className="animate-spin" /> : null}
          {message ?? <Link href={`/admin/orders/${order.id}`}>جزئیات کامل</Link>}
        </div>
      </div>
    </div>
  );
}
