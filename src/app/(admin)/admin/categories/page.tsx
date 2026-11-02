import Link from 'next/link';
import { prisma } from '@/lib/db';

export const metadata = { title: 'دسته‌بندی‌ها' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">دسته‌بندی‌ها</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem' }}>
            ساختار کالکشن را مدیریت کن.
          </p>
        </div>
        <Link href="/admin/categories/new" className="v3-btn v3-btn-solid">
          دستهٔ جدید
        </Link>
      </div>

      <div className="v3-admin-table-wrap">
        <table className="v3-admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>اسلاگ</th>
              <th>محصولات</th>
              <th>ترتیب</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td dir="ltr">{category.slug}</td>
                <td>{new Intl.NumberFormat('fa-IR').format(category._count.products)}</td>
                <td>{new Intl.NumberFormat('fa-IR').format(category.sortOrder)}</td>
                <td>
                  <Link href={`/admin/categories/${category.id}`} className="v3-small">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
