'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { addressSchema } from '@/lib/validation';
import type { ActionResult } from '@/types';

function zodFields(error: { issues: { path: PropertyKey[]; message: string }[] }): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
}

function revalidateAddressViews() {
  revalidatePath('/profile/addresses');
  revalidatePath('/profile');
  revalidatePath('/checkout');
}

type AddressInput = {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  label?: string;
  isDefault?: boolean;
};

async function persistAddress(
  userId: string,
  addressId: string | null,
  data: AddressInput,
): Promise<ActionResult<{ id: string }>> {
  const existingCount = await prisma.address.count({ where: { userId } });
  const makeDefault = data.isDefault === true || existingCount === 0;

  const result = await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    if (addressId) {
      const owned = await tx.address.findFirst({ where: { id: addressId, userId }, select: { id: true } });
      if (!owned) return null;
      return tx.address.update({
        where: { id: addressId },
        data: {
          recipient: data.recipient,
          phone: data.phone,
          province: data.province,
          city: data.city,
          postalCode: data.postalCode,
          street: data.street,
          label: data.label ?? null,
          ...(makeDefault ? { isDefault: true } : {}),
        },
        select: { id: true },
      });
    }

    return tx.address.create({
      data: {
        userId,
        recipient: data.recipient,
        phone: data.phone,
        province: data.province,
        city: data.city,
        postalCode: data.postalCode,
        street: data.street,
        label: data.label ?? null,
        isDefault: makeDefault,
      },
      select: { id: true },
    });
  });

  if (!result) return { ok: false, message: 'این نشانی پیدا نشد.', code: 'NOT_FOUND' };
  revalidateAddressViews();
  return { ok: true, data: { id: result.id } };
}

export async function createAddressAction(input: AddressInput): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'برای ذخیرهٔ نشانی باید وارد شوی.', code: 'AUTH' };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'نشانی را کامل کن.', fieldErrors: zodFields(parsed.error) };
  }
  return persistAddress(user.id, null, parsed.data);
}

export async function updateAddressAction(
  input: AddressInput & { id: string },
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'برای ویرایش نشانی باید وارد شوی.', code: 'AUTH' };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'نشانی را کامل کن.', fieldErrors: zodFields(parsed.error) };
  }
  return persistAddress(user.id, input.id, parsed.data);
}

export async function deleteAddressAction(addressId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'برای حذف نشانی باید وارد شوی.', code: 'AUTH' };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: user.id },
    select: { id: true, isDefault: true },
  });
  if (!address) return { ok: false, message: 'این نشانی پیدا نشد.', code: 'NOT_FOUND' };

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: address.id } });
    if (address.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      if (next) await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  });

  revalidateAddressViews();
  return { ok: true, data: undefined };
}

export async function setDefaultAddressAction(addressId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: 'برای تغییر نشانی پیش‌فرض باید وارد شوی.', code: 'AUTH' };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: user.id },
    select: { id: true },
  });
  if (!address) return { ok: false, message: 'این نشانی پیدا نشد.', code: 'NOT_FOUND' };

  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: address.id }, data: { isDefault: true } }),
  ]);

  revalidateAddressViews();
  return { ok: true, data: undefined };
}
