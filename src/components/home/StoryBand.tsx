import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function StoryBand() {
  return (
    <section className="section bg-paper-deep/70" aria-labelledby="story-title">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-blush">
                <Image
                  src="/images/editorial/story-02.jpg"
                  alt="نمای نزدیک از زنجیر و آویز طلای ونرا"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -start-4 hidden w-52 border-4 border-paper-deep sm:block lg:-start-10 lg:w-60">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/images/editorial/story-01.jpg"
                    alt="بافت طلای به‌کاررفته در قطعات ونرا"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute -top-3 end-6 hidden h-16 w-px bg-gold/60 lg:block" aria-hidden="true" />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:ps-6">
            <h2 id="story-title" className="display text-3xl">
              ونرا؛ برای زیبایی‌هایی که از یاد نمی‌روند.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-9 text-ink-soft">
              ما با یک پرسش ساده شروع کردیم: چه چیزی یک قطعه را از یک شیء جدا می‌کند؟ پاسخ، در جزئیاتی بود که
              دیده نمی‌شوند؛ در وزن بست، در جای نشستن سنگ، در لبه‌ای که روی پوست نمی‌نشیند.
            </p>
            <p className="mt-4 max-w-lg text-base leading-9 text-ink-soft">
              هر قطعهٔ ونرا از یک طرح ساده شروع می‌شود و با چند بار آزمودن به شکل نهایی می‌رسد. چیزی که
              می‌بینی، نتیجهٔ همان آزمودن‌های کوچک است.
            </p>

            <ol className="mt-9 divide-y divide-line border-y border-line">
              {[
                ['۰۱', 'انتخاب مواد', 'فلز و سنگ را برای دوام و رنگ پوست انتخاب می‌کنیم، نه فقط برای درخشش.'],
                ['۰۲', 'وزن و تعادل', 'پیش از ظاهر، وزن و تعادل قطعه روی بدن سنجیده می‌شود.'],
                ['۰۳', 'ماندن در استفاده', 'طراحی‌ها برای پوشیدن روزمره ساده شده‌اند؛ نه فقط برای ویترین.'],
              ].map(([number, title, text]) => (
                <li key={number} className="flex gap-5 py-5">
                  <span className="folio pt-1 text-[0.75rem]">{number}</span>
                  <div>
                    <p className="text-sm font-medium text-plum-ink">{title}</p>
                    <p className="mt-1 text-sm leading-7 text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link href="/about" className="link-quiet mt-8 inline-flex text-sm text-plum-ink">
              خواندن داستان کامل
              <ArrowUpLeft aria-hidden="true" className="size-4 text-gold" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
