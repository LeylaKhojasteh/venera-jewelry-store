import type { ReactNode } from 'react';
import '@/app/v3.css';
import { getCurrentUser } from '@/lib/auth/session';
import { getCategories } from '@/lib/catalog';
import { emptyCart, getCartForUser } from '@/lib/cart';
import { CartProvider } from '@/components/cart/CartProvider';
import { SiteHeader } from '@/components/v3/SiteHeader';
import { SiteFooter } from '@/components/v3/SiteFooter';

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
        <link
          rel="preload"
          href="/fonts/v3/estedad-arabic-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/v3/estedad-latin-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <SiteHeader user={user} />
        <main>{children}</main>
        <SiteFooter categories={categories} />
      </div>
    </CartProvider>
  );
}
