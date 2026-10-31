'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, MapPin, Package, ShieldCheck } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

const links = [
  { href: '/profile', label: 'نمای کلی', icon: LayoutDashboard },
  { href: '/profile/orders', label: 'سفارش‌ها', icon: Package },
  { href: '/profile/addresses', label: 'نشانی‌ها', icon: MapPin },
];

export function ProfileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="v3-account-nav" aria-label="منوی حساب">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== '/profile' && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
            <Icon aria-hidden="true" size={16} />
            {link.label}
          </Link>
        );
      })}
      {role === 'ADMIN' ? (
        <Link href="/admin">
          <ShieldCheck aria-hidden="true" size={16} />
          مدیریت فروشگاه
        </Link>
      ) : null}
      <button
        type="button"
        className="v3-account-logout"
        onClick={async () => {
          await logoutAction();
          router.push('/');
          router.refresh();
        }}
      >
        <LogOut aria-hidden="true" size={16} />
        خروج از حساب
      </button>
    </nav>
  );
}
