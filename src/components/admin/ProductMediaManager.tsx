'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProductImageAction } from '@/actions/admin-products';

type Image = { id: string; url: string; alt: string; sortOrder: number };

export function ProductMediaManager({ images }: { images: Image[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="v3-admin-card" style={{ marginTop: '1rem' }}>
      <h2 className="v3-h3">تصاویر محصول</h2>
      {images.length === 0 ? (
        <p className="v3-small" style={{ marginTop: '0.5rem' }}>
          هنوز تصویری ثبت نشده است.
        </p>
      ) : (
        <div className="v3-admin-media-grid">
          {images.map((image) => (
            <div key={image.id} className="v3-admin-media-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt} />
              <button
                type="button"
                className="v3-icon"
                aria-label="حذف تصویر"
                disabled={pending}
                onClick={() => startTransition(() => deleteProductImageAction(image.id))}
              >
                <Trash2 aria-hidden="true" size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
