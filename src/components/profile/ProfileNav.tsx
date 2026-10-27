'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MapPin, Package, LogOut, ShieldCheck } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/profile', label: 'نمای کلی', icon: LayoutDashboard },
  { href: '/profile/orders', label: 'سفارش‌ها', icon: Package },
  { href: '/profile/addresses', label: 'نشانی‌ها', icon: MapPin },
];

export function ProfileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav aria-label="منوی حساب" className="lg:sticky lg:top-28">
      <div className="hidden border border-line bg-paper-soft p-2 lg:block">
        <ul className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/profile' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center gap-3 px-3 text-sm transition-colors',
                    active ? 'bg-plum text-paper' : 'text-plum-ink hover:bg-blush/40',
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
          {role === 'ADMIN' ? (
            <li>
              <Link
                href="/admin"
                className="flex min-h-11 items-center gap-3 px-3 text-sm text-plum-ink transition-colors hover:bg-blush/40"
              >
                <ShieldCheck aria-hidden="true" className="size-4" />
                مدیریت فروشگاه
              </Link>
            </li>
          ) : null}
        </ul>
        <div className="mt-2 border-t border-line p-2">
          <button
            type="button"
            onClick={async () => {
              await logoutAction();
              router.push('/');
              router.refresh();
            }}
            className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-ink-soft transition-colors hover:text-error"
          >
            <LogOut aria-hidden="true" className="size-4" />
            خروج از حساب
          </button>
        </div>
      </div>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/profile' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 shrink-0 items-center border px-4 text-sm',
                active ? 'border-plum bg-plum text-paper' : 'border-line bg-paper-soft text-plum-ink',
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={async () => {
            await logoutAction();
            router.push('/');
            router.refresh();
          }}
          className="flex min-h-11 shrink-0 items-center border border-line px-4 text-sm text-ink-soft"
        >
          خروج
        </button>
      </div>
    </nav>
  );
}
