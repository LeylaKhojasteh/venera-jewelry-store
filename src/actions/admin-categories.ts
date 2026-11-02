'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import type { ActionResult } from '@/types';

async function guardAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return false;
  return true;
}

const categorySchema = z.object({
  slug: z.string().trim().min(2).max(40).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(60),
  latinName: z.string().trim().min(2).max(60),
  tagline: z.string().trim().max(160).optional().default(''),
  description: z.string().trim().max(1000).optional().default(''),
  image: z.string().trim().max(500).optional().default(''),
  imageAlt: z.string().trim().max(160).optional().default(''),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export async function saveCategoryAction(
  _previous: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  if (!(await guardAdmin())) return { ok: false, message: 'دسترسی غیرمجاز.' };

  const parsed = categorySchema.safeParse({
    slug: String(formData.get('slug') ?? '').toLowerCase(),
    name: String(formData.get('name') ?? ''),
    latinName: String(formData.get('latinName') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    description: String(formData.get('description') ?? ''),
    image: String(formData.get('image') ?? ''),
    imageAlt: String(formData.get('imageAlt') ?? ''),
    sortOrder: formData.get('sortOrder') ?? 0,
  });
  if (!parsed.success) return { ok: false, message: 'اطلاعات دسته‌بندی را بررسی کن.' };

  const id = String(formData.get('id') ?? '').trim();
  const data = {
    ...parsed.data,
    image: parsed.data.image || '/images/categories/necklace.jpg',
    imageAlt: parsed.data.imageAlt || parsed.data.name,
  };

  try {
    const category = id
      ? await prisma.category.update({ where: { id }, data })
      : await prisma.category.create({ data });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/categories');
    return { ok: true, data: { id: category.id }, message: 'دسته‌بندی ذخیره شد.' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, message: 'این اسلاگ قبلاً استفاده شده است.' };
    }
    console.error('saveCategoryAction failed', error);
    return { ok: false, message: 'ذخیرهٔ دسته‌بندی انجام نشد.' };
  }
}
