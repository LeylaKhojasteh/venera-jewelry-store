'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';

const LETTERS = ['V', 'E', 'N', 'E', 'R', 'A'];

/**
 * First-load curtain for the homepage. The letters arrive one by one, then the
 * curtain lifts once the page and the 3D hero have signalled that they are
 * ready. The navigation is still server rendered underneath.
 */
export function Preloader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [visible, setVisible] = useState(isHome);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!isHome || !visible) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let finished = false;
    let loadDone = false;
    let minTimer: number | undefined;
    let leaveTimer: number | undefined;
    const started = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      document.querySelector('.v3-site')?.classList.add('is-revealed');
      leaveTimer = window.setTimeout(() => {
        setVisible(false);
      }, 900);
    };

    const onLoad = () => {
      if (loadDone) return;
      loadDone = true;
      const wait = Math.max(0, 1500 - (performance.now() - started));
      minTimer = window.setTimeout(finish, wait);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    // If the load event never fires, never trap the page behind the curtain.
    const fallback = window.setTimeout(finish, 2200);

    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(fallback);
      if (minTimer) window.clearTimeout(minTimer);
      if (leaveTimer) window.clearTimeout(leaveTimer);
      document.querySelector('.v3-site')?.classList.remove('is-revealed');
    };
  }, [isHome, visible]);

  if (!isHome || !visible) return null;

  return (
    <div
      className={`v3-preloader${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="در حال آماده‌سازی فروشگاه"
    >
      <div className="v3-preloader-logo" dir="ltr" aria-hidden="true">
        {LETTERS.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="v3-preloader-letter"
            style={{ '--i': index } as CSSProperties}
          >
            {letter}
          </span>
        ))}
      </div>
      <span className="v3-preloader-line" aria-hidden="true" />
      <span className="v3-preloader-label">اکسسوری ونرا</span>
      <span className="sr-only">در حال آماده‌سازی…</span>
    </div>
  );
}
