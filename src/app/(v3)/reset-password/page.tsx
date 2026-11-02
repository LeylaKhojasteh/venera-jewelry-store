import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShellV4 } from '@/components/v3/AuthShellV4';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'تعیین گذرواژهٔ تازه',
  description: 'گذرواژهٔ تازه برای حساب ونرا تعیین کن.',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return (
    <div className="v3-shell v3-section">
      <AuthShellV4
        title="گذرواژهٔ تازه."
        intro="یک گذرواژهٔ تازه و امن انتخاب کن. پیوند بازیابی فقط یک بار و تا ۳۰ دقیقه معتبر است."
        image="/images/products/necklace-mah-tab-01.jpg"
        imageAlt="گردنبند مهتاب روی زمینهٔ روشن"
        quote={site.tagline}
      >
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="mt-8 space-y-4">
            <p className="border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
              این پیوند بازیابی کامل نیست. یک پیوند تازه درخواست کن.
            </p>
            <Link href="/forgot-password" className="btn btn-primary btn-block">
              درخواست پیوند تازه
            </Link>
          </div>
        )}
      </AuthShellV4>
    </div>
  );
}
