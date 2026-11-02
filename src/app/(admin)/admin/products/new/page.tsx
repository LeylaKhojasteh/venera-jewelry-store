import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = { title: 'محصول جدید' };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } });

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">محصول جدید</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem' }}>
            محصول را با تصویر و موجودی بساز؛ بعد از ذخیره می‌توانی تنوع‌ها را اضافه کنی.
          </p>
        </div>
        <Link href="/admin/products" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="v3-empty" style={{ background: 'var(--ink-2)', padding: '2rem' }}>
          اول یک دسته‌بندی بساز.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
