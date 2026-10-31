import type { ReactNode } from 'react';
import { requireUser } from '@/lib/auth/session';
import { ProfileNav } from '@/components/v3/ProfileNav';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  const user = await requireUser('/profile');

  return (
    <div className="v3-shell v3-section">
      <div className="v3-profile">
        <aside className="v3-profile-side">
          <p className="v3-small">حساب من</p>
          <p className="v3-profile-name">{user.name}</p>
          <p className="v3-profile-email" dir="ltr">
            {user.email}
          </p>
          <ProfileNav role={user.role} />
        </aside>
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
