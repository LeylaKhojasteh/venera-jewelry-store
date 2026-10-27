import type { ReactNode } from 'react';
import { requireUser } from '@/lib/auth/session';
import { ProfileNav } from '@/components/profile/ProfileNav';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  const user = await requireUser('/profile');

  return (
    <div className="shell section-tight">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-3">
          <div className="mb-6">
            <p className="font-display text-2xl text-plum-ink">{user.name}</p>
            <p className="mt-1 truncate text-xs text-ink-soft" dir="ltr">
              {user.email}
            </p>
          </div>
          <ProfileNav role={user.role} />
        </aside>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
