import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/contact/ContactForm';
import { demoContact } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'تماس با ما',
  description:
    'با ونرا گفتگو کن: سؤال دربارهٔ اندازه، جنس، موجودی یا همکاری. پیام‌ها در پایگاه‌داده ذخیره می‌شوند.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="shell section-tight">
      <Breadcrumbs items={[{ label: 'خانه', href: '/' }, { label: 'تماس با ما' }]} className="mb-8" />

      <PageHeader
        folio="۱۹"
        eyebrow="تماس"
        title="از شنیدن صدای شما خوشحالیم."
        description="اگر دربارهٔ اندازه، جنس، موجودی یا یک سفارش سؤال داری، همین‌جا بنویس. پیام‌ها مستقیم در پنل ونرا ذخیره می‌شوند."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <aside className="lg:col-span-4">
          <div className="space-y-7">
            <div>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <Mail aria-hidden="true" className="size-4 text-gold" />
                ایمیل
              </p>
              <p className="mt-2 text-sm text-plum-ink" dir="ltr">
                {demoContact.email}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <Phone aria-hidden="true" className="size-4 text-gold" />
                تلفن
              </p>
              <p className="mt-2 text-sm text-plum-ink" dir="ltr">
                {demoContact.phone}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <MapPin aria-hidden="true" className="size-4 text-gold" />
                نشانی
              </p>
              <p className="mt-2 text-sm leading-7 text-plum-ink">{demoContact.address}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <ShieldCheck aria-hidden="true" className="size-4 text-gold" />
              پاسخ‌گویی
            </p>
            <p className="mt-2 text-sm leading-8 text-ink-soft">
              فرم‌ها ضدربات ساده دارند و پیام‌ها با زمان ثبت می‌شوند. برای سؤال دربارهٔ اندازه، نام قطعه و
              اندازهٔ فعلی‌ات را بنویس تا دقیق‌تر راهنمایی کنیم.
            </p>
            <Link href="/about" className="link-quiet mt-4 inline-flex text-sm text-plum-ink">
              داستان ونرا را بخوان
            </Link>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
