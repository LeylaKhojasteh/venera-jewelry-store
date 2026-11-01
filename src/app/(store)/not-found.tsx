import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { categoryNav } from '@/lib/constants';

export default function StoreNotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <h1 className="display text-4xl">این آیتم در کالکشن نیست.</h1>
      <p className="mt-4 max-w-lg text-base leading-9 text-ink-soft">
        ممکن است نشانی اشتباه باشد یا محصول دیگر عرضه نشود. کالکشن کامل هنوز در دسترس است.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/products">همه محصولات</ButtonLink>
        <ButtonLink href="/" variant="outline">
          خانه
        </ButtonLink>
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {categoryNav.map((category) => (
          <Link key={category.slug} href={`/products?category=${category.slug}`} className="chip">
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
