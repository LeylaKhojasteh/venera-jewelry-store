import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AboutChapters } from '@/components/v3/AboutChapters';

export const metadata: Metadata = {
  title: 'دربارهٔ ونرا',
  description: 'ونرا؛ سیارهٔ جزئیات به‌یادماندنی. طرح‌های خاص، کیفیت و همراهی با مشتری.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="v3-shell v3-section">
      <nav className="v3-crumbs" aria-label="مسیر">
        <Link href="/">خانه</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">دربارهٔ ونرا</span>
      </nav>

      <div className="v3-about-hero">
        <div>
          <h1 className="v3-about-title">ونرا ؛ سیاره ی جزئیات به یاد ماندنی</h1>
        </div>
        <div className="v3-about-media">
          <Image
            src="/images/editorial/about-hero.jpg"
            alt="نمای نزدیک از یک گردنبند ونرا"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="animate-drift object-cover"
          />
        </div>
      </div>

      <section className="v3-section" aria-labelledby="about-design">
        <div className="v3-shell">
          <h2 id="about-design" className="v3-h2">
            سه تصمیم، که مسیر ما را شکل می‌دهد.
          </h2>
          <AboutChapters />
        </div>
      </section>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <Link href="/products" className="v3-btn v3-btn-solid">
          دیدن کالکشن
        </Link>
        <Link href="/contact" className="v3-btn v3-btn-line">
          گفتگو با ونرا
        </Link>
      </div>
    </div>
  );
}
