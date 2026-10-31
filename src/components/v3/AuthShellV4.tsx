import Image from 'next/image';
import type { ReactNode } from 'react';

export function AuthShellV4({
  title,
  intro,
  image,
  imageAlt,
  quote,
  children,
}: {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  quote: string;
  children: ReactNode;
}) {
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
        <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 46vw" className="animate-drift object-cover" />
        <div className="veil" style={{ position: 'absolute', inset: 0 }} />
        <p className="v3-auth-quote">«{quote}»</p>
      </div>
    </div>
  );
}
