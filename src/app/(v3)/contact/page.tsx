import type { Metadata } from 'next';
import Link from 'next/link';
import { AtSign, Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { OrderLookup } from '@/components/contact/OrderLookup';
import { getCurrentUser } from '@/lib/auth/session';
import { demoContact } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'برای سؤال درباره جنس، موجودی یا پیگیری سفارش با تیم ونرا در تماس باش.',
  alternates: { canonical: '/contact' },
};

const channels = [
  { label: 'ایمیل', value: demoContact.email, href: `mailto:${demoContact.email}`, icon: Mail },
  { label: 'تلفن', value: demoContact.phone, href: `tel:${demoContact.phoneRaw}`, icon: Phone },
  { label: 'واتساپ', value: 'گفتگوی سریع', href: 'https://wa.me/989120000000', icon: MessageCircle },
  { label: 'اینستاگرام', value: '@venera.demo', href: 'https://instagram.com/venera.demo', icon: AtSign },
];

export default async function ContactPage() {
  const user = await getCurrentUser();

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

      <div className="v3-contact-layout">
        <div>
          <ContactForm />
        </div>

        <aside className="v3-contact-side">
          <div className="v3-contact-card">
            <p className="v3-small" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock aria-hidden="true" size={14} /> پاسخ‌گویی
            </p>
            <p className="v3-h3" style={{ marginTop: '0.35rem' }}>
              شنبه تا پنجشنبه، ۱۰ تا ۱۸
            </p>
            <p className="v3-small" style={{ marginTop: '0.4rem' }}>
              پیام‌ها معمولاً در اولین روز کاری پاسخ داده می‌شوند.
            </p>
          </div>

          <OrderLookup signedIn={Boolean(user)} />

          <div className="v3-contact-card">
            <h2 className="v3-h3">راه‌های دیگر</h2>
            <div className="v3-channel-grid">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className="v3-channel-card"
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <Icon aria-hidden="true" size={17} />
                    <span>
                      <span className="v3-channel-label">{channel.label}</span>
                      <span className="v3-channel-value" dir={channel.label === 'ایمیل' ? 'ltr' : undefined}>
                        {channel.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
            <p className="v3-small" style={{ marginTop: '0.75rem' }}>
              لینک‌های واتساپ و اینستاگرام فعلاً دمو هستند و بعداً با نشانی واقعی عوض می‌شوند.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
