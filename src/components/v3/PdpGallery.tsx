'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';

export function PdpGallery({
  images,
  name,
}: {
  images: { id: string; url: string; alt: string }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
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
        <button
          type="button"
          className="v3-pdp-zoom-trigger"
          onClick={() => setZoomOpen(true)}
          aria-label="بزرگ‌نمایی تصویر محصول"
        >
          <ZoomIn aria-hidden="true" size={18} />
        </button>
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

      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        labelledBy="pdp-zoom-title"
        className="v3-zoom-dialog"
      >
        <div className="v3-zoom-inner">
          <h2 id="pdp-zoom-title" className="sr-only">
            بزرگ‌نمایی تصویر {name}
          </h2>
          <button
            type="button"
            className="v3-icon v3-zoom-close"
            onClick={() => setZoomOpen(false)}
            aria-label="بستن بزرگ‌نمایی"
          >
            <X aria-hidden="true" size={20} />
          </button>
          <Image src={current.url} alt={current.alt} fill sizes="96vw" className="object-contain" />
        </div>
      </Dialog>
    </div>
  );
}
