import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNextPath } from '@/lib/request';
import { AuthShell } from '@/components/auth/AuthShell';
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
    <AuthShell
      folio="۱۰"
      eyebrow="ثبت‌نام"
      title="از اینجا شروع کن."
      intro="با یک حساب ساده، سفارش‌ها و نشانی‌هایت را یک‌جا نگه می‌داری."
      image="/images/editorial/men-panel.jpg"
      imageAlt="دستبند مردانهٔ ونرا روی زمینهٔ تیره"
      quote={site.tagline}
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
