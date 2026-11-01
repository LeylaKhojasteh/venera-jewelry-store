import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function BrandLine() {
  return (
    <section className="bg-plum-ink text-paper" aria-label="شعار ونرا">
      <div className="shell section-tight">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="display text-3xl text-paper md:text-4xl">
              جزئیاتی که با تو می‌مانند؛
              <br />
              نه چیزی بیشتر، نه چیزی کمتر.
            </p>
          </div>
          <div className="md:col-span-4 md:text-end">
            <p className="text-sm leading-8 text-paper/60">
              کالکشن محدود زیورآلات، با تمرکز بر فرم، وزن و ماندگاری. هر آیتم یک بار ساخته می‌شود و تا وقتی
              دوستش داشته باشی می‌ماند.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GenderPanels() {
  const panels = [
    {
      title: 'زنانه',
      latin: 'Women',
      copy: 'زنجیرهای نازک، حلقه‌های سبک و سنگ‌هایی که در نور کم هم دیده می‌شوند.',
      href: '/products?gender=women',
      image: '/images/editorial/women-panel.jpg',
      alt: 'گردنبند ظریف زنانهٔ ونرا',
    },
    {
      title: 'مردانه',
      latin: 'Men',
      copy: 'فلزهای مات، بافت‌های سنگین و قفل‌هایی که بخشی از طراحی‌اند.',
      href: '/products?gender=men',
      image: '/images/editorial/men-panel.jpg',
      alt: 'دستبند و انگشتر مردانهٔ ونرا',
    },
  ];

  return (
    <section className="section" aria-label="کالکشن‌های زنانه و مردانه">
      <div className="shell">
        <div className="grid gap-3 md:grid-cols-2 lg:gap-5">
          {panels.map((panel, index) => (
            <Reveal key={panel.title} delay={index * 90}>
              <Link
                href={panel.href}
                className="group relative block aspect-[4/5] overflow-hidden bg-blush sm:aspect-[5/6] lg:aspect-[4/5]"
              >
                <Image
                  src={panel.image}
                  alt={panel.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/85 via-plum-deep/25 to-transparent" />
                <div className="absolute inset-5 flex flex-col justify-end text-paper lg:inset-7">
                  <div>
                    <h2 className="font-display text-4xl leading-none">{panel.title}</h2>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-paper/80">{panel.copy}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs text-paper transition-transform duration-300 group-hover:-translate-y-1">
                      دیدن کالکشن {panel.title}
                      <ArrowUpLeft aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CraftNotes() {
  const notes = [
    {
      title: 'مواد، بدون ابهام',
      text: 'جنس فلز، نوع سنگ و اندازهٔ هر آیتم در صفحهٔ محصول نوشته شده است؛ همان چیزی که می‌بینی، همان چیزی است که می‌رسد.',
    },
    {
      title: 'اندازه، پیش از خرید',
      text: 'برای انگشتر و دستبند اندازه‌های مشخص داریم. اگر بین دو اندازه بودی، از فرم تماس بپرس؛ راهنمایی می‌کنیم.',
    },
    {
      title: 'نگهداری، ساده',
      text: 'هر آیتم با یک دستور نگهداری کوتاه همراه است: دور از عطر، خشک و جدا از آیتم‌ها دیگر. همین کافی است.',
    },
  ];

  return (
    <section className="border-y border-line bg-paper-soft/60" aria-labelledby="craft-title">
      <div className="shell section-tight">
        <h2 id="craft-title" className="display text-2xl md:text-3xl">
          آنچه مهم است
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {notes.map((note) => (
            <div key={note.title} className="border-t border-line pt-5">
              <h3 className="font-display text-xl text-plum-ink">{note.title}</h3>
              <p className="mt-3 text-sm leading-8 text-ink-soft">{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-plum-deep text-paper">
      <Image
        src="/images/editorial/cta.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-plum-deep/85 via-plum-deep/80 to-plum-deep/95" aria-hidden="true" />
      <div className="shell relative section text-center">
        <h2 className="display mx-auto max-w-3xl text-4xl text-paper">
          سبک خودت را با یک آیتم درست کامل کن.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-paper/70">
          کالکشن کوچک است؛ اما هر آیتم با دقت انتخاب شده. اگر مطمئن نیستی از کجا شروع کنی، با ما حرف بزن.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/products" className="btn btn-light min-w-[11rem]">
            کشف کالکشن
          </Link>
          <Link href="/contact" className="btn btn-ghost-dark min-w-[11rem]">
            گفتگو با ونرا
          </Link>
        </div>
      </div>
    </section>
  );
}
