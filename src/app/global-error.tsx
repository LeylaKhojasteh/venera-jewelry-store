'use client';

import '@/app/v3.css';
import Link from 'next/link';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="v3-root" style={{ minHeight: '100svh' }}>
          <div className="v3-section">
            <div className="v3-shell">
              <p className="v3-small">اکسسوری ونرا</p>
              <h1 className="v3-display" style={{ marginTop: '0.5rem' }}>
                چیزی درست پیش نرفت.
              </h1>
              <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '44ch' }}>
                یک بار دیگر تلاش کن. اگر مشکل ادامه داشت، از فرم تماس خبر بده.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={reset} className="v3-btn v3-btn-solid">
                  تلاش دوباره
                </button>
                <Link href="/" className="v3-btn v3-btn-line">
                  بازگشت به خانه
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
