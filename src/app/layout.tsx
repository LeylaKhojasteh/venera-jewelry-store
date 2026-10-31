import type { Metadata, Viewport } from 'next';
import './globals.css';
import { env } from '@/lib/env';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${site.faName} | زیورآلات معاصر`,
    template: `%s | ${site.faName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ['زیورآلات', 'ونرا', 'گردنبند', 'دستبند', 'گوشواره', 'انگشتر', 'طلا', 'نقره'],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.faName} | زیورآلات معاصر`,
    description: site.description,
    images: [{ url: '/images/hero/hero.jpg', width: 1600, height: 1600, alt: 'ونرا — زیورآلات معاصر' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.faName} | زیورآلات معاصر`,
    description: site.description,
    images: ['/images/hero/hero.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F2EA',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/vazirmatn-arabic-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn-latin-normal-100-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/markazi-arabic-normal-400-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
