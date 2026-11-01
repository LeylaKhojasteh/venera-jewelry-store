import type { ReactNode } from 'react';
import '@/app/v3.css';
import { getCurrentUser } from '@/lib/auth/session';
import { getCategories } from '@/lib/catalog';
import { emptyCart, getCartForUser } from '@/lib/cart';
import { CartProvider } from '@/components/cart/CartProvider';
import { SiteHeader } from '@/components/v3/SiteHeader';
import { SiteFooter } from '@/components/v3/SiteFooter';
import { ScrollProgress } from '@/components/v3/ScrollProgress';
import { BackToTop } from '@/components/v3/BackToTop';

export default async function V3Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const [categories, cart] = await Promise.all([
    getCategories(),
    user ? getCartForUser(user.id) : Promise.resolve(emptyCart),
  ]);

  return (
    <CartProvider initialCart={user ? cart : null} isAuthenticated={Boolean(user)}>
      <div className="v3-root">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('venera-theme')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}",
          }}
        />
        <ScrollProgress />
        <SiteHeader user={user} categories={categories} />
        <main>{children}</main>
        <SiteFooter categories={categories} />
        <BackToTop />
      </div>
    </CartProvider>
  );
}
