import Link from 'next/link';
import { ArrowUp, ArrowUpLeft, Mail, MapPin, Phone } from 'lucide-react';
import { demoContact, site } from '@/lib/constants';
import { formatJalaliNumeric } from '@/lib/dates';
import type { CategoryData } from '@/types';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-paper/70 transition-colors duration-200 hover:text-gold-soft"
    >
      <span className="h-px w-0 bg-gold-soft transition-all duration-300 group-hover:w-3" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function Footer({ categories, isAdmin = false }: { categories: CategoryData[]; isAdmin?: boolean }) {
  const year = formatJalaliNumeric(new Date()).split('/')[0];

  return (
    <footer className="bg-plum-deep text-paper">
      <div className="shell pb-10 pt-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex flex-col leading-none" aria-label="ونرا، صفحهٔ اصلی">
              <span className="font-latin text-2xl tracking-[0.32em]">{site.logotype}</span>
              <span className="mt-2 text-[0.65rem] text-paper/60">ونرا | زیورآلات معاصر</span>
            </Link>
            <p className="mt-6 max-w-md font-display text-2xl leading-relaxed text-paper/90">
              «{site.tagline}»
            </p>
            <p className="mt-4 max-w-sm text-sm leading-8 text-paper/60">
              کالکشن محدودی از زیورآلات؛ هر آیتم با مواد مشخص، اندازهٔ دقیق و طراحی ساده.
            </p>
            <Link href="/about" className="link-quiet mt-6 inline-flex text-sm text-gold-soft">
              داستان ونرا
              <ArrowUpLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <nav aria-label="پیوندهای پاورقی" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-[0.68rem] tracking-wide text-paper/40">دسته‌بندی‌ها</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <FooterLink href={`/products?category=${category.slug}`}>{category.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[0.68rem] tracking-wide text-paper/40">فروشگاه</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <FooterLink href="/products">همه محصولات</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products?gender=women">زنانه</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products?gender=men">مردانه</FooterLink>
                </li>
                <li>
                  <FooterLink href="/products?discount=1">تخفیف‌دارها</FooterLink>
                </li>
                <li>
                  <FooterLink href="/contact">تماس با ما</FooterLink>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[0.68rem] tracking-wide text-paper/40">حساب</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {isAdmin ? (
                  <li>
                    <FooterLink href="/admin">مدیریت فروشگاه</FooterLink>
                  </li>
                ) : null}
                <li>
                  <FooterLink href="/profile">پنل کاربری</FooterLink>
                </li>
                <li>
                  <FooterLink href="/profile/orders">سفارش‌های من</FooterLink>
                </li>
                <li>
                  <FooterLink href="/profile/addresses">نشانی‌ها</FooterLink>
                </li>
                <li>
                  <FooterLink href="/login">ورود / ثبت‌نام</FooterLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 grid gap-5 border-t border-line-dark pt-7 text-sm sm:grid-cols-3">
          <a
            href={`mailto:${demoContact.email}`}
            className="group flex items-center gap-2.5 text-paper/70 transition-colors hover:text-paper"
          >
            <Mail aria-hidden="true" className="size-4 text-gold" />
            <span dir="ltr">{demoContact.email}</span>
          </a>
          <a
            href={`tel:${demoContact.phoneRaw}`}
            className="group flex items-center gap-2.5 text-paper/70 transition-colors hover:text-paper"
          >
            <Phone aria-hidden="true" className="size-4 text-gold" />
            <span dir="ltr">{demoContact.phone}</span>
          </a>
          <p className="flex items-start gap-2.5 text-paper/70">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>{demoContact.address}</span>
          </p>
        </div>
      </div>

      <div className="shell flex flex-col-reverse items-center justify-between gap-4 border-t border-line-dark py-5 text-[0.7rem] text-paper/40 sm:flex-row">
        <p>© {year} ونرا — تمام حقوق محفوظ است.</p>
        <a
          href="#top"
          className="group inline-flex items-center gap-2 text-paper/50 transition-colors hover:text-gold-soft"
        >
          بازگشت به بالا
          <ArrowUp
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
