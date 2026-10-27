'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import { updateProductAction } from '@/actions/admin';
import { cn } from '@/lib/utils';

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
    <div className="grid gap-4 border border-line bg-paper-soft p-4 lg:grid-cols-[minmax(0,1fr)_9rem_9rem_7rem_auto] lg:items-center">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-blush">
          {product.image ? <Image src={product.image} alt="" fill sizes="56px" className="object-cover" /> : null}
        </div>
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`} className="truncate text-sm font-medium text-plum-ink hover:text-plum">
            {product.name}
          </Link>
          <p className="mt-1 text-[0.65rem] text-ink-soft" dir="ltr">
            {product.sku}
          </p>
          <p className="mt-0.5 text-[0.65rem] text-ink-soft">{product.categoryName}</p>
        </div>
      </div>

      <div>
        <label htmlFor={`price-${product.id}`} className="text-[0.62rem] text-ink-soft">
          قیمت فعال (تومان)
        </label>
        <input
          id={`price-${product.id}`}
          type="number"
          min={0}
          step={10000}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="mt-1 h-10 w-full border border-line bg-paper px-2 text-xs tabular"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor={`compare-${product.id}`} className="text-[0.62rem] text-ink-soft">
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
          className="mt-1 h-10 w-full border border-line bg-paper px-2 text-xs tabular placeholder:text-[0.6rem]"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor={`stock-${product.id}`} className="text-[0.62rem] text-ink-soft">
          موجودی
        </label>
        <input
          id={`stock-${product.id}`}
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          className="mt-1 h-10 w-full border border-line bg-paper px-2 text-xs tabular"
          dir="ltr"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[0.65rem] lg:flex-col lg:items-start">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="size-4 accent-[#602D3B]"
          />
          فعال
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="size-4 accent-[#602D3B]"
          />
          ویژه
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(event) => setIsBestSeller(event.target.checked)}
            className="size-4 accent-[#602D3B]"
          />
          پرفروش
        </label>
      </div>

      <div className="flex flex-col items-stretch gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className={cn('btn btn-sm', saved ? 'btn-primary bg-success border-success' : 'btn-primary')}
        >
          {saving ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : saved ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Save aria-hidden="true" className="size-3.5" />
          )}
          {saved ? 'ذخیره شد' : 'ذخیره'}
        </button>
        {error ? <p className="max-w-[12rem] text-[0.62rem] leading-4 text-error">{error}</p> : null}
      </div>
    </div>
  );
}
