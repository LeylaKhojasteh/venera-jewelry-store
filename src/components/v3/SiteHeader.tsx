'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronDown, Menu, Moon, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/v3/CartDrawer';
import { formatDigits } from '@/lib/money';
import type { CategoryData } from '@/types';
import type { SessionUser } from '@/lib/auth/session';

const nav = [
  { href: '/', label: 'خانه' },
  { href: '/products', label: 'محصولات' },
  { href: '/about', label: 'داستان ونرا' },
  { href: '/contact', label: 'تماس با ما' },
];

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export function SiteHeader({ user, categories }: { user: SessionUser | null; categories: CategoryData[] }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [light, setLight] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);

  const previews = [
    categories[0]?.image ?? '/images/hero/hero.jpg',
    categories[1]?.image ?? categories[0]?.image ?? '/images/hero/hero.jpg',
    '/images/editorial/story-01.jpg',
    categories[2]?.image ?? categories[0]?.image ?? '/images/hero/hero.jpg',
    categories[3]?.image ?? categories[0]?.image ?? '/images/hero/hero.jpg',
  ];
  const preview = previews[hovered ?? 0] ?? previews[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProductsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener('venera:open-cart', openCart);
    return () => window.removeEventListener('venera:open-cart', openCart);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLight(document.documentElement.dataset.theme === 'light');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const openMenu = () => {
    const rect = menuButtonRef.current?.getBoundingClientRect();
    setOrigin({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth - 40,
      y: rect ? rect.top + rect.height / 2 : 32,
    });
    setHovered(0);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const toggleTheme = () => {
    const next = light ? 'dark' : 'light';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('venera-theme', next);
      } catch {
        // storage can be blocked; the theme still applies for this visit
      }
      setLight(!light);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as ViewTransitionDocument;
    if (reduce || typeof doc.startViewTransition !== 'function') {
      apply();
      return;
    }

    const rect = themeButtonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 48;
    const y = rect ? rect.top + rect.height / 2 : 32;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = doc.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 520,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // the theme is already applied; only the reveal failed
      });
  };

  return (
    <>
      <header className="v3-header" data-scrolled={scrolled}>
        <div className="v3-shell">
          <div className="v3-header-inner">
            <Link href="/" className="v3-logo" aria-label="اکسسوری ونرا">
              <span className="v3-logo-mark">VENERA</span> <small>اکسسوری ونرا</small>
            </Link>

            <nav className="v3-nav" aria-label="ناوبری اصلی">
              <Link
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                خانه
              </Link>

              <div
                className="v3-nav-item"
                ref={productsRef}
                onPointerEnter={() => {
                  if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => setProductsOpen(true), 140);
                }}
                onPointerLeave={() => {
                  if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                  setProductsOpen(false);
                }}
              >
                <button
                  type="button"
                  className="v3-nav-trigger"
                  data-active={pathname.startsWith('/products')}
                  aria-expanded={productsOpen}
                  aria-controls="v3-products-menu"
                  onClick={() => {
                    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                    setProductsOpen((value) => !value);
                  }}
                >
                  محصولات
                  <ChevronDown
                    aria-hidden="true"
                    size={15}
                    className={productsOpen ? 'is-open' : undefined}
                  />
                </button>

                {productsOpen ? (
                  <div className="v3-products-menu" id="v3-products-menu">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        onClick={() => setProductsOpen(false)}
                      >
                        <span>{category.name}</span>
                        <small>{formatDigits(category.productCount)} آیتم</small>
                      </Link>
                    ))}
                    <Link href="/products" className="v3-products-all" onClick={() => setProductsOpen(false)}>
                      همه محصولات
                    </Link>
                  </div>
                ) : null}
              </div>

              {nav.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'page'
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="v3-actions">
              <button
                ref={themeButtonRef}
                type="button"
                className="v3-icon"
                onClick={toggleTheme}
                aria-label={light ? 'تغییر به تم تیره' : 'تغییر به تم روشن'}
                aria-pressed={light}
              >
                {light ? <Moon aria-hidden="true" size={19} /> : <Sun aria-hidden="true" size={19} />}
              </button>
              <button
                type="button"
                className="v3-icon"
                style={{ position: 'relative' }}
                onClick={() => setCartOpen(true)}
                aria-label={`سبد خرید، ${formatDigits(count)} قلم`}
              >
                <ShoppingBag aria-hidden="true" size={19} />
                {count > 0 ? <span className="v3-count">{formatDigits(count)}</span> : null}
              </button>
              <Link href={user ? '/profile' : '/login'} className="v3-icon" aria-label={user ? 'حساب من' : 'ورود'}>
                <User aria-hidden="true" size={19} />
              </Link>
              <button
                ref={menuButtonRef}
                type="button"
                className="v3-icon v3-menu-btn"
                onClick={openMenu}
                aria-label="منو"
                aria-expanded={menuOpen}
                aria-controls="v3-menu"
              >
                <Menu aria-hidden="true" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="v3-menu-panel"
          id="v3-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="v3-menu-title"
          ref={panelRef}
          style={{ '--mx': `${origin.x}px`, '--my': `${origin.y}px` } as CSSProperties}
        >
          <div className="v3-menu-head">
            <span id="v3-menu-title" className="v3-logo">
              <span className="v3-logo-mark">VENERA</span> <small>اکسسوری ونرا</small>
            </span>
            <button type="button" className="v3-icon" onClick={closeMenu} aria-label="بستن منو" autoFocus>
              <X aria-hidden="true" size={22} />
            </button>
          </div>

          <div className="v3-menu-body">
            <nav className="v3-menu-links" aria-label="منوی سایت">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  onPointerEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  className={hovered !== null && hovered !== index ? 'is-dim' : undefined}
                  style={{ '--i': index } as CSSProperties}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={user ? '/profile' : '/login'}
                onClick={closeMenu}
                onPointerEnter={() => setHovered(4)}
                onFocus={() => setHovered(4)}
                className={hovered !== null && hovered !== 4 ? 'is-dim' : undefined}
                style={{ '--i': nav.length } as CSSProperties}
              >
                {user ? 'حساب من' : 'ورود'}
              </Link>
            </nav>

            <div className="v3-menu-preview" aria-hidden="true">
              <Image key={preview} src={preview} alt="" fill sizes="(max-width: 1024px) 0px, 34vw" />
            </div>
          </div>

          <div className="v3-menu-cats">
            <details className="v3-menu-accordion">
              <summary>
                دسته‌بندی محصولات
                <ChevronDown aria-hidden="true" size={18} />
              </summary>
              <div className="v3-menu-accordion-body">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/products?category=${category.slug}`} onClick={closeMenu}>
                    <span>{category.name}</span>
                    <small>{formatDigits(category.productCount)}</small>
                  </Link>
                ))}
                <Link href="/products" className="v3-products-all" onClick={closeMenu}>
                  همه محصولات
                </Link>
              </div>
            </details>
          </div>

          <p className="v3-menu-foot">تهران · اکسسوری استیل · ۱۴۰۵</p>
        </div>
      ) : null}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
