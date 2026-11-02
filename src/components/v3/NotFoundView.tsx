import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { categoryNav } from '@/lib/constants';

export function NotFoundView() {
  return (
    <div className="v3-section">
      <div className="v3-shell">
        <p className="v3-display" style={{ color: 'var(--copper)' }}>
          ۴۰۴
        </p>
        <h1 className="v3-display" style={{ marginTop: '0.5rem' }}>
          این صفحه پیدا نشد.
        </h1>
        <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '44ch' }}>
          شاید نشانی تغییر کرده باشد یا آیتم از کالکشن خارج شده باشد. از یکی از دسته‌های زیر دوباره شروع کن.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
          <Link href="/" className="v3-btn v3-btn-solid">
            بازگشت به خانه
          </Link>
          <Link href="/products" className="v3-btn v3-btn-line">
            دیدن کالکشن
            <ArrowUpLeft aria-hidden="true" size={16} />
          </Link>
        </div>

        <div className="v3-category-grid" style={{ marginTop: '2.5rem' }}>
          {categoryNav.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className="v3-btn v3-btn-line">
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
