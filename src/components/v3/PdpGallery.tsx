'use client';

import Image from 'next/image';
import { useState } from 'react';

export function PdpGallery({
  images,
  name,
}: {
  images: { id: string; url: string; alt: string }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="v3-pdp-media v3-fade-in">
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 54vw"
          className="animate-drift object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="v3-pdp-thumbs" role="group" aria-label={`تصاویر ${name}`}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className="v3-pdp-thumb"
              aria-current={index === active}
              aria-label={`نمایش تصویر ${index + 1}`}
              onClick={() => setActive(index)}
            >
              <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
