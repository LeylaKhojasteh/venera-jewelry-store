import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNextPath } from '@/lib/request';
import { AuthShell } from '@/components/auth/AuthShell';
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
    <AuthShell
      folio="۰۹"
      eyebrow="ورود"
      title="خوش برگشتی."
      intro="برای دیدن سفارش‌ها، نشانی‌ها و ادامهٔ خرید وارد شو. اگر مهمان چیزی به سبد اضافه کرده باشی، بعد از ورود به حسابت منتقل می‌شود."
      image="/images/editorial/women-panel.jpg"
      imageAlt="گردنبند ظریف ونرا روی زمینهٔ تیره"
      quote={site.tagline}
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
