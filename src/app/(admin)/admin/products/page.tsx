import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductEditorRow } from '@/components/admin/ProductEditorRow';
import { formatToman } from '@/lib/money';

export const metadata = { title: 'مدیریت محصولات' };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
    },
  });

  return (
    <div>
      <div className="v3-catalog-head" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="v3-display">قیمت، موجودی و نمایش</h1>
          <p className="v3-lead" style={{ marginTop: '0.75rem', maxWidth: '52ch' }}>
            تغییرها بلافاصله روی فروشگاه اعمال می‌شوند. قیمت پیش از تخفیف باید از قیمت فعال بزرگ‌تر باشد،
            وگرنه ذخیره نمی‌شود.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link href="/admin/products/new" className="v3-btn v3-btn-solid">
            محصول جدید
          </Link>
          <Link href="/products" className="v3-btn v3-btn-line">
            دیدن فروشگاه
          </Link>
        </div>
      </div>

      <p className="v3-small" style={{ marginTop: '1rem' }}>
        {new Intl.NumberFormat('fa-IR').format(products.length)} محصول · موجودی کل:{' '}
        {new Intl.NumberFormat('fa-IR').format(products.reduce((sum, product) => sum + product.stock, 0))} عدد
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
        {products.map((product) => (
          <ProductEditorRow
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              stock: product.stock,
              isActive: product.isActive,
              isFeatured: product.isFeatured,
              isBestSeller: product.isBestSeller,
              categoryName: product.category.name,
              image: product.images[0]?.url ?? null,
            }}
          />
        ))}
      </div>

      <p className="v3-small" style={{ marginTop: '1.5rem' }}>
        نمونه: قیمت فعال و قیمت پیش از تخفیف با اعداد کامل تومان ذخیره می‌شوند (
        {formatToman(1_490_000)}).
      </p>
    </div>
  );
}
