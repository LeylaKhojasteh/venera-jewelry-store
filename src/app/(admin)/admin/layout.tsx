import type { ReactNode } from 'react';
import '@/app/v3.css';
import { requireAdmin } from '@/lib/auth/session';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = {
  title: { default: 'مدیریت ونرا', template: '%s | مدیریت ونرا' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="v3-root">
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(localStorage.getItem('venera-theme')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}",
        }}
      />
      <AdminNav name={user.name} />
      <main className="v3-shell v3-admin-main">{children}</main>
      <footer className="v3-admin-footer">
        <div className="v3-shell">
          محیط مدیریت ونرا — دسترسی فقط برای نقش مدیر. همهٔ تغییرها روی پایگاه‌دادهٔ واقعی اعمال می‌شوند.
        </div>
      </footer>
    </div>
  );
}
