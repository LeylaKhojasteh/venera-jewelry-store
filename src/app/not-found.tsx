import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { categoryNav } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-paper">
      <div className="shell flex min-h-[70vh] flex-col justify-center py-20">
        <h1 className="display max-w-2xl text-4xl">این صفحه پیدا نشد.</h1>
        <p className="mt-5 max-w-lg text-base leading-9 text-ink-soft">
          شاید نشانی تغییر کرده یا آیتم از کالکشن خارج شده باشد. از این‌جا دوباره شروع کن.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">بازگشت به خانه</ButtonLink>
          <ButtonLink href="/products" variant="outline">
            دیدن کالکشن
          </ButtonLink>
        </div>
        <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {categoryNav.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="flex min-h-14 items-center justify-between border border-line px-4 text-sm text-plum-ink transition-colors hover:border-plum hover:bg-blush/30"
            >
              {category.name}
              <span className="font-latin text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">{category.latin}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
