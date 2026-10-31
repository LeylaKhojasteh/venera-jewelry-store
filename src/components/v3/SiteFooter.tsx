import Link from 'next/link';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { demoContact } from '@/lib/constants';
import { formatJalaliNumeric } from '@/lib/dates';
import type { CategoryData } from '@/types';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="v3-foot-link">
      {children}
    </Link>
  );
}

export function SiteFooter({ categories }: { categories: CategoryData[] }) {
  const year = formatJalaliNumeric(new Date()).split('/')[0];

  return (
    <footer className="v3-footer">
      <div className="v3-shell">
        <div className="v3-footer-grid">
          <div>
            <Link href="/" className="v3-logo" aria-label="ونرا">
              <span className="v3-logo-mark">VENERA</span> <small>ونرا</small>
            </Link>
            <p className="v3-body" style={{ marginTop: '1.25rem', maxWidth: '24ch' }}>
              زیورآلات استیل، طراحی و ساخت تهران. کالکشن کوچک، جزئیات روشن.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a href={`mailto:${demoContact.email}`} className="v3-small" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail aria-hidden="true" size={15} /> <span dir="ltr">{demoContact.email}</span>
              </a>
              <a href={`tel:${demoContact.phoneRaw}`} className="v3-small" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone aria-hidden="true" size={15} /> <span dir="ltr">{demoContact.phone}</span>
              </a>
              <p className="v3-small" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin aria-hidden="true" size={15} style={{ marginTop: '0.25rem' }} /> {demoContact.address}
              </p>
            </div>
          </div>

          <div>
            <h3>دسته‌بندی‌ها</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.slug}>
                  <FooterLink href={`/products?category=${category.slug}`}>{category.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>فروشگاه</h3>
            <ul>
              <li>
                <FooterLink href="/products">همهٔ محصولات</FooterLink>
              </li>
              <li>
                <FooterLink href="/products?sort=bestseller">پرفروش‌ها</FooterLink>
              </li>
              <li>
                <FooterLink href="/products?discount=1">تخفیف‌دارها</FooterLink>
              </li>
              <li>
                <FooterLink href="/about">داستان ونرا</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">تماس</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="v3-footer-bottom">
          <p>© {year} ونرا — تمام حقوق محفوظ است.</p>
          <a href="#top" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            بازگشت به بالا
            <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
