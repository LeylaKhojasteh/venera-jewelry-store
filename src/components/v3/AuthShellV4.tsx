import Image from 'next/image';
import type { ReactNode } from 'react';
import { AuthOrnaments } from '@/components/v3/AuthOrnaments';

export function AuthShellV4({
  title,
  intro,
  image,
  imageAlt,
  quote,
  children,
  variant = 'split',
}: {
  title: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  quote: string;
  children: ReactNode;
  variant?: 'split' | 'center';
}) {
  if (variant === 'center') {
    return (
      <div className="v3-auth-centered">
        <AuthOrnaments />
        <div className="v3-auth-card">
          <h1 className="v3-auth-title">{title}</h1>
          <p className="v3-auth-intro">{intro}</p>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="v3-auth">
      <div className="v3-auth-copy">
        <h1 className="v3-display">{title}</h1>
        <p className="v3-lead" style={{ marginTop: '1rem', maxWidth: '34ch' }}>
          {intro}
        </p>
        {children}
      </div>

      <div className="v3-auth-art">
        {image ? (
          <>
            <Image
              src={image}
              alt={imageAlt ?? ''}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="animate-drift object-cover"
            />
            <div className="veil" style={{ position: 'absolute', inset: 0 }} />
          </>
        ) : null}
        <p className="v3-auth-quote">«{quote}»</p>
      </div>
    </div>
  );
}
