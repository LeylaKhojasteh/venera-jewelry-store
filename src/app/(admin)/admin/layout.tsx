import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth/session';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = {
  title: { default: 'مدیریت ونرا', template: '%s | مدیریت ونرا' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper-deep/40">
      <AdminNav name={user.name} />
      <main className="shell py-8 lg:py-10">{children}</main>
      <footer className="shell border-t border-line py-5 text-[0.65rem] text-ink-soft">
        محیط مدیریت ونرا — دسترسی فقط برای نقش مدیر. همهٔ تغییرها روی پایگاه‌دادهٔ واقعی اعمال می‌شوند.
      </footer>
    </div>
  );
}
