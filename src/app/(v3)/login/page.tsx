import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNextPath } from '@/lib/request';
import { AuthShellV4 } from '@/components/v3/AuthShellV4';
import { LoginForm } from '@/components/auth/LoginForm';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'ورود به حساب',
  description: 'به حساب ونرا وارد شو تا سبد خرید، نشانی‌ها و سفارش‌هایت در دسترس باشند.',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeNextPath(nextParam) ?? '/';
  const resetDone = (Array.isArray(params.reset) ? params.reset[0] : params.reset) === '1';

  const user = await getCurrentUser();
  if (user) redirect(next);

  return (
    <div className="v3-shell v3-auth-page">
      <AuthShellV4
        variant="center"
        title="خوش برگشتی."
        intro="برای دیدن سفارش‌ها، نشانی‌ها و ادامهٔ خرید وارد شو. سبد مهمان بعد از ورود به حسابت منتقل می‌شود."
        quote={site.tagline}
      >
        {resetDone ? (
          <p className="mb-4 border-s-2 border-success bg-success/5 px-4 py-3 text-sm text-success">
            گذرواژه‌ات تغییر کرد. حالا با گذرواژهٔ تازه وارد شو.
          </p>
        ) : null}
        <LoginForm next={next} />
      </AuthShellV4>
    </div>
  );
}
