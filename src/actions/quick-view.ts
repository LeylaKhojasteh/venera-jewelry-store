'use server';

import { getProductBySlug } from '@/lib/catalog';
import type { QuickViewData } from '@/types';

export async function getQuickView(slug: string): Promise<QuickViewData | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    description: product.description,
    materials: product.materials,
    categoryName: product.categoryName,
    inStock: product.inStock,
    stock: product.stock,
    images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
    variants: product.variants,
  };
}
