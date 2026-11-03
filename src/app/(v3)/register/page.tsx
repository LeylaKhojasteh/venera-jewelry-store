import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNextPath } from '@/lib/request';
import { AuthShellV4 } from '@/components/v3/AuthShellV4';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'ساخت حساب',
  description: 'یک حساب ونرا بساز تا سفارش‌ها و نشانی‌هایت ذخیره شوند.',
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeNextPath(nextParam) ?? '/';

  const user = await getCurrentUser();
  if (user) redirect(next);

  return (
    <div className="v3-shell v3-auth-page">
      <AuthShellV4
        variant="center"
        title="از اینجا شروع کن."
        intro="با یک حساب ساده، سفارش‌ها و نشانی‌هایت را یک‌جا نگه می‌داری."
        quote={site.tagline}
      >
        <RegisterForm next={next} />
      </AuthShellV4>
    </div>
  );
}
