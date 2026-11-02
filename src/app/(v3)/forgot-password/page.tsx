import type { Metadata } from 'next';
import { AuthShellV4 } from '@/components/v3/AuthShellV4';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'بازیابی گذرواژه',
  description: 'پیوند بازیابی گذرواژهٔ حساب ونرا را دریافت کن.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="v3-shell v3-section">
      <AuthShellV4
        title="گذرواژه را فراموش کردی؟"
        intro="ایمیل حسابت را بنویس؛ اگر حسابی با این ایمیل باشد، پیوند تعیین گذرواژهٔ تازه برایت فرستاده می‌شود."
        image="/images/products/necklace-drop-01.jpg"
        imageAlt="گردنبند قطره روی زمینهٔ روشن"
        quote={site.tagline}
      >
        <ForgotPasswordForm />
      </AuthShellV4>
    </div>
  );
}
