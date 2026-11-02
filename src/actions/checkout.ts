'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { checkoutSchema } from '@/lib/validation';
import { totalsFor } from '@/lib/pricing';
import { generateOrderNumber } from '@/lib/dates';
import { rateLimit } from '@/lib/auth/rate-limit';
import { clientIp } from '@/lib/request';
import type { ActionResult } from '@/types';

type OrderResult = { orderId: string; orderNumber: string };

class CheckoutError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

type LockedProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  compareAtPrice: number | null;
};

type LockedVariant = { id: string; label: string; stock: number; priceDelta: number };

export async function placeDemoOrderAction(input: {
  addressId: string;
  idempotencyKey: string;
  note?: string;
}): Promise<ActionResult<OrderResult>> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: 'برای ثبت سفارش باید وارد شوی.', code: 'AUTH' };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? 'اطلاعات سفارش نامعتبر است.' };
  }

  const ip = await clientIp();
  const limit = rateLimit(`order:${user.id}:${ip}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return { ok: false, message: 'ثبت سفارش‌های پیاپی محدود شده است. کمی بعد تلاش کن.', code: 'RATE_LIMITED' };
  }

  const existing = await prisma.order.findUnique({
    where: { idempotencyKey: parsed.data.idempotencyKey },
    select: { id: true, orderNumber: true, userId: true },
  });
  if (existing) {
    if (existing.userId !== user.id) {
      return { ok: false, message: 'این کلید سفارش متعلق به حساب دیگری است.', code: 'FORBIDDEN' };
    }
    return { ok: true, data: { orderId: existing.id, orderNumber: existing.orderNumber }, message: 'سفارش قبلاً ثبت شده است.' };
  }

  const address = await prisma.address.findFirst({
    where: { id: parsed.data.addressId, userId: user.id },
  });
  if (!address) {
    return { ok: false, message: 'نشانی انتخاب‌شده برای این حساب پیدا نشد.', code: 'ADDRESS_NOT_FOUND' };
  }

  const addressSnapshot = {
    recipient: address.recipient,
    phone: address.phone,
    province: address.province,
    city: address.city,
    postalCode: address.postalCode,
    street: address.street,
    label: address.label,
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    const orderNumber = generateOrderNumber();
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // Re-check idempotency inside the transaction: two concurrent submits with the
          // same key must converge on one order.
          const duplicate = await tx.order.findUnique({
            where: { idempotencyKey: parsed.data.idempotencyKey },
            select: { id: true, orderNumber: true, userId: true },
          });
          if (duplicate) {
            if (duplicate.userId !== user.id) throw new CheckoutError('FORBIDDEN', 'این کلید سفارش معتبر نیست.');
            return { orderId: duplicate.id, orderNumber: duplicate.orderNumber };
          }

          const currentCart = await tx.cart.findUnique({
            where: { userId: user.id },
            include: {
              items: {
                include: {
                  product: {
                    include: {
                      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
                    },
                  },
                  variant: true,
                },
              },
            },
          });
          if (!currentCart || currentCart.items.length === 0) {
            throw new CheckoutError('CART_EMPTY', 'سبد خرید خالی است.');
          }

          let subtotal = 0;
          const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

          // Lock every product row in a deterministic order to avoid deadlocks and
          // to prevent two checkouts from selling the same last unit.
          const ids = currentCart.items.map((i) => i.productId).sort();
          const locked = await tx.$queryRaw<LockedProduct[]>`
            SELECT id, name, slug, sku, price, stock, "isActive", "compareAtPrice"
            FROM "Product"
            WHERE id IN (${Prisma.join(ids)})
            ORDER BY id
            FOR UPDATE
          `;
          const lockedById = new Map(locked.map((p) => [p.id, p]));

          const variantIds = currentCart.items.map((i) => i.variantId).filter((v): v is string => Boolean(v));
          const lockedVariants = variantIds.length
            ? await tx.$queryRaw<LockedVariant[]>`
                SELECT id, label, stock, "priceDelta"
                FROM "ProductVariant"
                WHERE id IN (${Prisma.join(variantIds)})
                ORDER BY id
                FOR UPDATE
              `
            : [];
          const variantById = new Map(lockedVariants.map((v) => [v.id, v]));

          for (const item of currentCart.items) {
            const product = lockedById.get(item.productId);
            if (!product || !product.isActive) {
              throw new CheckoutError('UNAVAILABLE', `«${item.product.name}» دیگر در دسترس نیست.`);
            }
            if (item.quantity <= 0) continue;

            let unitPrice = product.price;
            let variantLabel: string | null = null;

            if (item.variantId) {
              const variant = variantById.get(item.variantId);
              if (!variant) throw new CheckoutError('UNAVAILABLE', `گزینهٔ «${product.name}» دیگر موجود نیست.`);
              if (variant.stock < item.quantity) {
                throw new CheckoutError('OUT_OF_STOCK', `موجودی «${product.name}» با این گزینه کافی نیست.`);
              }
              unitPrice += variant.priceDelta;
              variantLabel = variant.label;
            }

            if (product.stock < item.quantity) {
              throw new CheckoutError('OUT_OF_STOCK', `موجودی «${product.name}» کافی نیست.`);
            }

            const lineTotal = unitPrice * item.quantity;
            subtotal += lineTotal;
            orderItems.push({
              product: { connect: { id: product.id } },
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              variantLabel,
              unitPrice,
              quantity: item.quantity,
              lineTotal,
              imageUrl: item.product.images[0]?.url ?? '/images/products/necklace-drop-01.jpg',
            });

            await tx.product.update({
              where: { id: product.id },
              data: { stock: { decrement: item.quantity } },
            });
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }

          if (orderItems.length === 0) {
            throw new CheckoutError('CART_EMPTY', 'سبد خرید خالی است.');
          }

          const totals = totalsFor(subtotal);

          const order = await tx.order.create({
            data: {
              orderNumber,
              userId: user.id,
              status: 'DEMO_PLACED',
              subtotal: totals.subtotal,
              shipping: totals.shipping,
              total: totals.total,
              address: addressSnapshot,
              idempotencyKey: parsed.data.idempotencyKey,
              note: parsed.data.note?.trim() || null,
              items: { create: orderItems },
            },
            select: { id: true, orderNumber: true },
          });

          await tx.cartItem.deleteMany({ where: { cartId: currentCart.id } });

          return { orderId: order.id, orderNumber: order.orderNumber };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 20_000 },
      );

      revalidatePath('/', 'layout');
      revalidatePath('/cart');
      revalidatePath('/profile/orders');
      revalidatePath('/checkout');
      return { ok: true, data: result, message: 'سفارش ثبت شد.' };
    } catch (error) {
      if (error instanceof CheckoutError) {
        return { ok: false, message: error.message, code: error.code };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = Array.isArray(error.meta?.target) ? (error.meta?.target as string[]) : [];
          if (target.includes('idempotencyKey')) {
            const duplicate = await prisma.order.findUnique({
              where: { idempotencyKey: parsed.data.idempotencyKey },
              select: { id: true, orderNumber: true, userId: true },
            });
            if (duplicate && duplicate.userId === user.id) {
              return { ok: true, data: { orderId: duplicate.id, orderNumber: duplicate.orderNumber } };
            }
          }
          if (target.includes('orderNumber') && attempt === 0) continue;
        }
        if (error.code === 'P2034' && attempt === 0) continue;
      }
      console.error('placeDemoOrderAction failed', error);
      return { ok: false, message: 'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کن.', code: 'ORDER_FAILED' };
    }
  }

  return { ok: false, message: 'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کن.', code: 'ORDER_FAILED' };
}
