import { z } from 'zod';
import { provinces, sortOptions } from '@/lib/constants';
import {
  isValidIranMobile,
  isValidPostalCode,
  normalizeEmail,
  normalizeMobile,
  normalizePersian,
  toEnglishDigits,
} from '@/lib/persian';

const name = z
  .string()
  .transform((v) => normalizePersian(v))
  .pipe(z.string().min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.').max(60, 'نام طولانی است.'));

const email = z
  .string()
  .transform((v) => normalizeEmail(v))
  .pipe(z.email('یک ایمیل معتبر وارد کن.').max(120, 'ایمیل طولانی است.'));

const password = z
  .string()
  .min(8, 'گذرواژه باید حداقل ۸ کاراکتر باشد.')
  .max(72, 'گذرواژه طولانی است.')
  .regex(/[A-Za-z]/, 'گذرواژه باید حداقل یک حرف لاتین داشته باشد.')
  .regex(/\d/, 'گذرواژه باید حداقل یک رقم داشته باشد.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'گذرواژه را وارد کن.').max(72, 'گذرواژه طولانی است.'),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(32, 'پیوند بازیابی معتبر نیست.').max(200),
    password,
    confirmPassword: z.string().min(1, 'تکرار گذرواژه را وارد کن.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'گذرواژه و تکرارش یکی نیستند.',
    path: ['confirmPassword'],
  });

export const registerSchema = z
  .object({
    name,
    email,
    password,
    confirmPassword: z.string().min(1, 'تکرار گذرواژه را وارد کن.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'گذرواژه‌ها یکسان نیستند.',
  });

export const addressSchema = z.object({
  recipient: name,
  phone: z
    .string()
    .transform((v) => normalizeMobile(v))
    .refine(isValidIranMobile, 'شمارهٔ همراه باید ۱۱ رقم و با ۰۹ شروع شود.'),
  province: z.enum(provinces, { message: 'استان را انتخاب کن.' }),
  city: z
    .string()
    .transform((v) => normalizePersian(v))
    .pipe(z.string().min(2, 'نام شهر را وارد کن.').max(40, 'نام شهر طولانی است.')),
  postalCode: z
    .string()
    .transform((v) => toEnglishDigits(v).replace(/\s|-/g, ''))
    .refine(isValidPostalCode, 'کد پستی باید ۱۰ رقم باشد.'),
  street: z
    .string()
    .transform((v) => normalizePersian(v))
    .pipe(z.string().min(10, 'نشانی کامل‌تری بنویس (حداقل ۱۰ کاراکتر).').max(300, 'نشانی طولانی است.')),
  label: z
    .string()
    .transform((v) => normalizePersian(v))
    .pipe(z.string().max(24, 'برچسب حداکثر ۲۴ کاراکتر است.'))
    .optional()
    .or(z.literal('').transform(() => undefined)),
  isDefault: z.boolean().optional().default(false),
});

export const addressIdSchema = z.string().min(1, 'نشانی را انتخاب کن.');

export const contactSchema = z.object({
  name,
  email,
  subject: z
    .string()
    .transform((v) => normalizePersian(v))
    .pipe(z.string().min(3, 'موضوع را بنویس.').max(120, 'موضوع طولانی است.')),
  message: z
    .string()
    .transform((v) => normalizePersian(v))
    .pipe(z.string().min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد.').max(2000, 'پیام حداکثر ۲۰۰۰ کاراکتر است.')),
  // Honeypot: real visitors leave this empty.
  company: z.string().max(0).optional().or(z.literal('')),
  startedAt: z.coerce.number().optional(),
});

export const cartLineInputSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
});

export const guestCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).nullable().optional(),
        quantity: z.coerce.number().int().min(1).max(20),
      }),
    )
    .max(50),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'نشانی ارسال را انتخاب کن.'),
  idempotencyKey: z.uuid('کلید یکتای سفارش معتبر نیست.'),
  note: z.string().max(400, 'یادداشت طولانی است.').optional(),
});

export const productQuerySchema = z.object({
  q: z.string().max(80).optional().catch(undefined),
  category: z.string().max(40).optional().catch(undefined),
  gender: z.enum(['women', 'men']).optional().catch(undefined),
  min: z.coerce.number().int().min(0).max(1_000_000_000).optional().catch(undefined),
  max: z.coerce.number().int().min(0).max(1_000_000_000).optional().catch(undefined),
  inStock: z
    .union([z.literal('1'), z.literal('true'), z.literal('on')])
    .optional()
    .catch(undefined),
  discount: z
    .union([z.literal('1'), z.literal('true'), z.literal('on')])
    .optional()
    .catch(undefined),
  sort: z.enum(sortOptions.map((o) => o.value) as [string, ...string[]]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(999).optional().catch(1),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const adminProductSchema = z.object({
  id: z.string().min(1),
  price: z.coerce.number().int().min(0).max(1_000_000_000),
  compareAtPrice: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : Number(value)),
    z.number().int().min(0).max(1_000_000_000).nullable(),
  ),
  stock: z.coerce.number().int().min(0).max(100_000),
  isActive: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
});

export const adminOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['DEMO_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const adminContactStatusSchema = z.object({
  messageId: z.string().min(1),
  status: z.enum(['NEW', 'READ', 'ARCHIVED']),
});
