'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('store route error', error);
  }, [error]);

  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <h1 className="display text-3xl">چیزی درست پیش نرفت.</h1>
      <p className="mt-4 max-w-lg text-base leading-8 text-ink-soft">
        ممکن است ارتباط با پایگاه‌داده لحظه‌ای قطع شده باشد. یک بار دیگر تلاش کن؛ اگر ادامه داشت، از فرم تماس
        خبر بده.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RotateCcw aria-hidden="true" className="size-4" />
          تلاش دوباره
        </button>
        <Link href="/" className="btn btn-outline">
          بازگشت به خانه
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-8 text-[0.65rem] text-ink-soft" dir="ltr">
          ref: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
