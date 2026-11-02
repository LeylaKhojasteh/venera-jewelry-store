import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const metadata = { title: 'ویرایش دسته' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">ویرایش {category.name}</h1>
        </div>
        <Link href="/admin/categories" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>
      <CategoryForm
        category={{
          id: category.id,
          slug: category.slug,
          name: category.name,
          latinName: category.latinName,
          tagline: category.tagline,
          description: category.description,
          image: category.image,
          imageAlt: category.imageAlt,
          sortOrder: category.sortOrder,
        }}
      />
    </div>
  );
}
