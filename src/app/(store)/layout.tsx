import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { getCategories } from '@/lib/catalog';
import { getCartForUser, emptyCart } from '@/lib/cart';
import { CartProvider } from '@/components/cart/CartProvider';
import { HeaderClient } from '@/components/layout/HeaderClient';
import { Footer } from '@/components/layout/Footer';

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const [categories, cart] = await Promise.all([
    getCategories(),
    user ? getCartForUser(user.id) : Promise.resolve(emptyCart),
  ]);

  return (
    <CartProvider initialCart={user ? cart : null} isAuthenticated={Boolean(user)}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:bg-plum focus:px-4 focus:py-2 focus:text-paper"
      >
        پرش به محتوای اصلی
      </a>
      <HeaderClient categories={categories} user={user} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer categories={categories} isAdmin={user?.role === 'ADMIN'} />
    </CartProvider>
  );
}
