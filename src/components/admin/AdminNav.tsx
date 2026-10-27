'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, MessageSquare, Package, ShoppingCart, Store } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'نمای کلی', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { href: '/admin/messages', label: 'پیام‌ها', icon: MessageSquare },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-line-dark bg-plum-ink text-paper">
      <div className="shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex flex-col leading-none">
            <span className="font-latin text-lg tracking-[0.28em]">VENERA</span>
            <span className="mt-1 text-[0.58rem] text-paper/50">مدیریت فروشگاه</span>
          </Link>
          <nav aria-label="ناوبری مدیریت" className="no-scrollbar flex gap-1 overflow-x-auto">
            {links.map((link) => {
              const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-10 items-center gap-2 whitespace-nowrap px-3 text-xs transition-colors',
                    active ? 'bg-paper/10 text-paper' : 'text-paper/60 hover:text-paper',
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-paper/50 sm:inline">{name}</span>
          <Link
            href="/"
            className="flex min-h-10 items-center gap-1.5 border border-line-dark px-3 text-paper/80 transition-colors hover:text-paper"
          >
            <Store aria-hidden="true" className="size-3.5" />
            فروشگاه
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logoutAction();
              router.push('/');
              router.refresh();
            }}
            className="flex min-h-10 items-center gap-1.5 text-paper/60 transition-colors hover:text-paper"
          >
            <LogOut aria-hidden="true" className="size-3.5" />
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
