import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductMediaManager } from '@/components/admin/ProductMediaManager';
import { VariantManager } from '@/components/admin/VariantManager';
import { archiveProductAction } from '@/actions/admin-products';

export const metadata = { title: 'ویرایش محصول' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">ویرایش {product.name}</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem' }}>
            تصاویر، متن، قیمت و موجودی را کامل ویرایش کن.
          </p>
        </div>
        <Link href="/admin/products" className="v3-btn v3-btn-line">
          بازگشت
        </Link>
      </div>

      {product.isActive ? (
        <form
          action={async () => {
            'use server';
            await archiveProductAction(product.id);
          }}
          style={{ marginBottom: '1rem' }}
        >
          <button type="submit" className="v3-btn v3-btn-line">
            آرشیو محصول
          </button>
        </form>
      ) : null}

      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          categoryId: product.categoryId,
          gender: product.gender,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          materials: product.materials,
          care: product.care,
          description: product.description,
          story: product.story,
          tags: product.tags,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
        }}
      />

      <ProductMediaManager images={product.images.map((image) => ({ id: image.id, url: image.url, alt: image.alt, sortOrder: image.sortOrder }))} />
      <VariantManager
        productId={product.id}
        variants={product.variants.map((variant) => ({
          id: variant.id,
          kind: variant.kind,
          label: variant.label,
          stock: variant.stock,
          priceDelta: variant.priceDelta,
        }))}
      />
    </div>
  );
}
