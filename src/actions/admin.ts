'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import {
  adminContactStatusSchema,
  adminOrderStatusSchema,
  adminProductSchema,
} from '@/lib/validation';
import type { ActionResult } from '@/types';

async function guardAdmin(): Promise<{ ok: true } | { ok: false; result: ActionResult }> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, result: { ok: false, message: 'برای این کار باید وارد شوی.', code: 'AUTH' } };
  }
  if (user.role !== 'ADMIN') {
    return { ok: false, result: { ok: false, message: 'این بخش فقط برای مدیران است.', code: 'FORBIDDEN' } };
  }
  return { ok: true };
}

export async function updateProductAction(input: {
  id: string;
  price: number;
  compareAtPrice: number | '' | null;
  stock: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (!guard.ok) return guard.result;

  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'مقادیر واردشده معتبر نیستند.' };
  }
  const { id, price, compareAtPrice, stock, isActive, isFeatured, isBestSeller } = parsed.data;

  if (compareAtPrice !== null && compareAtPrice <= price) {
    return { ok: false, message: 'قیمت قبل از تخفیف باید بزرگ‌تر از قیمت فعال باشد.' };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        price,
        compareAtPrice,
        stock,
        isActive: Boolean(isActive),
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
      },
    });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
    return { ok: true, data: undefined, message: 'محصول به‌روزرسانی شد.' };
  } catch (error) {
    console.error('updateProductAction failed', error);
    return { ok: false, message: 'به‌روزرسانی محصول انجام نشد.' };
  }
}

export async function updateOrderStatusAction(input: {
  orderId: string;
  status: 'DEMO_PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (!guard.ok) return guard.result;

  const parsed = adminOrderStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'وضعیت نامعتبر است.' };

  try {
    await prisma.order.update({
      where: { id: parsed.data.orderId },
      data: { status: parsed.data.status },
    });
    revalidatePath('/admin/orders');
    revalidatePath('/profile/orders');
    return { ok: true, data: undefined, message: 'وضعیت سفارش تغییر کرد.' };
  } catch (error) {
    console.error('updateOrderStatusAction failed', error);
    return { ok: false, message: 'تغییر وضعیت انجام نشد.' };
  }
}

export async function updateContactStatusAction(input: {
  messageId: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
}): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (!guard.ok) return guard.result;

  const parsed = adminContactStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'وضعیت نامعتبر است.' };

  try {
    await prisma.contactMessage.update({
      where: { id: parsed.data.messageId },
      data: { status: parsed.data.status },
    });
    revalidatePath('/admin/messages');
    return { ok: true, data: undefined, message: 'وضعیت پیام تغییر کرد.' };
  } catch (error) {
    console.error('updateContactStatusAction failed', error);
    return { ok: false, message: 'تغییر وضعیت انجام نشد.' };
  }
}
