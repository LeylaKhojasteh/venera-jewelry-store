/**
 * Reference-counted page scroll lock.
 *
 * Several overlays (menu, cart drawer, quick view, native dialogs) can be open at
 * once. Each used to save/restore `html.style.overflow` independently, so closing
 * the first overlay could restore a stale "hidden" value and leave the page frozen.
 * Lock/unlock is counted here and the original value is restored only after the
 * last consumer releases.
 */
let locks = 0;
let originalOverflow = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;
  if (locks === 0) {
    originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  locks += 1;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = originalOverflow;
    originalOverflow = '';
  }
}
