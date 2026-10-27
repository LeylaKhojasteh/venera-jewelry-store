import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { SectionHeading, QuietLink } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';

const layouts = [
  'col-span-12 row-span-2 lg:col-span-7 lg:min-h-[44rem]',
  'col-span-6 lg:col-span-5 lg:min-h-[21.5rem]',
  'col-span-6 lg:col-span-5 lg:min-h-[21.5rem]',
  'col-span-12 lg:col-span-12 lg:min-h-[18rem]',
];

const aspect = ['aspect-[4/5]', 'aspect-[4/5]', 'aspect-[4/5]', 'aspect-[16/9] lg:aspect-auto'];

export function CategoryMosaic({ categories }: { categories: CategoryData[] }) {
  const items = categories.slice(0, 4);

  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="shell">
        <SectionHeading
          folio="۰۲"
          eyebrow="کاوش"
          title={<span id="categories-title">چهار راه برای شروع</span>}
          description="هر دسته یک لحن دارد؛ از زنجیر نازک روزمره تا انگشتر سنگین شب. از جایی شروع کن که به تو نزدیک‌تر است."
          action={<QuietLink href="/products">همهٔ محصولات</QuietLink>}
        />

        <div className="mt-8 grid grid-cols-12 gap-3 lg:auto-rows-[21.5rem] lg:gap-5">
          {items.map((category, index) => (
            <Reveal
              key={category.slug}
              delay={index * 70}
              className={cn('relative', layouts[index])}
              as="article"
            >
              <Link
                href={`/products?category=${category.slug}`}
                className={cn(
                  'group relative flex h-full w-full overflow-hidden bg-blush',
                  aspect[index],
                )}
              >
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes={
                    index === 0
                      ? '(max-width: 1024px) 100vw, 58vw'
                      : index === 3
                        ? '100vw'
                        : '(max-width: 1024px) 50vw, 42vw'
                  }
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="scrim-bottom absolute inset-0" aria-hidden="true" />
                <div
                  className="absolute inset-3 border border-paper/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-5 bottom-5 text-paper">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl leading-tight">{category.name}</h3>
                      <p className="mt-1.5 text-xs text-paper/80">{category.tagline}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-[0.68rem] text-paper/80">
                      {formatDigits(category.productCount)} قطعه
                      <ArrowUpLeft
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
