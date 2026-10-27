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
    <div className="grid gap-3 border border-line bg-paper-soft p-4 md:grid-cols-[1fr_1fr_8rem_10rem_9rem] md:items-center">
      <div>
        <p className="font-latin text-xs tracking-[0.08em] text-plum-ink" dir="ltr">
          {order.orderNumber}
        </p>
        <p className="mt-1 text-[0.65rem] text-ink-soft">{order.createdAtLabel}</p>
      </div>
      <div className="text-xs">
        <p className="text-plum-ink">{order.customer}</p>
        <p className="mt-0.5 text-ink-soft">{order.city}</p>
      </div>
      <div className="text-xs text-ink-soft">
        {new Intl.NumberFormat('fa-IR').format(order.itemCount)} عدد
      </div>
      <div className="tabular text-xs text-plum-ink">{formatToman(order.total)}</div>
      <div>
        <label htmlFor={`status-${order.id}`} className="sr-only">
          وضعیت سفارش {order.orderNumber}
        </label>
        <select
          id={`status-${order.id}`}
          value={status}
          disabled={saving}
          onChange={(event) => update(event.target.value as AdminOrder['status'])}
          className="h-10 w-full border border-line bg-paper px-2 text-xs"
        >
          {Object.entries(orderStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="mt-1 flex items-center gap-1 text-[0.6rem] text-ink-soft">
          {saving ? <Loader2 aria-hidden="true" className="size-3 animate-spin" /> : null}
          {message ??
            (status === 'DEMO_PLACED' ? (
              <Link href={`/admin/orders?focus=${order.id}`} className="hover:text-plum">
                جزئیات
              </Link>
            ) : null)}
        </div>
      </div>
    </div>
  );
}
