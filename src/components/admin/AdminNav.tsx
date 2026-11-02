'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, MessageSquare, Package, ShoppingCart, Store, Tags, Users } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { AdminThemeToggle } from '@/components/admin/AdminThemeToggle';

const links = [
  { href: '/admin', label: 'نمای کلی', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌ها', icon: Tags },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { href: '/admin/customers', label: 'مشتریان', icon: Users },
  { href: '/admin/messages', label: 'پیام‌ها', icon: MessageSquare },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="v3-admin-header">
      <div className="v3-shell v3-admin-bar">
        <div className="v3-admin-brand">
          <Link href="/admin" className="v3-logo" aria-label="مدیریت ونرا">
            <span className="v3-logo-mark">VENERA</span> <small>مدیریت</small>
          </Link>
          <span className="v3-admin-user">{name}</span>
        </div>

        <nav className="v3-admin-links" aria-label="ناوبری مدیریت">
          {links.map((link) => {
            const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
                <Icon aria-hidden="true" size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="v3-admin-actions">
          <Link href="/" className="v3-btn v3-btn-line">
            <Store aria-hidden="true" size={14} />
            فروشگاه
          </Link>
          <AdminThemeToggle />
          <button
            type="button"
            className="v3-icon"
            aria-label="خروج از حساب"
            onClick={async () => {
              await logoutAction();
              router.push('/');
              router.refresh();
            }}
          >
            <LogOut aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
