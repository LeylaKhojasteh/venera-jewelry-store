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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl">قیمت، موجودی و نمایش</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">
            تغییرها بلافاصله روی فروشگاه اعمال می‌شوند. قیمت پیش از تخفیف باید از قیمت فعال بزرگ‌تر باشد،
            وگرنه ذخیره نمی‌شود.
          </p>
        </div>
        <Link href="/products" className="btn btn-outline btn-sm">
          دیدن فروشگاه
        </Link>
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        {new Intl.NumberFormat('fa-IR').format(products.length)} محصول · موجودی کل:{' '}
        {new Intl.NumberFormat('fa-IR').format(products.reduce((sum, product) => sum + product.stock, 0))} عدد
      </p>

      <div className="mt-5 space-y-3">
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

      <p className="mt-6 text-[0.65rem] leading-6 text-ink-soft">
        نمونه: قیمت فعال و قیمت پیش از تخفیف با اعداد کامل تومان ذخیره می‌شوند (
        {formatToman(1_490_000)}).
      </p>
    </div>
  );
}
