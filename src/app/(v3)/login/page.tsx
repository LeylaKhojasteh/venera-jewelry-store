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

  const user = await getCurrentUser();
  if (user) redirect(next);

  return (
    <div className="v3-shell v3-section">
      <AuthShellV4
        title="خوش برگشتی."
        intro="برای دیدن سفارش‌ها، نشانی‌ها و ادامهٔ خرید وارد شو. سبد مهمان بعد از ورود به حسابت منتقل می‌شود."
        image="/images/products/necklace-nilo-01.jpg"
        imageAlt="گردنبند نیلو روی زمینهٔ روشن"
        quote={site.tagline}
      >
        <LoginForm next={next} />
      </AuthShellV4>
    </div>
  );
}
