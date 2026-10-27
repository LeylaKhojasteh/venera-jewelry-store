'use server';

import { revalidatePath } from 'next/cache';
import {
  addItem,
  clearCart,
  getCartForUser,
  mergeGuestCart,
  removeItem,
  resolveGuestCart,
  updateItemQuantity,
  CartError,
} from '@/lib/cart';
import { getCurrentUser } from '@/lib/auth/session';
import { cartLineInputSchema, guestCartSchema } from '@/lib/validation';
import type { ActionResult, CartData } from '@/types';

function fail(error: unknown): ActionResult<CartData> {
  if (error instanceof CartError) {
    return { ok: false, message: error.message, code: error.code };
  }
  console.error('cart action failed', error);
  return { ok: false, message: 'به‌روزرسانی سبد انجام نشد. دوباره تلاش کن.' };
}

async function requireShopper() {
  return getCurrentUser();
}

export async function addToCartAction(input: {
  productId: string;
  variantId?: string | null;
  quantity: number;
}): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'برای افزودن به سبد وارد شو.', code: 'AUTH' };

  const parsed = cartLineInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'درخواست نامعتبر است.' };

  try {
    const cart = await addItem(user.id, parsed.data.productId, parsed.data.variantId ?? null, parsed.data.quantity);
    revalidatePath('/cart');
    return { ok: true, data: cart, message: 'به سبد اضافه شد.' };
  } catch (error) {
    return fail(error);
  }
}

export async function updateCartLineAction(input: {
  productId: string;
  variantKey: string;
  quantity: number;
}): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'برای ویرایش سبد وارد شو.', code: 'AUTH' };

  const quantity = Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20) {
    return { ok: false, message: 'تعداد نامعتبر است.' };
  }
  try {
    const cart = await updateItemQuantity(user.id, input.productId, input.variantKey, quantity);
    revalidatePath('/cart');
    return { ok: true, data: cart };
  } catch (error) {
    return fail(error);
  }
}

export async function removeCartLineAction(input: {
  productId: string;
  variantKey: string;
}): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'برای ویرایش سبد وارد شو.', code: 'AUTH' };

  try {
    const cart = await removeItem(user.id, input.productId, input.variantKey);
    revalidatePath('/cart');
    return { ok: true, data: cart, message: 'از سبد حذف شد.' };
  } catch (error) {
    return fail(error);
  }
}

export async function clearCartAction(): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'برای خالی‌کردن سبد وارد شو.', code: 'AUTH' };

  try {
    await clearCart(user.id);
    revalidatePath('/cart');
    return { ok: true, data: await getCartForUser(user.id) };
  } catch (error) {
    return fail(error);
  }
}

export async function mergeGuestCartAction(input: {
  items: { productId: string; variantId?: string | null; quantity: number }[];
}): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'برای انتقال سبد وارد شو.', code: 'AUTH' };

  const parsed = guestCartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'سبد مهمان نامعتبر است.' };

  try {
    const cart = await mergeGuestCart(
      user.id,
      parsed.data.items.map((i) => ({ productId: i.productId, variantId: i.variantId ?? null, quantity: i.quantity })),
    );
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { ok: true, data: cart };
  } catch (error) {
    return fail(error);
  }
}

export async function resolveGuestCartAction(input: {
  items: { productId: string; variantId?: string | null; quantity: number }[];
}): Promise<ActionResult<CartData>> {
  const parsed = guestCartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'سبد نامعتبر است.' };

  try {
    const cart = await resolveGuestCart(
      parsed.data.items.map((i) => ({ productId: i.productId, variantId: i.variantId ?? null, quantity: i.quantity })),
    );
    return { ok: true, data: cart };
  } catch (error) {
    return fail(error);
  }
}

export async function getCartAction(): Promise<ActionResult<CartData>> {
  const user = await requireShopper();
  if (!user) return { ok: false, message: 'وارد نشده‌ای.', code: 'AUTH' };
  return { ok: true, data: await getCartForUser(user.id) };
}
