import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { formatToman } from '@/lib/money';

type HeroFeature = {
  slug: string;
  name: string;
  price: number;
};

export function Hero({ feature }: { feature?: HeroFeature }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 lg:grid-cols-12">
        <div className="relative z-10 order-2 mx-3 -mt-20 flex flex-col justify-center bg-paper px-5 pb-14 pt-8 sm:mx-0 sm:px-[clamp(1.25rem,4vw,4.5rem)] lg:order-1 lg:col-span-6 lg:mt-0 lg:bg-transparent lg:px-[clamp(1.25rem,4vw,4.5rem)] lg:py-16 xl:col-span-6">
          <h1 className="display text-4xl">
            <span className="block">زیبایی،</span>
            <span className="block">
              در{' '}
              <span className="relative inline-block text-plum">
                جزئیات
                <span className="absolute inset-x-0 -bottom-1 h-px bg-gold" aria-hidden="true" />
              </span>{' '}
              زندگی
            </span>
            <span className="block">می‌کند.</span>
          </h1>

          <p className="lead mt-7 max-w-md text-base">
            از درخشش یک گردنبند ظریف تا جسارت یک انگشتر خاص؛ ونرا کنار توست تا سبک خودت را روایت کنی.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/products" className="min-w-[10.5rem]">
              مشاهده کالکشن
            </ButtonLink>
            <Link href="/about" className="link-quiet text-sm text-plum-ink">
              داستان ونرا
              <ArrowUpLeft aria-hidden="true" className="size-4 text-gold" />
            </Link>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full overflow-hidden bg-blush lg:h-[min(40rem,calc(100dvh-9rem))] lg:w-auto lg:max-w-full">
            <Image
              id="hero-image"
              src="/images/hero/hero.jpg"
              alt="گردنبند نیلو؛ گل‌های ریز روی زنجیر استیل"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="hero-image-in object-cover"
            />

            <div className="pointer-events-none absolute inset-4 hidden border border-paper/40 lg:block" aria-hidden="true" />

            {feature ? (
              <div className="absolute bottom-4 start-4 end-4 hidden lg:block">
                <Link
                  href={`/products/${feature.slug}`}
                  className="group inline-flex max-w-full items-center gap-4 border border-paper/50 bg-paper/95 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-paper"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="mt-0.5 truncate text-sm text-plum-ink">{feature.name}</span>
                  </span>
                  <span className="h-8 w-px shrink-0 bg-line" aria-hidden="true" />
                  <span className="tabular shrink-0 text-xs text-ink-soft">{formatToman(feature.price)}</span>
                  <ArrowUpLeft
                    aria-hidden="true"
                    className="size-4 shrink-0 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
