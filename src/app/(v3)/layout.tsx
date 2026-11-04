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
import { Preloader } from '@/components/v3/Preloader';

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
        <div className="v3-site">
          <SiteHeader user={user} categories={categories} />
          <main>{children}</main>
          <SiteFooter categories={categories} />
          <BackToTop />
        </div>
        <Preloader />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.setTimeout(function(){var e=document.querySelector('.v3-preloader');if(!e)return;e.style.transition='transform 850ms cubic-bezier(0.22,1,0.36,1)';e.style.transform='translateY(-100%)';e.style.pointerEvents='none';},3000)",
          }}
        />
      </div>
    </CartProvider>
  );
}
