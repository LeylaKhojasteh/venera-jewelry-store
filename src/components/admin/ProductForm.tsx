'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save } from 'lucide-react';
import { saveProductAction } from '@/actions/admin-products';
import type { ActionResult } from '@/types';

export type ProductFormCategory = { id: string; name: string };

export type ProductFormProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  gender: 'WOMEN' | 'MEN' | 'UNISEX';
  price: number;
  compareAtPrice: number | null;
  stock: number;
  materials: string;
  care: string;
  description: string;
  story: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: ProductFormCategory[];
  product?: ProductFormProduct;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult<{ id: string }> | null, FormData>(
    saveProductAction,
    null,
  );

  useEffect(() => {
    if (!state?.ok || !state.data?.id) return;
    if (product) {
      router.refresh();
      return;
    }
    router.push(`/admin/products/${state.data.id}`);
  }, [state, router, product]);

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="v3-admin-form">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {state ? (
        <p
          role="status"
          className="v3-small"
          style={{ background: state.ok ? 'var(--ink-2)' : 'transparent', padding: state.ok ? '0.65rem' : 0, color: state.ok ? 'var(--bone)' : 'var(--error)' }}
        >
          {state.message}
        </p>
      ) : null}

      <div className="v3-admin-form-grid">
        <div>
          <label className="v3-admin-label" htmlFor="product-name">
            نام محصول
          </label>
          <input id="product-name" name="name" className="v3-admin-input" defaultValue={product?.name} required />
          {errors.name ? <p className="v3-qv-error">{errors.name[0]}</p> : null}
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-slug">
            اسلاگ
          </label>
          <input id="product-slug" name="slug" className="v3-admin-input" dir="ltr" defaultValue={product?.slug} required />
          {errors.slug ? <p className="v3-qv-error">{errors.slug[0]}</p> : null}
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-sku">
            SKU
          </label>
          <input id="product-sku" name="sku" className="v3-admin-input" dir="ltr" defaultValue={product?.sku} required />
          {errors.sku ? <p className="v3-qv-error">{errors.sku[0]}</p> : null}
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-category">
            دسته‌بندی
          </label>
          <select id="product-category" name="categoryId" className="v3-admin-input" defaultValue={product?.categoryId}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-gender">
            جنسیت
          </label>
          <select id="product-gender" name="gender" className="v3-admin-input" defaultValue={product?.gender ?? 'WOMEN'}>
            <option value="WOMEN">زنانه</option>
            <option value="MEN">مردانه</option>
            <option value="UNISEX">یونیسکس</option>
          </select>
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-price">
            قیمت (تومان)
          </label>
          <input id="product-price" name="price" type="number" min={0} className="v3-admin-input" dir="ltr" defaultValue={product?.price ?? 0} required />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-compare">
            قیمت پیش از تخفیف
          </label>
          <input id="product-compare" name="compareAtPrice" type="number" min={0} className="v3-admin-input" dir="ltr" defaultValue={product?.compareAtPrice ?? ''} placeholder="خالی = بدون تخفیف" />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-stock">
            موجودی
          </label>
          <input id="product-stock" name="stock" type="number" min={0} className="v3-admin-input" dir="ltr" defaultValue={product?.stock ?? 0} required />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-materials">
            جنس
          </label>
          <input id="product-materials" name="materials" className="v3-admin-input" defaultValue={product?.materials ?? 'استیل ۳۱۶'} />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-tags">
            برچسب‌ها (با ویرگول)
          </label>
          <input id="product-tags" name="tags" className="v3-admin-input" defaultValue={product?.tags.join('، ')} />
        </div>
      </div>

      <div>
        <label className="v3-admin-label" htmlFor="product-description">
          توضیح کوتاه
        </label>
        <textarea id="product-description" name="description" className="v3-admin-input v3-admin-textarea" defaultValue={product?.description} required />
        {errors.description ? <p className="v3-qv-error">{errors.description[0]}</p> : null}
      </div>

      <div className="v3-admin-form-grid">
        <div>
          <label className="v3-admin-label" htmlFor="product-story">
            داستان محصول
          </label>
          <textarea id="product-story" name="story" className="v3-admin-input v3-admin-textarea" defaultValue={product?.story} />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="product-care">
            نگهداری
          </label>
          <textarea id="product-care" name="care" className="v3-admin-input v3-admin-textarea" defaultValue={product?.care} />
        </div>
      </div>

      <div>
        <label className="v3-admin-label" htmlFor="product-images">
          تصاویر جدید (JPEG، PNG یا WebP؛ حداکثر ۴ مگابایت هر فایل)
        </label>
        <input id="product-images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="v3-admin-input" />
      </div>

      <div className="v3-admin-checks">
        <label className="v3-admin-check">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} /> فعال
        </label>
        <label className="v3-admin-check">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} /> ویژه
        </label>
        <label className="v3-admin-check">
          <input type="checkbox" name="isBestSeller" defaultChecked={product?.isBestSeller ?? false} /> پرفروش
        </label>
      </div>

      <div className="v3-admin-form-actions">
        <button type="submit" disabled={pending} className="v3-btn v3-btn-solid">
          {pending ? <Loader2 aria-hidden="true" size={16} className="animate-spin" /> : <Save aria-hidden="true" size={16} />}
          {pending ? 'در حال ذخیره…' : 'ذخیرهٔ محصول'}
        </button>
        <Link href="/admin/products" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>
    </form>
  );
}
