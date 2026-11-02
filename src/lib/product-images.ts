import 'server-only';

import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/db';

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 6;

export class ProductImageError extends Error {}

function detectImage(buffer: Buffer): { mimeType: string; extension: string } | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { mimeType: 'image/webp', extension: 'webp' };
  }
  return null;
}

export async function saveProductImages({
  productId,
  files,
  alt,
  startOrder = 0,
}: {
  productId: string;
  files: File[];
  alt: string;
  startOrder?: number;
}): Promise<number> {
  if (files.length > MAX_IMAGES) {
    throw new ProductImageError(`حداکثر ${MAX_IMAGES} تصویر برای هر محصول مجاز است.`);
  }

  let order = startOrder;
  let count = 0;

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_BYTES) {
      throw new ProductImageError('حجم هر تصویر باید کمتر از ۴ مگابایت باشد.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectImage(buffer);
    if (!detected) {
      throw new ProductImageError('فقط تصویر JPEG، PNG یا WebP مجاز است.');
    }

    const id = randomUUID();
    const url = `/api/product-images/${id}`;
    const safeAlt = (alt || file.name || 'تصویر محصول').trim().slice(0, 160) || 'تصویر محصول';

    await prisma.$executeRaw`
      INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "width", "height", "sortOrder", "data", "mimeType")
      VALUES (${id}, ${productId}, ${url}, ${safeAlt}, 1200, 1500, ${order}, ${buffer}, ${detected.mimeType})
    `;
    order += 1;
    count += 1;
  }

  return count;
}
