import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'دربارهٔ ونرا',
  description:
    'ونرا چگونه طراحی می‌کند: انتخاب مواد، آزمودن وزن و تعادل، و طراحی برای استفادهٔ روزمره.',
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
          <h1 className="v3-display">ونرا؛ برای جزئیاتی که می‌مانند.</h1>
          <p className="v3-lead" style={{ marginTop: '1.25rem', maxWidth: '38ch' }}>
            یک آتلیهٔ کوچک اکسسوری در تهران. کارمان ساده است: خط، وزن و نشستن آیتم را تا جایی که
            درست باشد اصلاح می‌کنیم.
          </p>
          <Link href="/products" className="v3-btn v3-btn-solid" style={{ marginTop: '1.5rem' }}>
            دیدن کالکشن
          </Link>
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

      <section className="v3-section" aria-labelledby="about-materials">
        <div className="v3-materials">
          <div>
            <h2 id="about-materials" className="v3-h2">
              استیل ۳۱۶، مروارید پرورشی.
            </h2>
            <p className="v3-lead" style={{ marginTop: '1.25rem', maxWidth: '36ch' }}>
              فلزهایی که با پوست روزمره کنار می‌آیند و آبکاری رنگی ندارند. مرواریدها پرورشی‌اند و
              سطح فلز مات نگه داشته می‌شود تا خط‌وخش کمتر دیده شود.
            </p>
          </div>
          <div className="v3-materials-facts">
            <span>استیل ۳۱۶</span>
            <span>مروارید پرورشی</span>
            <span>ساخت تهران</span>
            <span>کالکشن ۱۴۰۵</span>
          </div>
        </div>
      </section>

      <section className="v3-section" aria-labelledby="about-design">
        <div className="v3-checkout">
          <div>
            <h2 id="about-design" className="v3-h2">
              سه تصمیمی که همهٔ آیتم‌ها را شکل می‌دهد
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
              {[
                ['مواد، برای ماندن', 'فلزهایی که با استفادهٔ روزمره دوام بیاورند؛ جنس هر آیتم در صفحهٔ آن نوشته شده است.'],
                ['وزن، پیش از ظاهر', 'اگر آیتم روی مچ بچرخد یا گوش را اذیت کند، طراحی تمام نشده است.'],
                ['طراحی برای پوشیدن', 'لبه‌های گرد، بست ساده و اندازهٔ مشخص؛ برای روزهای معمولی.'],
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
