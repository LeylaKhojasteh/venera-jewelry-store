'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save } from 'lucide-react';
import { saveCategoryAction } from '@/actions/admin-categories';
import type { ActionResult } from '@/types';

export type CategoryFormData = {
  id: string;
  slug: string;
  name: string;
  latinName: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
};

export function CategoryForm({ category }: { category?: CategoryFormData }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult<{ id: string }> | null, FormData>(
    saveCategoryAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) router.push('/admin/categories');
  }, [state, router]);

  return (
    <form action={formAction} className="v3-admin-form">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      {state && !state.ok ? <p className="v3-qv-error">{state.message}</p> : null}

      <div className="v3-admin-form-grid">
        <div>
          <label className="v3-admin-label" htmlFor="category-name">
            نام دسته
          </label>
          <input id="category-name" name="name" className="v3-admin-input" defaultValue={category?.name} required />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="category-slug">
            اسلاگ
          </label>
          <input id="category-slug" name="slug" className="v3-admin-input" dir="ltr" defaultValue={category?.slug} required />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="category-latin">
            نام لاتین
          </label>
          <input id="category-latin" name="latinName" className="v3-admin-input" dir="ltr" defaultValue={category?.latinName} required />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="category-order">
            ترتیب نمایش
          </label>
          <input id="category-order" name="sortOrder" type="number" min={0} className="v3-admin-input" dir="ltr" defaultValue={category?.sortOrder ?? 0} />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="category-image">
            آدرس تصویر
          </label>
          <input id="category-image" name="image" className="v3-admin-input" dir="ltr" defaultValue={category?.image} placeholder="/images/products/..." />
        </div>
        <div>
          <label className="v3-admin-label" htmlFor="category-image-alt">
            متن جایگزین تصویر
          </label>
          <input id="category-image-alt" name="imageAlt" className="v3-admin-input" defaultValue={category?.imageAlt} />
        </div>
      </div>

      <div>
        <label className="v3-admin-label" htmlFor="category-tagline">
          تیتر کوتاه
        </label>
        <input id="category-tagline" name="tagline" className="v3-admin-input" defaultValue={category?.tagline} />
      </div>
      <div>
        <label className="v3-admin-label" htmlFor="category-description">
          توضیح
        </label>
        <textarea id="category-description" name="description" className="v3-admin-input v3-admin-textarea" defaultValue={category?.description} />
      </div>

      <div className="v3-admin-form-actions">
        <button type="submit" disabled={pending} className="v3-btn v3-btn-solid">
          {pending ? <Loader2 aria-hidden="true" size={16} className="animate-spin" /> : <Save aria-hidden="true" size={16} />}
          {pending ? 'در حال ذخیره…' : 'ذخیرهٔ دسته'}
        </button>
        <Link href="/admin/categories" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>
    </form>
  );
}
