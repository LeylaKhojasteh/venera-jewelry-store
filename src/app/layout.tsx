import type { Metadata, Viewport } from 'next';
import './globals.css';
import { env } from '@/lib/env';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: 'اکسسوری لوکس ونرا | بهترین قیمت و بیشترین تنوع',
    template: `%s | ${site.faName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ['زیورآلات', 'ونرا', 'گردنبند', 'دستبند', 'گوشواره', 'انگشتر', 'اکسسوری'],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: 'اکسسوری لوکس ونرا',
    description: site.description,
    images: [{ url: '/images/hero/hero.jpg', width: 1600, height: 1600, alt: 'اکسسوری لوکس ونرا' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اکسسوری لوکس ونرا',
    description: site.description,
    images: ['/images/hero/hero.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F2EA' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0A0C' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/v3/estedad-arabic-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/v3/estedad-latin-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/v3/bodoni-latin-normal-400-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
