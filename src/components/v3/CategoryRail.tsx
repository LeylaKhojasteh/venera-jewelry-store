import Image from 'next/image';
import Link from 'next/link';
import { formatDigits } from '@/lib/money';
import type { CategoryData, ProductCardData } from '@/types';

export function CategoryRail({
  categories,
  products,
}: {
  categories: CategoryData[];
  products: ProductCardData[];
}) {
  return (
    <section className="v3-section" aria-labelledby="categories-title">
      <div className="v3-shell">
        <div className="v3-rail-head">
          <div>
            <h2 id="categories-title" className="v3-h2">
              دسته‌بندی
            </h2>
          </div>
        </div>

        <div className="v3-category-grid">
          {categories.map((category) => {
            const image = products.find((product) => product.categorySlug === category.slug)?.image;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="v3-category-card"
              >
                <span className="v3-category-media">
                  {image ? (
                    <Image src={image} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                  ) : null}
                </span>
                <span className="v3-category-body">
                  <span className="v3-category-name">
                    {category.name} <span className="v3-category-count">({formatDigits(category.productCount)})</span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
