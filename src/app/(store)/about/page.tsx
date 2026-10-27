import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دربارهٔ ونرا',
  description:
    'ونرا چگونه طراحی می‌کند: انتخاب مواد، آزمودن وزن و تعادل، و طراحی برای استفادهٔ روزمره.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[26rem] overflow-hidden bg-plum-ink lg:min-h-[34rem]">
        <Image
          src="/images/editorial/about-hero.jpg"
          alt="نمای نزدیک از زنجیر و آویز طلای ونرا"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/90 via-plum-deep/35 to-plum-deep/10" />
        <div className="shell relative flex min-h-[26rem] items-end pb-12 lg:min-h-[34rem] lg:pb-16">
          <div className="max-w-3xl text-paper">
            <h1 className="display text-4xl text-paper">
              ونرا؛ برای زیبایی‌هایی که از یاد نمی‌روند.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-paper/75">
              ما زیورآلات را مثل یک قطعهٔ ادبی می‌بینیم: کوتاه، دقیق و قابل بازخواندن. چیزی که هر روز می‌پوشی
              باید درست بنشیند، سبک باشد و سال‌ها بماند.
            </p>
          </div>
        </div>
      </section>

      <section className="shell section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="display text-2xl">
              طراحی خوب، در جزئیاتی است که بعد از چند بار پوشیدن معلوم می‌شوند.
            </p>
          </div>
          <div className="space-y-5 text-base leading-9 text-ink-soft lg:col-span-7">
            <p>
              هر قطعهٔ ونرا از یک ایدهٔ کوچک شروع می‌شود: یک خط، یک وزن، یک نقطهٔ نشستن روی پوست. بعد از آن،
              نوبت آزمودن است؛ تغییر بست، کوتاه‌کردن آویز، کم‌کردن ارتفاع نگین. چیزی که در نهایت می‌بینی،
              حاصل همین اصلاح‌های کوچک است.
            </p>
            <p>
              ما به سادگی اعتقاد داریم، اما نه سادگی‌ای که به بی‌تفاوتی تبدیل شود. یک زنجیر نازک باید جای
              درستی روی گردن بنشیند؛ یک انگشتر پهن باید بدون فشار، از انگشت رد شود. این‌ها را با اندازه‌گیری
              و چند بار پوشیدن بررسی می‌کنیم، نه با حدس.
            </p>
            <p>
              کالکشن کوچک است چون ترجیح می‌دهیم هر قطعه توضیح روشنی داشته باشد: جنس فلز، نوع سنگ، اندازه و
              روش نگهداری. اگر چیزی را نمی‌دانی، در صفحهٔ محصول یا فرم تماس می‌توانی بپرسی.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/60">
        <div className="shell section">
          <h2 className="display text-2xl md:text-3xl">سه تصمیمی که همهٔ قطعه‌ها را شکل می‌دهد</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'مواد، برای ماندن',
                text: 'فلزهایی انتخاب می‌کنیم که با پوست روزمره کنار بیایند و آبکاری‌شان با استفادهٔ معمول دوام بیاورد. نوع مواد در هر صفحه نوشته شده است.',
              },
              {
                title: 'وزن، پیش از ظاهر',
                text: 'یک قطعهٔ سنگین ممکن است زیبا باشد، اما اگر روی مچ بچرخد یا گوش را اذیت کند، طراحی ناتمام است. وزن و تعادل را قبل از پرداخت نهایی می‌سنجیم.',
              },
              {
                title: 'طراحی برای پوشیدن',
                text: 'لبه‌های گرد، بست‌های ساده و اندازه‌های مشخص؛ تا قطعه فقط در ویترین خوب نباشد و در طول روز راحت بماند.',
              },
            ].map((item) => (
              <article key={item.title} className="border-t border-line pt-5">
                <h3 className="font-display text-xl text-plum-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-8 text-ink-soft">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden bg-blush lg:col-span-6">
            <Image
              src="/images/editorial/macro.jpg"
              alt="جزئیات بافت و سطح فلز در قطعه‌ای از ونرا"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <h2 className="display text-3xl">از طرح تا قطعهٔ نهایی</h2>
            <ol className="mt-7 divide-y divide-line border-y border-line">
              {[
                ['طرح', 'یک فرم ساده روی کاغذ؛ با اندازه و نسبت مشخص.'],
                ['نمونه', 'ساخت نمونه برای سنجش وزن، نشستن روی بدن و راحتی بست.'],
                ['اصلاح', 'تغییرهای کوچک در ضخامت، طول و جای سنگ.'],
                ['پرداخت', 'کنترل سطح، لبه‌ها و کیفیت پرداخت نهایی.'],
              ].map(([title, text], index) => (
                <li key={title} className="flex gap-5 py-4">
                  <span className="folio pt-1 text-[0.72rem]">{`۰${index + 1}`}</span>
                  <div>
                    <p className="text-sm font-medium text-plum-ink">{title}</p>
                    <p className="mt-1 text-sm leading-7 text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/products" className="btn btn-primary mt-8">
              دیدن کالکشن
              <ArrowUpLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
