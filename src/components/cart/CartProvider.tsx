'use client';

/* eslint-disable react-hooks/set-state-in-effect -- This provider mirrors browser storage and the
   server cart into React state. Guest hydration intentionally updates state once on mount, and the
   async resolve is guarded against unmounts; there is no external store to subscribe to for the
   server cart. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { Check, X } from 'lucide-react';
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  resolveGuestCartAction,
  updateCartLineAction,
} from '@/actions/cart';
import type { CartData, CartLineData, GuestCartLine } from '@/types';
import { formatDigits } from '@/lib/money';

const STORAGE_KEY = 'venera.cart.v1';
const EMPTY: GuestCartLine[] = [];

type AddInput = { productId: string; variantId?: string | null; quantity?: number };

type CartContextValue = {
  lines: CartLineData[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  notices: string[];
  loading: boolean;
  pending: boolean;
  adding: boolean;
  isAuthenticated: boolean;
  notice: string | null;
  add: (input: AddInput) => Promise<boolean>;
  update: (productId: string, variantKey: string, quantity: number) => Promise<void>;
  remove: (productId: string, variantKey: string) => Promise<void>;
  refresh: () => Promise<void>;
  dismissNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseStoredCart(): GuestCartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is GuestCartLine =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as GuestCartLine).productId === 'string' &&
          Number.isInteger((item as GuestCartLine).quantity) &&
          (item as GuestCartLine).quantity > 0,
      )
      .map((item) => ({
        productId: item.productId,
        variantId: typeof item.variantId === 'string' ? item.variantId : null,
        quantity: Math.min(20, item.quantity),
      }));
  } catch {
    return [];
  }
}

let guestSnapshot: GuestCartLine[] | null = null;
const guestListeners = new Set<() => void>();

function getGuestSnapshot(): GuestCartLine[] {
  if (guestSnapshot === null) guestSnapshot = parseStoredCart();
  return guestSnapshot;
}

export function subscribeGuestCart(listener: () => void): () => void {
  guestListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      guestSnapshot = parseStoredCart();
      for (const callback of guestListeners) callback();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    guestListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function writeGuestCart(items: GuestCartLine[]) {
  guestSnapshot = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage can be unavailable (private mode); state still works for this page view */
  }
  for (const callback of guestListeners) callback();
}

function guestKey(item: { productId: string; variantId?: string | null }) {
  return `${item.productId}::${item.variantId ?? ''}`;
}

export function clearGuestCartStorage() {
  writeGuestCart([]);
}

export function readGuestCartStorage(): GuestCartLine[] {
  return getGuestSnapshot();
}

