import 'server-only';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { totalsFor } from '@/lib/pricing';
import type { CartData, CartLineData, GuestCartLine } from '@/types';

const MAX_QTY = 20;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  images: { url: string; alt: string }[];
};

type VariantRow = { id: string; label: string; stock: number } | null;

function lineFrom(product: ProductRow, variant: VariantRow, quantity: number): CartLineData {
  const available = product.isActive ? (variant ? variant.stock : product.stock) : 0;
  const qty = Math.max(1, Math.min(quantity, Math.max(available, 1)));
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]?.url ?? '/images/products/necklace-avid-01.jpg',
    imageAlt: product.images[0]?.alt ?? product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    quantity: qty,
    stock: available,
    variantId: variant?.id ?? null,
    variantLabel: variant?.label ?? null,
    lineTotal: product.price * qty,
    isActive: product.isActive,
    maxQuantity: Math.min(MAX_QTY, Math.max(available, 0)),
  };
}

function summarize(lines: CartLineData[], notices: string[] = []): CartData {
  const sellable = lines.filter((l) => l.isActive && l.stock > 0);
  const subtotal = sellable.reduce((sum, l) => sum + l.lineTotal, 0);
  const totals = totalsFor(subtotal);
  return {
    lines,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    freeShippingRemaining:
      totals.subtotal >= env.freeShippingThreshold ? 0 : env.freeShippingThreshold - totals.subtotal,
    available: lines.some((l) => l.isActive && l.stock > 0),
    notices,
  };
}

export const emptyCart: CartData = summarize([]);

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });
}

export async function getCartForUser(userId: string): Promise<CartData> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: 'asc' },
        include: {
          product: {
            select: {
              id: true, slug: true, name: true, price: true, compareAtPrice: true,
              stock: true, isActive: true,
              images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true, alt: true } },
            },
          },
          variant: { select: { id: true, label: true, stock: true } },
        },
      },
    },
  });
  if (!cart) return emptyCart;

  const notices: string[] = [];
  const lines = cart.items.map((item) => {
    const line = lineFrom(item.product, item.variant, item.quantity);
    if (!item.product.isActive) notices.push(`«${item.product.name}» دیگر در دسترس نیست و از محاسبه حذف شد.`);
    else if (line.stock <= 0) notices.push(`«${item.product.name}» موجود نیست.`);
    else if (line.quantity !== item.quantity) notices.push(`تعداد «${item.product.name}» با موجودی فعلی هماهنگ شد.`);
    return line;
  });

  return summarize(lines, notices);
}

export async function resolveGuestCart(items: GuestCartLine[]): Promise<CartData> {
  if (items.length === 0) return emptyCart;

  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(items.map((i) => i.productId))] } },
    select: {
      id: true, slug: true, name: true, price: true, compareAtPrice: true,
      stock: true, isActive: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true, alt: true } },
      variants: { select: { id: true, label: true, stock: true } },
    },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const notices: string[] = [];
  const lines: CartLineData[] = [];
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product || !product.isActive) {
      notices.push('یکی از محصولات سبد دیگر در دسترس نیست و حذف شد.');
      continue;
    }
    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) ?? null : null;
    if (item.variantId && !variant) {
      notices.push(`گزینهٔ انتخابی «${product.name}» دیگر موجود نیست.`);
      continue;
    }
    const line = lineFrom(product, variant, item.quantity);
    if (line.stock <= 0) {
      notices.push(`«${product.name}» موجود نیست.`);
      continue;
    }
    if (line.quantity !== item.quantity) {
      notices.push(`تعداد «${product.name}» با موجودی فعلی هماهنگ شد.`);
    }
    lines.push(line);
  }

  return summarize(lines, notices);
}

export async function addItem(userId: string, productId: string, variantId: string | null, quantity: number): Promise<CartData> {
  const cart = await getOrCreateCart(userId);
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true, stock: true, variants: { select: { id: true, stock: true } } },
  });
  if (!product) throw new CartError('PRODUCT_UNAVAILABLE', 'این محصول در دسترس نیست.');

  const variant = variantId ? product.variants.find((v) => v.id === variantId) : null;
  if (variantId && !variant) throw new CartError('VARIANT_UNAVAILABLE', 'این گزینه دیگر موجود نیست.');

  const available = variant ? variant.stock : product.stock;
  if (available <= 0) throw new CartError('OUT_OF_STOCK', 'این محصول فعلاً موجود نیست.');

  const variantKey = variantId ?? '';
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId_variantKey: { cartId: cart.id, productId, variantKey } },
    select: { id: true, quantity: true },
  });
  const nextQty = Math.min(available, MAX_QTY, (existing?.quantity ?? 0) + quantity);

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: nextQty } });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, variantKey, quantity: nextQty },
    });
  }

  return getCartForUser(userId);
}

export async function updateItemQuantity(userId: string, productId: string, variantKey: string, quantity: number): Promise<CartData> {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId_variantKey: { cartId: cart.id, productId, variantKey } },
    include: { product: { select: { stock: true } }, variant: { select: { stock: true } } },
  });
  if (!item) throw new CartError('NOT_FOUND', 'این قلم در سبد پیدا نشد.');

  const available = Math.min(item.variant?.stock ?? item.product.stock, MAX_QTY);
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: Math.min(quantity, available) } });
  }
  return getCartForUser(userId);
}

export async function removeItem(userId: string, productId: string, variantKey: string): Promise<CartData> {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId, variantKey } });
  return getCartForUser(userId);
}

export async function clearCart(userId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function mergeGuestCart(userId: string, guestItems: GuestCartLine[]): Promise<CartData> {
  if (guestItems.length === 0) return getCartForUser(userId);

  const cart = await getOrCreateCart(userId);
  const notices: string[] = [];

  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(guestItems.map((i) => i.productId))] }, isActive: true },
    select: { id: true, name: true, stock: true, variants: { select: { id: true, stock: true } } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const item of guestItems) {
    const product = byId.get(item.productId);
    if (!product) {
      notices.push('یکی از اقلام مهمان در دسترس نبود و منتقل نشد.');
      continue;
    }
    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
    if (item.variantId && !variant) {
      notices.push(`گزینهٔ «${product.name}» موجود نبود و منتقل نشد.`);
      continue;
    }
    const available = variant ? variant.stock : product.stock;
    if (available <= 0) {
      notices.push(`«${product.name}» موجود نبود و منتقل نشد.`);
      continue;
    }
    const variantKey = variant?.id ?? '';
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId_variantKey: { cartId: cart.id, productId: product.id, variantKey } },
      select: { id: true, quantity: true },
    });
    const merged = Math.min(available, MAX_QTY, (existing?.quantity ?? 0) + item.quantity);
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: merged } });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: product.id, variantId: variant?.id ?? null, variantKey, quantity: merged },
      });
    }
  }

  const cartData = await getCartForUser(userId);
  return { ...cartData, notices: [...notices, ...cartData.notices] };
}

export class CartError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'CartError';
  }
}

export async function getCartCount(userId: string): Promise<number> {
  const result = await prisma.cartItem.aggregate({
    where: { cart: { userId } },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}
