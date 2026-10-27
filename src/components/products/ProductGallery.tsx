'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type GalleryImage = { id: string; url: string; alt: string; width: number; height: number };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="animate-fade-in object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label={`تصاویر ${name}`}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                'relative aspect-square overflow-hidden bg-blush transition-opacity',
                index === active ? 'ring-1 ring-plum ring-offset-2 ring-offset-paper' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
