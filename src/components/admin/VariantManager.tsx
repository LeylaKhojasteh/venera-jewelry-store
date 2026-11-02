'use client';

import { useTransition } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { addVariantAction, deleteVariantAction } from '@/actions/admin-products';

type Variant = { id: string; kind: string; label: string; stock: number; priceDelta: number };

const kindLabels: Record<string, string> = { SIZE: 'اندازه', COLOR: 'رنگ', FINISH: 'پرداخت' };

export function VariantManager({ productId, variants }: { productId: string; variants: Variant[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="v3-admin-card" style={{ marginTop: '1rem' }}>
      <h2 className="v3-h3">تنوع‌ها</h2>
      {variants.length === 0 ? (
        <p className="v3-small" style={{ marginTop: '0.5rem' }}>
          تنوعی ثبت نشده است.
        </p>
      ) : (
        <div className="v3-admin-table-wrap" style={{ marginTop: '0.75rem' }}>
          <table className="v3-admin-table">
            <thead>
              <tr>
                <th>نوع</th>
                <th>برچسب</th>
                <th>موجودی</th>
                <th>اختلاف قیمت</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>{kindLabels[variant.kind] ?? variant.kind}</td>
                  <td>{variant.label}</td>
                  <td>{new Intl.NumberFormat('fa-IR').format(variant.stock)}</td>
                  <td>{new Intl.NumberFormat('fa-IR').format(variant.priceDelta)}</td>
                  <td>
                    <button
                      type="button"
                      className="v3-icon"
                      aria-label={`حذف ${variant.label}`}
                      disabled={pending}
                      onClick={() => startTransition(() => deleteVariantAction(variant.id))}
                    >
                      <Trash2 aria-hidden="true" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form action={addVariantAction} className="v3-admin-variant-form">
        <input type="hidden" name="productId" value={productId} />
        <select name="kind" className="v3-admin-input" aria-label="نوع تنوع" defaultValue="SIZE">
          <option value="SIZE">اندازه</option>
          <option value="COLOR">رنگ</option>
          <option value="FINISH">پرداخت</option>
        </select>
        <input name="label" className="v3-admin-input" placeholder="برچسب" aria-label="برچسب تنوع" required />
        <input name="stock" type="number" min={0} className="v3-admin-input" placeholder="موجودی" aria-label="موجودی تنوع" required />
        <input name="priceDelta" type="number" min={0} className="v3-admin-input" placeholder="اختلاف قیمت" aria-label="اختلاف قیمت" defaultValue={0} />
        <button type="submit" className="v3-btn v3-btn-solid" disabled={pending}>
          <Plus aria-hidden="true" size={15} /> افزودن
        </button>
      </form>
    </div>
  );
}
