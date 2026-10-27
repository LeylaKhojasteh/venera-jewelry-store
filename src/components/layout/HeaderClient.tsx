'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useCart } from '@/components/cart/CartProvider';
import { categoryNav, genderNav, mainNav, site } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';
import type { SessionUser } from '@/lib/auth/session';

export function HeaderClient({ categories, user }: { categories: CategoryData[]; user: SessionUser | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <div className="bg-plum-deep text-paper">
        <div className="shell flex h-9 items-center justify-center text-[0.68rem] tracking-wide">
          <p>{site.tagline}</p>
        </div>
      </div>

      <header
        data-scrolled={scrolled}
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-paper/95 shadow-[0_10px_30px_-28px_rgba(42,17,24,0.45)] backdrop-blur-md'
            : 'border-transparent bg-paper',
        )}
      >
        <div className="shell">
          <div className={cn('flex items-center justify-between gap-4 transition-all duration-300', scrolled ? 'h-16' : 'h-20')}>
            <div className="flex items-center gap-8 xl:gap-12">
              <Link href="/" className="group flex min-h-11 flex-col justify-center leading-none" aria-label="ونرا، صفحهٔ اصلی">
                <span className="font-latin text-[1.4rem] tracking-[0.32em] text-plum-ink transition-colors group-hover:text-plum sm:text-[1.55rem]">
                  {site.logotype}
                </span>
                <span className="mt-1.5 text-[0.62rem] text-ink-soft">ونرا | زیورآلات معاصر</span>
              </Link>

              <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 lg:flex">
                <Link
                  href="/"
                  className={cn(
                    'relative py-2 text-sm transition-colors hover:text-plum',
                    isActive('/') ? 'text-plum' : 'text-plum-ink',
                  )}
                >
                  خانه
                  {isActive('/') ? <span className="absolute inset-x-0 -bottom-px h-px bg-gold" /> : null}
                </Link>

                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="category-menu"
                    onClick={() => setDropdownOpen((value) => !value)}
                    className={cn(
                      'flex items-center gap-1.5 py-2 text-sm transition-colors hover:text-plum',
                      pathname.startsWith('/products') ? 'text-plum' : 'text-plum-ink',
                    )}
                  >
                    محصولات
                    <ChevronDown
                      aria-hidden="true"
                      className={cn('size-3.5 transition-transform duration-200', dropdownOpen && 'rotate-180')}
                    />
                  </button>

                  <div
                    id="category-menu"
                    hidden={!dropdownOpen}
                    onClick={() => setDropdownOpen(false)}
                    className="absolute start-1/2 top-full z-50 w-[34rem] -translate-x-1/2 border border-line bg-paper p-6 shadow-card"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                      {(categories.length ? categories : categoryNav.map((c) => ({ ...c, productCount: 0 }))).map(
                        (category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="group flex items-baseline justify-between gap-3 border-b border-line py-3"
                          >
                            <span className="flex flex-col">
                              <span className="text-sm text-plum-ink transition-colors group-hover:text-plum">
                                {category.name}
                              </span>
                              <span className="font-latin text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft">
                                {'latinName' in category ? category.latinName : ''}
                              </span>
                            </span>
                            <span className="text-[0.65rem] text-gold">
                              {'productCount' in category ? formatDigits(category.productCount) : ''}
                            </span>
                          </Link>
                        ),
                      )}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft">
                      <Link href="/products" className="transition-colors hover:text-plum">
                        همهٔ محصولات
                      </Link>
                      {genderNav.map((gender) => (
                        <Link
                          key={gender.slug}
                          href={`/products?gender=${gender.slug}`}
                          className="transition-colors hover:text-plum"
                        >
                          {gender.name}
                        </Link>
                      ))}
                      <Link href="/products?discount=1" className="transition-colors hover:text-plum">
                        تخفیف‌دارها
                      </Link>
                    </div>
                  </div>
                </div>

                {mainNav.slice(2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative py-2 text-sm transition-colors hover:text-plum',
                      isActive(item.href) ? 'text-plum' : 'text-plum-ink',
                    )}
                  >
                    {item.label}
                    {isActive(item.href) ? <span className="absolute inset-x-0 -bottom-px h-px bg-gold" /> : null}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="icon-btn"
                aria-label="جست‌وجوی محصولات"
              >
                <Search aria-hidden="true" className="size-[1.15rem]" />
              </button>

              <Link
                href={user ? '/profile' : '/login'}
                className="icon-btn hidden min-[360px]:inline-flex"
                aria-label={user ? 'حساب من' : 'ورود به حساب'}
              >
                <User aria-hidden="true" className="size-[1.15rem]" />
              </Link>

              <Link href="/cart" className="icon-btn relative" aria-label={`سبد خرید (${formatDigits(count)} قلم)`}>
                <ShoppingBag aria-hidden="true" className="size-[1.15rem]" />
                {count > 0 ? (
                  <span className="tabular absolute -top-0.5 -end-0.5 flex min-w-[1.15rem] items-center justify-center rounded-full bg-plum px-1 text-[0.6rem] leading-[1.15rem] text-paper">
                    {formatDigits(count)}
                  </span>
                ) : null}
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="icon-btn lg:hidden"
                aria-label="باز کردن منو"
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} categories={categories} user={user} />
    </>
  );
}
