import Image from 'next/image';
import type { ReactNode } from 'react';
import { site } from '@/lib/constants';

export function AuthShell({
  title,
  intro,
  image,
  imageAlt,
  quote,
  children,
}: {
  folio: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  quote: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-12">
      <div className="order-2 flex items-center bg-paper px-[clamp(1.25rem,4vw,4rem)] py-12 lg:order-1 lg:col-span-6 lg:py-20 xl:col-span-5">
        <div className="mx-auto w-full max-w-md">
          <h1 className="display text-3xl">{title}</h1>
          <p className="mt-3 text-sm leading-8 text-ink-soft">{intro}</p>
          {children}
        </div>
      </div>

      <div className="relative order-1 min-h-[13rem] overflow-hidden bg-plum-ink lg:order-2 lg:col-span-6 lg:min-h-full xl:col-span-7">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/90 via-plum-deep/35 to-plum-deep/10" />
        <div className="absolute inset-6 flex flex-col justify-between text-paper lg:inset-10">
          <span className="font-latin text-lg tracking-[0.32em]">{site.logotype}</span>
          <div className="max-w-sm">
            <p className="font-display text-2xl leading-snug text-paper lg:text-3xl">«{quote}»</p>
            <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-paper/60">VENERA — JEWELLERY ATELIER</p>
          </div>
        </div>
      </div>
    </div>
  );
}
