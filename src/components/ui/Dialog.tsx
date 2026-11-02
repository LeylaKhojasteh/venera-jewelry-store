'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

/**
 * Thin wrapper over the native <dialog> element: modal focus containment, Escape
 * handling and backdrop semantics come from the platform, styling stays ours.
 */
export function Dialog({
  open,
  onClose,
  children,
  className,
  labelledBy,
  side = 'center',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  side?: 'center' | 'end' | 'top';
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lockScroll();
    } else if (!open && dialog.open) {
      dialog.close();
      unlockScroll();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
        unlockScroll();
      }
    };
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        'm-0 bg-transparent p-0 text-charcoal',
        side === 'center' && 'mx-auto my-auto w-[min(92vw,40rem)]',
        side === 'end' && 'ms-auto me-0 h-dvh max-h-none w-[min(90vw,25rem)]',
        side === 'top' && 'mx-auto mt-0 mb-auto w-full max-w-none',
        className,
      )}
    >
      {children}
    </dialog>
  );
}
