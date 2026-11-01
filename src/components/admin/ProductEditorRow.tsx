'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import { updateProductAction } from '@/actions/admin';

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  categoryName: string;
  image: string | null;
};

export function ProductEditorRow({ product }: { product: AdminProduct }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(product.price));
  const [compareAt, setCompareAt] = useState(product.compareAtPrice ? String(product.compareAtPrice) : '');
  const [stock, setStock] = useState(String(product.stock));
  const [isActive, setIsActive] = useState(product.isActive);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [isBestSeller, setIsBestSeller] = useState(product.isBestSeller);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    price !== String(product.price) ||
    compareAt !== (product.compareAtPrice ? String(product.compareAtPrice) : '') ||
    stock !== String(product.stock) ||
    isActive !== product.isActive ||
    isFeatured !== product.isFeatured ||
    isBestSeller !== product.isBestSeller;

  const save = async () => {
    setSaving(true);
    setError(null);
    const result = await updateProductAction({
      id: product.id,
      price: Number(price),
      compareAtPrice: compareAt === '' ? null : Number(compareAt),
      stock: Number(stock),
      isActive,
      isFeatured,
      isBestSeller,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
    router.refresh();
  };

  return (
    <div className="v3-admin-row v3-admin-product-row grid">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <div style={{ position: 'relative', width: '3.5rem', height: '4rem', flex: 'none', overflow: 'hidden', background: 'var(--ink)' }}>
          {product.image ? <Image src={product.image} alt="" fill sizes="56px" className="object-cover" /> : null}
        </div>
        <div style={{ minWidth: 0 }}>
          <Link href={`/products/${product.slug}`} style={{ display: 'block', overflow: 'hidden', color: 'var(--bone)', fontSize: 16, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </Link>
          <p className="v3-small" dir="ltr" style={{ marginTop: '0.15rem' }}>
            {product.sku}
          </p>
          <p className="v3-small">{product.categoryName}</p>
        </div>
      </div>

      <div>
        <label htmlFor={`price-${product.id}`} className="v3-admin-label">
          قیمت فعال (تومان)
        </label>
        <input
          id={`price-${product.id}`}
          type="number"
          min={0}
          step={10000}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="v3-admin-input"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor={`compare-${product.id}`} className="v3-admin-label">
          قیمت پیش از تخفیف
        </label>
        <input
          id={`compare-${product.id}`}
          type="number"
          min={0}
          step={10000}
          value={compareAt}
          onChange={(event) => setCompareAt(event.target.value)}
          placeholder="خالی = بدون تخفیف"
          className="v3-admin-input"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor={`stock-${product.id}`} className="v3-admin-label">
          موجودی
        </label>
        <input
          id={`stock-${product.id}`}
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          className="v3-admin-input"
          dir="ltr"
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        <label className="v3-admin-check">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          فعال
        </label>
        <label className="v3-admin-check">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
          />
          ویژه
        </label>
        <label className="v3-admin-check">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(event) => setIsBestSeller(event.target.checked)}
          />
          پرفروش
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="v3-btn v3-btn-solid"
          style={{ minHeight: '2.5rem', paddingInline: '0.9rem', whiteSpace: 'nowrap' }}
        >
          {saving ? (
            <Loader2 aria-hidden="true" size={14} className="animate-spin" />
          ) : saved ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <Save aria-hidden="true" size={14} />
          )}
          {saved ? 'ذخیره شد' : 'ذخیره'}
        </button>
        {error ? (
          <p className="v3-qv-error" style={{ maxWidth: '12rem', lineHeight: 1.5 }}>
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
