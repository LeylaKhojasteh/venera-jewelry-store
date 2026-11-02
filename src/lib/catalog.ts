import 'server-only';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { PAGE_SIZE } from '@/lib/constants';
import { discountPercent } from '@/lib/money';
import { normalizePersian } from '@/lib/persian';
import type {
  CategoryData,
  ProductCardData,
  ProductDetailData,
  ProductQueryLike,
} from '@/types';

export type { ProductQueryLike };

const cardInclude = {
  category: { select: { name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' }, take: 2 },
  _count: { select: { variants: true } },
} satisfies Prisma.ProductInclude;

type CardPayload = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

function toCard(product: CardPayload): ProductCardData {
  const [primary, secondary] = product.images;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discount: discountPercent(product.price, product.compareAtPrice),
    image: primary?.url ?? '/images/products/necklace-avid-01.jpg',
    imageAlt: primary?.alt ?? product.name,
    hoverImage: secondary?.url ?? null,
    hoverImageAlt: secondary?.alt ?? null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    gender: product.gender,
    inStock: product.stock > 0,
    isBestSeller: product.isBestSeller,
    isFeatured: product.isFeatured,
    hasVariants: product._count.variants > 0,
  };
}

export function buildProductWhere(query: ProductQueryLike): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];
  const q = query.q ? normalizePersian(query.q) : '';

  if (q) {
    and.push({ name: { contains: q, mode: 'insensitive' } });
  }
  if (query.category) and.push({ category: { slug: query.category } });
  if (query.gender) {
    and.push({ gender: { in: [query.gender === 'women' ? 'WOMEN' : 'MEN', 'UNISEX'] } });
  }
  if (query.min !== undefined || query.max !== undefined) {
    and.push({ price: { gte: query.min, lte: query.max } });
  }
  if (query.inStock) and.push({ stock: { gt: 0 } });
  if (query.discount) and.push({ compareAtPrice: { not: null } });

  return { isActive: true, AND: and };
}

function orderByFor(sort: string | undefined): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'price-asc':
      return [{ price: 'asc' }, { createdAt: 'desc' }];
    case 'price-desc':
      return [{ price: 'desc' }, { createdAt: 'desc' }];
    case 'bestseller':
      return [{ isBestSeller: 'desc' }, { createdAt: 'desc' }];
    case 'discount':
      return [{ compareAtPrice: 'desc' }, { createdAt: 'desc' }];
    default:
      return [{ createdAt: 'desc' }];
  }
}

export type CatalogResult = {
  items: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
};

export async function getCatalog(query: ProductQueryLike & { sort?: string; page?: number }): Promise<CatalogResult> {
  const where = buildProductWhere(query);
  const page = Math.max(1, query.page ?? 1);

  // Discount percentage cannot be ordered in Prisma, so this one sort is resolved
  // over the filtered id set (demo catalogue scale). Everything else is DB-ordered.
  if (query.sort === 'discount') {
    const rows = await prisma.product.findMany({
      where,
      select: { id: true, price: true, compareAtPrice: true, createdAt: true },
    });
    rows.sort((a, b) => {
      const da = discountPercent(a.price, a.compareAtPrice) ?? 0;
      const db = discountPercent(b.price, b.compareAtPrice) ?? 0;
      return db - da || b.createdAt.getTime() - a.createdAt.getTime();
    });
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const found = await prisma.product.findMany({
      where: { id: { in: slice.map((r) => r.id) } },
      include: cardInclude,
    });
    const byId = new Map(found.map((p) => [p.id, p]));
    const items = slice.map((r) => byId.get(r.id)).filter((p): p is CardPayload => Boolean(p)).map(toCard);
    return { items, total: rows.length, page, pageCount };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: cardInclude,
      orderBy: orderByFor(query.sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    items: products.map(toCard),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getProductCards(options: {
  where?: Prisma.ProductWhereInput;
  take?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput[];
}): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, ...options.where },
    include: cardInclude,
    orderBy: options.orderBy ?? [{ createdAt: 'desc' }],
    take: options.take ?? 8,
  });
  return products.map(toCard);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { variants: true } },
    },
  });
  if (!product) return null;

  const base = toCard(product);  return {
    ...base,
    description: product.description,
    story: product.story,
    materials: product.materials,
    care: product.care,
    sku: product.sku,
    stock: product.stock,
    tags: product.tags,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      kind: v.kind,
      label: v.label,
      stock: v.stock,
      priceDelta: v.priceDelta,
    })),
    createdAt: product.createdAt.toISOString(),
  };
}

export async function getRelatedProducts(product: ProductDetailData, take = 4): Promise<ProductCardData[]> {
  const sameCategory = await getProductCards({
    where: { category: { slug: product.categorySlug }, id: { not: product.id } },
    take,
  });
  if (sameCategory.length >= take) return sameCategory;

  const fill = await getProductCards({
    where: { id: { notIn: [product.id, ...sameCategory.map((p) => p.id)] } },
    take: take - sameCategory.length,
  });
  return [...sameCategory, ...fill];
}

export async function getCategories(): Promise<CategoryData[]> {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    latinName: c.latinName,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    imageAlt: c.imageAlt,
    productCount: c._count.products,
  }));
}

export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const bounds = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });
  return { min: bounds._min.price ?? 0, max: bounds._max.price ?? 0 };
}

export async function getHomeContent() {
  const [categories, bestSellerRows, discounted, featured] = await Promise.all([
    getCategories(),
    getProductCards({
      where: { isBestSeller: true },
      take: 8,
      orderBy: [{ createdAt: 'desc' }],
    }),
    getProductCards({
      where: { compareAtPrice: { not: null } },
      take: 4,
      orderBy: [{ createdAt: 'desc' }],
    }),
    getProductCards({ where: { isFeatured: true }, take: 2 }),
  ]);

  let bestSellers = bestSellerRows;
  if (bestSellers.length < 4) {
    const fallback = await getProductCards({ take: 8 });
    const seen = new Set(bestSellers.map((p) => p.id));
    bestSellers = [...bestSellers, ...fallback.filter((p) => !seen.has(p.id))];
  }

  let saleItems = discounted;
  if (saleItems.length < 4) {
    const fallback = await getProductCards({ take: 8 });
    const seen = new Set(saleItems.map((p) => p.id));
    saleItems = [...saleItems, ...fallback.filter((p) => !seen.has(p.id))];
  }

  return { categories, bestSellers, discounted: saleItems, featured };
}
