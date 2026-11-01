'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, ShoppingBag, User } from 'lucide-react';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useCart } from '@/components/cart/CartProvider';
import { genderNav, mainNav, site } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CategoryData } from '@/types';
import type { SessionUser } from '@/lib/auth/session';

export function HeaderClient({ categories, user }: { categories: CategoryData[]; user: SessionUser | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hiddenHeader, setHiddenHeader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);

  const overlayOpen = dropdownOpen || menuOpen || searchOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (overlayOpen || y < 120) {
        setHiddenHeader(false);
      } else if (y > lastScroll.current + 6) {
        setHiddenHeader(true);
      } else if (y < lastScroll.current - 6) {
        setHiddenHeader(false);
      }
      lastScroll.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlayOpen]);

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

  const navLink = (href: string, label: string) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={cn(
          'group relative flex items-center py-2 text-sm transition-colors hover:text-plum',
          active ? 'text-plum' : 'text-plum-ink',
        )}
      >
        {label}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 -bottom-0.5 h-px origin-right bg-gold transition-transform duration-300 ease-out',
            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
          )}
        />
      </Link>
    );
  };

  return (
    <>
      <div className="bg-plum-deep text-paper">
        <div className="shell flex h-9 items-center justify-center gap-4 text-[0.68rem] tracking-wide">
          <span className="hidden h-px w-10 bg-paper/20 sm:block" aria-hidden="true" />
          <p>{site.tagline}</p>
          <span className="hidden h-px w-10 bg-paper/20 sm:block" aria-hidden="true" />
        </div>
      </div>

      <header
        data-scrolled={scrolled}
        className={cn(
          'sticky top-0 z-50 border-b transition-[transform,background-color,box-shadow] duration-300 ease-out',
          hiddenHeader && '-translate-y-full',
          scrolled
            ? 'border-line bg-paper/90 shadow-[0_18px_40px_-38px_rgba(42,17,24,0.65)] backdrop-blur-md'
            : 'border-transparent bg-paper',
        )}
      >
        <div className="shell">
          <div
            className={cn(
              'flex items-center justify-between gap-4 transition-[height] duration-300 ease-out',
              scrolled ? 'h-16' : 'h-20',
            )}
          >
            <div className="flex items-center gap-8 xl:gap-12">
              <Link
                href="/"
                className="group flex min-h-11 flex-col justify-center leading-none"
                aria-label="ونرا، صفحهٔ اصلی"
              >
                <span className="font-latin text-[1.4rem] tracking-[0.32em] text-plum-ink transition-[letter-spacing,color] duration-500 group-hover:tracking-[0.4em] group-hover:text-plum sm:text-[1.55rem]">
                  {site.logotype}
                </span>
                <span className="mt-1.5 text-[0.62rem] text-ink-soft">ونرا | زیورآلات معاصر</span>
              </Link>

              <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 lg:flex">
                {navLink('/', 'خانه')}

                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="category-menu"
                    onClick={() => setDropdownOpen((value) => !value)}
                    className={cn(
                      'group relative flex items-center gap-1.5 py-2 text-sm transition-colors hover:text-plum',
                      pathname.startsWith('/products') ? 'text-plum' : 'text-plum-ink',
                    )}
                  >
                    محصولات
                    <ChevronDown
                      aria-hidden="true"
                      className={cn('size-3.5 transition-transform duration-300', dropdownOpen && 'rotate-180')}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-0.5 h-px origin-right bg-gold transition-transform duration-300 ease-out',
                        pathname.startsWith('/products') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </button>

                  <div
                    id="category-menu"
                    hidden={!dropdownOpen}
                    onClick={() => setDropdownOpen(false)}
                    className="animate-dropdown absolute start-1/2 top-full z-50 w-[min(92vw,42rem)] -translate-x-1/2 border border-line bg-paper p-6 shadow-card"
                  >
                    {categories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-x-6">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="group flex items-center gap-3 border-b border-line py-2.5"
                          >
                            <span className="relative h-14 w-12 shrink-0 overflow-hidden bg-blush">
                              <Image
                                src={category.image}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </span>
                            <span className="flex min-w-0 flex-col">
                              <span className="text-sm text-plum-ink transition-colors group-hover:text-plum">
                                {category.name}
                              </span>
                              <span className="mt-0.5 font-latin text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft">
                                {category.latinName}
                              </span>
                            </span>
                            <span className="tabular ms-auto text-[0.65rem] text-gold">
                              {formatDigits(category.productCount)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft">
                      <Link href="/products" className="font-medium text-plum-ink transition-colors hover:text-plum">
                        همه محصولات
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
                  <span key={item.href}>{navLink(item.href, item.label)}</span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="icon-btn transition-transform duration-200 hover:scale-105"
                aria-label="جست‌وجوی محصولات"
              >
                <Search aria-hidden="true" className="size-[1.15rem]" />
              </button>

              <Link
                href={user ? '/profile' : '/login'}
                className="icon-btn hidden min-[360px]:inline-flex"
                aria-label={user ? 'حساب من' : 'ورود به حساب'}
              >
                {user ? (
                  <span className="flex size-7 items-center justify-center rounded-full border border-plum/20 bg-blush/70 text-[0.7rem] text-plum-ink">
                    {user.name.trim().charAt(0)}
                  </span>
                ) : (
                  <User aria-hidden="true" className="size-[1.15rem]" />
                )}
              </Link>

              <Link href="/cart" className="icon-btn relative" aria-label={`سبد خرید (${formatDigits(count)} قلم)`}>
                <ShoppingBag aria-hidden="true" className="size-[1.15rem]" />
                {count > 0 ? (
                  <span
                    key={count}
                    className="animate-badge-pop tabular absolute -top-0.5 -end-0.5 flex min-w-[1.15rem] items-center justify-center rounded-full bg-plum px-1 text-[0.6rem] leading-[1.15rem] text-paper"
                  >
                    {formatDigits(count)}
                  </span>
                ) : null}
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="icon-btn group lg:hidden"
                aria-label="باز کردن منو"
              >
                <span className="flex flex-col gap-1" aria-hidden="true">
                  <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="h-px w-5 bg-current" />
                  <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:translate-y-0.5" />
                </span>
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
