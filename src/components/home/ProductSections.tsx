import { SectionHeading, QuietLink } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import type { ProductCardData } from '@/types';

export function BestSellers({ products }: { products: ProductCardData[] }) {
  return (
    <section className="section" aria-labelledby="best-sellers-title">
      <div className="shell">
        <SectionHeading
          title={<span id="best-sellers-title">محبوب‌ترین انتخاب‌های شما</span>}
          description="قطعه‌هایی که بیشتر از همه دیده و انتخاب شده‌اند؛ از زنجیرهای سبک تا انگشترهای سنگین‌تر."
          action={<QuietLink href="/products?sort=bestseller">همهٔ محصولات</QuietLink>}
        />
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.slice(0, 4).map((product, index) => (
            <Reveal key={product.id} delay={index * 60}>
              <ProductCard product={product} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SaleSection({ products }: { products: ProductCardData[] }) {
  return (
    <section className="section bg-paper-deep/60" aria-labelledby="sale-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="sale-title" className="display text-3xl">
              فرصتی برای درخشیدن
            </h2>
            <p className="mt-5 max-w-sm text-base leading-8 text-ink-soft">
              تعداد محدودی از قطعه‌ها با قیمت پیش از تخفیف مشخص عرضه شده‌اند. درصدها از اختلاف واقعی دو قیمت
              محاسبه می‌شوند، نه از یک عدد گرد.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-6 text-ink-soft/80">
              قیمت خط‌خورده، قیمت پیش از تخفیف است. موجودی هر گزینه در صفحهٔ محصول به‌روز می‌شود.
            </p>
            <div className="mt-7">
              <QuietLink href="/products?discount=1">دیدن همهٔ تخفیف‌دارها</QuietLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:col-span-8 lg:gap-x-5">
            {products.slice(0, 4).map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
