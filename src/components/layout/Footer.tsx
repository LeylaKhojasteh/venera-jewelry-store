import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { demoContact, site } from '@/lib/constants';
import { formatJalaliNumeric } from '@/lib/dates';
import type { CategoryData } from '@/types';

export function Footer({ categories, isAdmin = false }: { categories: CategoryData[]; isAdmin?: boolean }) {
  const year = formatJalaliNumeric(new Date()).split('/')[0];

  return (
    <footer className="bg-plum-deep text-paper">
      <div className="shell section-tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex flex-col leading-none" aria-label="ونرا، صفحهٔ اصلی">
              <span className="font-latin text-2xl tracking-[0.32em]">{site.logotype}</span>
              <span className="mt-2 text-[0.65rem] text-paper/60">ونرا | زیورآلات معاصر</span>
            </Link>
            <p className="mt-7 max-w-md font-display text-2xl leading-relaxed text-paper/90">
              «{site.tagline}»
            </p>
            <p className="mt-5 max-w-sm text-sm leading-8 text-paper/60">
              ونرا کالکشن محدودی از زیورآلات است؛ هر قطعه با مواد مشخص، اندازهٔ دقیق و طراحی ساده. برای
              دیدن روند ساخت و انتخاب مواد، صفحهٔ دربارهٔ ما را بخوان.
            </p>
            <Link href="/about" className="link-quiet mt-7 inline-flex text-sm text-gold-soft">
              داستان ونرا
              <ArrowUpLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow text-paper/50">دسته‌بندی‌ها</p>
              <ul className="mt-5 space-y-3 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-paper/80 transition-colors hover:text-gold-soft"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-paper/50">فروشگاه</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link href="/products" className="text-paper/80 transition-colors hover:text-gold-soft">
                    همهٔ محصولات
                  </Link>
                </li>
                <li>
                  <Link href="/products?gender=women" className="text-paper/80 transition-colors hover:text-gold-soft">
                    زنانه
                  </Link>
                </li>
                <li>
                  <Link href="/products?gender=men" className="text-paper/80 transition-colors hover:text-gold-soft">
                    مردانه
                  </Link>
                </li>
                <li>
                  <Link href="/products?discount=1" className="text-paper/80 transition-colors hover:text-gold-soft">
                    تخفیف‌دارها
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-paper/80 transition-colors hover:text-gold-soft">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="eyebrow text-paper/50">حساب</p>
              <ul className="mt-5 space-y-3 text-sm">
                {isAdmin ? (
                  <li>
                    <Link href="/admin" className="text-paper/80 transition-colors hover:text-gold-soft">
                      مدیریت فروشگاه
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link href="/profile" className="text-paper/80 transition-colors hover:text-gold-soft">
                    پنل کاربری
                  </Link>
                </li>
                <li>
                  <Link href="/profile/orders" className="text-paper/80 transition-colors hover:text-gold-soft">
                    سفارش‌های من
                  </Link>
                </li>
                <li>
                  <Link href="/profile/addresses" className="text-paper/80 transition-colors hover:text-gold-soft">
                    نشانی‌ها
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-paper/80 transition-colors hover:text-gold-soft">
                    ورود / ثبت‌نام
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-line-dark pt-8 md:grid-cols-3">
          <div>
            <p className="eyebrow text-paper/50">تماس</p>
            <p className="mt-4 text-sm text-paper/80" dir="ltr">
              {demoContact.email}
            </p>
            <p className="mt-1 text-sm text-paper/80" dir="ltr">
              {demoContact.phone}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow text-paper/50">کارگاه</p>
            <p className="mt-4 text-sm leading-7 text-paper/75">{demoContact.address}</p>
          </div>
        </div>
      </div>

      <div className="shell flex justify-center border-t border-line-dark py-6 text-[0.7rem] text-paper/45">
        <p>© {year} ونرا — تمام حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}
