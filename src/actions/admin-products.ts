'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { ProductImageError, saveProductImages } from '@/lib/product-images';
import type { ActionResult } from '@/types';

async function guardAdmin(): Promise<{ ok: true } | { ok: false; result: ActionResult }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, result: { ok: false, message: 'برای این کار باید وارد شوی.', code: 'AUTH' } };
  if (user.role !== 'ADMIN') {
    return { ok: false, result: { ok: false, message: 'این بخش فقط برای مدیران است.', code: 'FORBIDDEN' } };
  }
  return { ok: true };
}

const productSchema = z.object({
  name: z.string().trim().min(2, 'نام محصول کوتاه است.').max(120, 'نام محصول طولانی است.'),
  slug: z
    .string()
    .trim()
    .min(2, 'اسلاگ کوتاه است.')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'اسلاگ فقط حروف لاتین کوچک، عدد و خط تیره.'),
  sku: z.string().trim().min(2, 'SKU کوتاه است.').max(60),
  categoryId: z.string().min(1, 'دسته‌بندی را انتخاب کن.'),
  gender: z.enum(['WOMEN', 'MEN', 'UNISEX']),
  price: z.coerce.number().int().min(0).max(1_000_000_000),
  compareAtPrice: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : Number(value)),
    z.number().int().min(0).max(1_000_000_000).nullable(),
  ),
  stock: z.coerce.number().int().min(0).max(100_000),
  materials: z.string().trim().max(200).optional().default('استیل ۳۱۶'),
  care: z.string().trim().max(500).optional().default(''),
  description: z.string().trim().min(10, 'توضیح کوتاه است.').max(4000),
  story: z.string().trim().max(4000).optional().default(''),
  tags: z.string().trim().max(300).optional().default(''),
});

function formValues(formData: FormData) {
  return {
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? '').toLowerCase(),
    sku: String(formData.get('sku') ?? ''),
    categoryId: String(formData.get('categoryId') ?? ''),
    gender: String(formData.get('gender') ?? 'WOMEN'),
    price: formData.get('price'),
    compareAtPrice: formData.get('compareAtPrice') ?? '',
    stock: formData.get('stock') ?? 0,
    materials: String(formData.get('materials') ?? ''),
    care: String(formData.get('care') ?? ''),
    description: String(formData.get('description') ?? ''),
    story: String(formData.get('story') ?? ''),
    tags: String(formData.get('tags') ?? ''),
  };
}

function imageFiles(formData: FormData): File[] {
  return formData
    .getAll('images')
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function saveProductAction(
  _previous: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const guard = await guardAdmin();
  if (!guard.ok) return guard.result as ActionResult<{ id: string }>;

  const parsed = productSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (fields[key] ??= []).push(issue.message);
    }
    return { ok: false, message: 'فیلدهای محصول را بررسی کن.', fieldErrors: fields };
  }

  const data = parsed.data;
  const compareAtPrice = data.compareAtPrice;
  if (compareAtPrice !== null && compareAtPrice <= data.price) {
    return { ok: false, message: 'قیمت پیش از تخفیف باید از قیمت فعال بزرگ‌تر باشد.' };
  }

  const category = await prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
  if (!category) return { ok: false, message: 'دسته‌بندی انتخاب‌شده معتبر نیست.' };

  const files = imageFiles(formData);
  const existingId = String(formData.get('id') ?? '').trim();
  const tags = data.tags
    .split(/[,،]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);

  const productData = {
    name: data.name,
    slug: data.slug,
    sku: data.sku,
    categoryId: data.categoryId,
    gender: data.gender,
    price: data.price,
    compareAtPrice,
    stock: data.stock,
    materials: data.materials || 'استیل ۳۱۶',
    care: data.care,
    description: data.description,
    story: data.story,
    tags,
    isActive: formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
  };

  try {
    if (!existingId && files.length === 0) {
      return { ok: false, message: 'برای محصول جدید حداقل یک تصویر انتخاب کن.' };
    }

    if (!existingId) {
      const product = await prisma.product.create({ data: productData });
      try {
        await saveProductImages({ productId: product.id, files, alt: product.name });
      } catch (error) {
        await prisma.product.delete({ where: { id: product.id } });
        throw error;
      }
      revalidatePath('/', 'layout');
      revalidatePath('/admin/products');
      return { ok: true, data: { id: product.id }, message: 'محصول ساخته شد.' };
    }

    const existing = await prisma.product.findUnique({
      where: { id: existingId },
      include: { _count: { select: { images: true } } },
    });
    if (!existing) return { ok: false, message: 'محصول پیدا نشد.' };
    if (existing._count.images === 0 && files.length === 0) {
      return { ok: false, message: 'حداقل یک تصویر لازم است.' };
    }

    const product = await prisma.product.update({ where: { id: existingId }, data: productData });
    if (files.length > 0) {
      await saveProductImages({
        productId: product.id,
        files,
        alt: product.name,
        startOrder: existing._count.images,
      });
    }
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
    revalidatePath(`/products/${product.slug}`);
    return { ok: true, data: { id: product.id }, message: 'محصول به‌روزرسانی شد.' };
  } catch (error) {
    if (error instanceof ProductImageError) {
      return { ok: false, message: error.message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, message: 'اسلاگ یا SKU قبلاً استفاده شده است.' };
    }
    console.error('saveProductAction failed', error);
    return { ok: false, message: 'ذخیرهٔ محصول انجام نشد.' };
  }
}

export async function archiveProductAction(id: string): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (!guard.ok) return guard.result;
  try {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
    return { ok: true, data: undefined, message: 'محصول آرشیو شد.' };
  } catch {
    return { ok: false, message: 'آرشیو محصول انجام نشد.' };
  }
}

export async function deleteProductImageAction(id: string): Promise<void> {
  const guard = await guardAdmin();
  if (!guard.ok) return;
  try {
    await prisma.productImage.delete({ where: { id } });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
  } catch (error) {
    console.error('deleteProductImageAction failed', error);
  }
}

export async function addVariantAction(formData: FormData): Promise<void> {
  const guard = await guardAdmin();
  if (!guard.ok) return;

  const parsed = z
    .object({
      productId: z.string().min(1),
      kind: z.enum(['SIZE', 'COLOR', 'FINISH']),
      label: z.string().trim().min(1).max(40),
      stock: z.coerce.number().int().min(0).max(100_000),
      priceDelta: z.coerce.number().int().min(0).max(10_000_000).default(0),
    })
    .safeParse({
      productId: formData.get('productId'),
      kind: formData.get('kind'),
      label: formData.get('label'),
      stock: formData.get('stock'),
      priceDelta: formData.get('priceDelta') ?? 0,
    });

  if (!parsed.success) return;

  try {
    await prisma.productVariant.create({ data: parsed.data });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
  } catch (error) {
    console.error('addVariantAction failed', error);
  }
}

export async function deleteVariantAction(id: string): Promise<void> {
  const guard = await guardAdmin();
  if (!guard.ok) return;
  try {
    await prisma.productVariant.delete({ where: { id } });
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
  } catch (error) {
    console.error('deleteVariantAction failed', error);
  }
}
