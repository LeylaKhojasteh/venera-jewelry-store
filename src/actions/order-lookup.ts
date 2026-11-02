'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import type { ActionResult } from '@/types';

export async function lookupOrderAction(input: { orderNumber: string }): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: 'برای پیگیری سفارش ابتدا وارد حساب شو.', code: 'AUTH' };
  }

  const orderNumber = input.orderNumber.trim().toUpperCase();
  if (orderNumber.length < 4) {
    return { ok: false, message: 'شمارهٔ سفارش را کامل وارد کن.' };
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber, userId: user.id },
    select: { id: true },
  });

  if (!order) {
    return { ok: false, message: 'سفارشی با این شماره در حساب تو پیدا نشد.' };
  }

  return { ok: true, data: { id: order.id }, message: 'سفارش پیدا شد.' };
}
