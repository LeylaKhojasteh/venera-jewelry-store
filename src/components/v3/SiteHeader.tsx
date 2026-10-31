'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Moon, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { formatDigits } from '@/lib/money';
import type { SessionUser } from '@/lib/auth/session';

const nav = [
  { href: '/', label: 'خانه' },
  { href: '/products', label: 'محصولات' },
  { href: '/about', label: 'داستان' },
  { href: '/contact', label: 'تماس' },
];

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLight(document.documentElement.dataset.theme === 'light');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('venera-theme', next);
    } catch {
      // storage can be blocked; the theme still applies for this visit
    }
    setLight(!light);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="v3-header" data-scrolled={scrolled}>
      <div className="v3-shell">
        <div className="v3-header-inner">
          <Link href="/" className="v3-logo" aria-label="ونرا، صفحهٔ اصلی">
            <span className="v3-logo-mark">VENERA</span> <small>ونرا</small>
          </Link>

          <nav className="v3-nav" aria-label="ناوبری اصلی">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="v3-actions">
            <button
              type="button"
              className="v3-icon"
              onClick={toggleTheme}
              aria-label={light ? 'تغییر به تم تیره' : 'تغییر به تم روشن'}
              aria-pressed={light}
            >
              {light ? <Moon aria-hidden="true" size={19} /> : <Sun aria-hidden="true" size={19} />}
            </button>
            <Link href="/cart" className="v3-icon" style={{ position: 'relative' }} aria-label={`سبد خرید، ${formatDigits(count)} قلم`}>
              <ShoppingBag aria-hidden="true" size={19} />
              {count > 0 ? <span className="v3-count">{formatDigits(count)}</span> : null}
            </Link>
            <Link href={user ? '/profile' : '/login'} className="v3-icon" aria-label={user ? 'حساب من' : 'ورود'}>
              <User aria-hidden="true" size={19} />
            </Link>
            <button
              type="button"
              className="v3-icon v3-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="منو"
              aria-expanded={menuOpen}
              aria-controls="v3-menu"
            >
              <Menu aria-hidden="true" size={20} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="v3-menu-panel" id="v3-menu" role="dialog" aria-modal="true" aria-label="منوی سایت">
          <div className="v3-menu-head">
            <span className="v3-logo">
              <span className="v3-logo-mark">VENERA</span> <small>ونرا</small>
            </span>
            <button
              type="button"
              className="v3-icon"
              onClick={() => setMenuOpen(false)}
              aria-label="بستن منو"
              autoFocus
            >
              <X aria-hidden="true" size={22} />
            </button>
          </div>
          <div className="v3-menu-links">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}>
              {user ? 'حساب من' : 'ورود'}
            </Link>
          </div>
          <p className="v3-menu-foot">تهران · زیورآلات استیل · ۱۴۰۵</p>
        </div>
      ) : null}
    </header>
  );
}
