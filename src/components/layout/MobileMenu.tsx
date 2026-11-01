'use client';

import Link from 'next/link';
import { X, ArrowUpLeft } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { mainNav, genderNav, demoContact, site } from '@/lib/constants';
import { formatDigits } from '@/lib/money';
import type { CategoryData } from '@/types';
import type { SessionUser } from '@/lib/auth/session';

export function MobileMenu({
  open,
  onClose,
  categories,
  user,
}: {
  open: boolean;
  onClose: () => void;
  categories: CategoryData[];
  user: SessionUser | null;
}) {
  return (
    <Dialog open={open} onClose={onClose} side="end" labelledBy="mobile-menu-title" className="border-s border-line bg-paper">
      <div className="animate-drawer flex h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <span id="mobile-menu-title" className="font-latin text-xl tracking-[0.32em] text-plum-ink">
            {site.logotype}
          </span>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="بستن منو">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {mainNav.map((item, index) => (
              <li key={item.href} className="animate-menu-link" style={{ animationDelay: `${index * 45}ms` }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between border-b border-line py-4 text-2xl text-plum-ink transition-colors hover:text-plum"
                >
                  <span className="display">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="eyebrow">دسته‌بندی‌ها</p>
            <ul className="mt-4 space-y-1">
              {categories.map((category, index) => (
                <li
                  key={category.slug}
                  className="animate-menu-link"
                  style={{ animationDelay: `${220 + index * 45}ms` }}
                >
                  <Link
                    href={`/products?category=${category.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between border-b border-line py-3.5 text-base text-plum-ink"
                  >
                    <span className="flex items-baseline gap-3">
                      <span>{category.name}</span>
                      <span className="font-latin text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
                        {category.latinName}
                      </span>
                    </span>
                    <span className="text-xs text-ink-soft">{formatDigits(category.productCount)} آیتم</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {genderNav.map((gender) => (
              <Link
                key={gender.slug}
                href={`/products?gender=${gender.slug}`}
                onClick={onClose}
                className="flex items-center justify-between border border-line px-4 py-4 text-sm text-plum-ink"
              >
                <span>{gender.name}</span>
                <ArrowUpLeft aria-hidden="true" className="size-4 text-gold" />
              </Link>
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <p className="eyebrow">حساب من</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {user ? (
                <>
                  <Link href="/profile" onClick={onClose} className="text-plum-ink">
                    پنل {user.name}
                  </Link>
                  <Link href="/profile/orders" onClick={onClose} className="text-ink-soft">
                    سفارش‌های من
                  </Link>
                  <Link href="/profile/addresses" onClick={onClose} className="text-ink-soft">
                    نشانی‌ها
                  </Link>
                  {user.role === 'ADMIN' ? (
                    <Link href="/admin" onClick={onClose} className="text-ink-soft">
                      مدیریت فروشگاه
                    </Link>
                  ) : null}
                </>
              ) : (
                <>
                  <Link href="/login" onClick={onClose} className="btn btn-primary btn-sm">
                    ورود به حساب
                  </Link>
                  <Link href="/register" onClick={onClose} className="btn btn-outline btn-sm">
                    ساخت حساب تازه
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="border-t border-line px-6 py-5 text-xs leading-6 text-ink-soft">
          <p className="text-start" dir="ltr">
            {demoContact.email}
          </p>
        </div>
      </div>
    </Dialog>
  );
}
