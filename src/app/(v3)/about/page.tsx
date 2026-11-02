import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="v3-checkout">
          <div>
            <h2 id="about-design" className="v3-h2">
              سه تصمیم، که مسیر ما را شکل می‌دهد.
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
              {[
                [
                  'طرح‌های خاص',
                  'ماموریت ما ارائه بهترین تنوع و کیفیت با مناسب‌ترین قیمت است.',
                ],
                [
                  'رضایت مشتری',
                  'جلب رضایت مشتریان همیشگی و رشد کردن در کنار هم.',
                ],
                [
                  'دستیابی به اهداف بلند مدت',
                  'تبدیل شدن به بزرگ‌ترین ارائه‌دهنده اکسسوری در تهران با حمایت شما و تعهد ما به ارائه بهترین خدمات و پشتیبانی.',
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3 className="v3-h3">{title}</h3>
                  <p className="v3-body" style={{ marginTop: '0.35rem', maxWidth: '46ch' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside>
            <div className="v3-about-media" style={{ aspectRatio: '4 / 5', maxHeight: 'none' }}>
              <Image
                src="/images/editorial/macro.jpg"
                alt="جزئیات سطح فلز در آیتم‌ای از ونرا"
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          </aside>
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
