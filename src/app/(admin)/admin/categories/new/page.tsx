import Link from 'next/link';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const metadata = { title: 'دستهٔ جدید' };

export default function NewCategoryPage() {
  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">دستهٔ جدید</h1>
        </div>
        <Link href="/admin/categories" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>
      <CategoryForm />
    </div>
  );
}
