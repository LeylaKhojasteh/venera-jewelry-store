export type GenderValue = 'WOMEN' | 'MEN' | 'UNISEX';
export type RoleValue = 'CUSTOMER' | 'ADMIN';
export type OrderStatusValue = 'DEMO_PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type VariantKindValue = 'SIZE' | 'COLOR' | 'FINISH';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  discount: number | null;
  image: string;
  imageAlt: string;
  hoverImage: string | null;
  hoverImageAlt: string | null;
  categoryName: string;
  categorySlug: string;
  gender: GenderValue;
  inStock: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
};

export type ProductVariantData = {
  id: string;
  kind: VariantKindValue;
  label: string;
  stock: number;
  priceDelta: number;
};

export type ProductDetailData = ProductCardData & {
  description: string;
  story: string;
  materials: string;
  care: string;
  sku: string;
  stock: number;
  tags: string[];
  images: { id: string; url: string; alt: string; width: number; height: number }[];
  variants: ProductVariantData[];
  createdAt: string;
};

export type QuickViewData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  materials: string;
  categoryName: string;
  inStock: boolean;
  stock: number;
  images: { url: string; alt: string }[];
  variants: ProductVariantData[];
};

export type CartLineData = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  stock: number;
  variantId: string | null;
  variantLabel: string | null;
  lineTotal: number;
  isActive: boolean;
  maxQuantity: number;
};

export type CartData = {
  lines: CartLineData[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  available: boolean;
  notices: string[];
};

export type GuestCartLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export type ActionResult<T = void> =
  | { ok: true; message?: string; data: T }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
      code?: string;
    };

export type ProductQueryLike = {
  q?: string;
  category?: string;
  gender?: 'women' | 'men';
  min?: number;
  max?: number;
  inStock?: unknown;
  discount?: unknown;
};

export type CategoryData = {
  id: string;
  slug: string;
  name: string;
  latinName: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  productCount: number;
};