export function CartProvider({
  children,
  initialCart,
  isAuthenticated,
}: {
  children: ReactNode;
  initialCart: CartData | null;
  isAuthenticated: boolean;
}) {
  const guest = useSyncExternalStore(subscribeGuestCart, getGuestSnapshot, () => EMPTY);
  const [cart, setCart] = useState<CartData | null>(initialCart);
  const [pending, setPending] = useState(false);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 3600);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const resolveGuest = useCallback(async (items: GuestCartLine[]) => {
    if (items.length === 0) {
      setCart(null);
      return;
    }
    const result = await resolveGuestCartAction({ items });
    if (result.ok) setCart(result.data);
  }, []);

  // Guests keep raw lines in localStorage; the cart page needs live prices and stock,
  // so resolve those lines against the server whenever they change.
  useEffect(() => {
    if (isAuthenticated) return;
    let cancelled = false;
    if (guest.length === 0) {
      setCart(null);
      return;
    }
    setPending(true);
    resolveGuest(guest).finally(() => {
      if (!cancelled) setPending(false);
    });
    return () => {
      cancelled = true;
    };
  }, [guest, isAuthenticated, resolveGuest]);

  // A signed-in session owns the cart in PostgreSQL; drop any guest copy.
  useEffect(() => {
    if (isAuthenticated) clearGuestCartStorage();
  }, [isAuthenticated]);

  const count = useMemo(() => {
    if (!isAuthenticated) return guest.reduce((sum, item) => sum + item.quantity, 0);
    return cart?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
  }, [cart, guest, isAuthenticated]);

  const add = useCallback(
    async (input: AddInput) => {
      const quantity = Math.max(1, Math.min(20, input.quantity ?? 1));

      if (isAuthenticated) {
        setAdding(true);
        const result = await addToCartAction({
          productId: input.productId,
          variantId: input.variantId ?? null,
          quantity,
        });
        setAdding(false);
        if (result.ok) {
          setCart(result.data);
          showNotice('به سبد اضافه شد.');
          return true;
        }
        showNotice(result.message);
        return false;
      }

      const variantId = input.variantId ?? null;
      const key = guestKey({ productId: input.productId, variantId });
      const existing = guest.find((item) => guestKey(item) === key);
      const next = existing
        ? guest.map((item) =>
            guestKey(item) === key ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item,
          )
        : [...guest, { productId: input.productId, variantId, quantity }];
      writeGuestCart(next);
      showNotice('به سبد اضافه شد.');
      return true;
    },
    [guest, isAuthenticated, showNotice],
  );

  const update = useCallback(
    async (productId: string, variantKey: string, quantity: number) => {
      if (isAuthenticated) {
        setPending(true);
        const result = await updateCartLineAction({ productId, variantKey, quantity });
        setPending(false);
        if (result.ok) setCart(result.data);
        else showNotice(result.message);
        return;
      }

      const next =
        quantity <= 0
          ? guest.filter((item) => guestKey(item) !== `${productId}::${variantKey}`)
          : guest.map((item) =>
              guestKey(item) === `${productId}::${variantKey}`
                ? { ...item, quantity: Math.min(20, quantity) }
                : item,
            );
      writeGuestCart(next);
    },
    [guest, isAuthenticated, showNotice],
  );

  const remove = useCallback(
    async (productId: string, variantKey: string) => {
      if (isAuthenticated) {
        setPending(true);
        const result = await removeCartLineAction({ productId, variantKey });
        setPending(false);
        if (result.ok) {
          setCart(result.data);
          showNotice('از سبد حذف شد.');
        } else showNotice(result.message);
        return;
      }

      writeGuestCart(guest.filter((item) => guestKey(item) !== `${productId}::${variantKey}`));
      showNotice('از سبد حذف شد.');
    },
    [guest, isAuthenticated, showNotice],
  );

  const refresh = useCallback(async () => {
    if (isAuthenticated) {
      const result = await getCartAction();
      if (result.ok) setCart(result.data);
      return;
    }
    await resolveGuest(getGuestSnapshot());
  }, [isAuthenticated, resolveGuest]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: cart?.lines ?? [],
      count,
      subtotal: cart?.subtotal ?? 0,
      shipping: cart?.shipping ?? 0,
      total: cart?.total ?? 0,
      freeShippingRemaining: cart?.freeShippingRemaining ?? 0,
      notices: cart?.notices ?? [],
      loading: !isAuthenticated && guest.length > 0 && !cart,
      pending,
      adding,
      isAuthenticated,
      notice,
      add,
      update,
      remove,
      refresh,
      dismissNotice: () => setNotice(null),
    }),
    [add, adding, cart, count, guest.length, isAuthenticated, notice, pending, refresh, remove, update],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 bottom-5 z-[80] flex justify-center md:inset-x-auto md:bottom-8 md:left-8 md:justify-start"
      >
        {notice ? (
          <div className="animate-fade-in pointer-events-auto flex items-center gap-3 border border-plum-ink/15 bg-plum-ink px-5 py-3 text-sm text-paper shadow-card">
            <Check aria-hidden="true" className="size-4 text-gold-soft" />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="ms-2 text-paper/70 transition-colors hover:text-paper"
              aria-label="بستن پیام"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : null}
        <span className="sr-only">{count > 0 ? `${formatDigits(count)} قلم در سبد` : ''}</span>
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
