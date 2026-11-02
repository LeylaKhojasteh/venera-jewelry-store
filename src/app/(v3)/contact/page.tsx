import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { demoContact } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'برای سؤال درباره جنس، موجودی یا پیگیری سفارش با تیم ونرا در تماس باش.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="v3-shell v3-section">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">تماس با ما</span>
      </nav>

      <div className="v3-catalog-head">
        <div>
          <h1 className="v3-page-title">از شنیدن نظرات شما خوشحال می‌شویم</h1>
          <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '42ch' }}>
            اگر درباره جنس یا موجودی سوال داری یا می‌خوای سفارشت رو پیگیری کنی همین‌جا بنویس. تیم ما
            در اولین فرصت باهات تماس می‌گیره.
          </p>
        </div>
      </div>

      <div className="v3-checkout">
        <div>
          <ContactForm />
        </div>

        <aside>
          <div className="v3-order-summary">
            <h2 className="v3-h3">راه‌های دیگر</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <p className="v3-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail aria-hidden="true" size={14} /> ایمیل
                </p>
                <p className="v3-body" dir="ltr" style={{ marginTop: '0.2rem' }}>
                  {demoContact.email}
                </p>
              </div>
              <div>
                <p className="v3-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone aria-hidden="true" size={14} /> تلفن
                </p>
                <p className="v3-body" dir="ltr" style={{ marginTop: '0.2rem' }}>
                  {demoContact.phone}
                </p>
              </div>
              <div>
                <p className="v3-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin aria-hidden="true" size={14} /> نشانی
                </p>
                <p className="v3-body" style={{ marginTop: '0.2rem' }}>
                  {demoContact.address}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
