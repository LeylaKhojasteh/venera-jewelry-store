export const site = {
  name: 'Venera',
  faName: 'ونرا',
  logotype: 'VENERA',
  tagline: 'جزئیاتی که با تو می‌مانند',
  description:
    'ونرا؛ زیورآلات ظریف زنانه و مردانه با طراحی معاصر. گردنبند، دستبند، گوشواره و انگشتر برای لحظه‌هایی که می‌مانند.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'fa_IR',
} as const;

/** Contact details used by the storefront; replace them with the real atelier details. */
export const demoContact = {
  email: 'hello@venera.example',
  phone: '۰۲۱ ۰۰۰ ۰۰ ۰۰',
  phoneRaw: '02100000000',
  address: 'تهران، خیابان ولی‌عصر، پلاک ۰۰۰',
} as const;

export const mainNav = [
  { href: '/', label: 'خانه' },
  { href: '/products', label: 'محصولات' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
] as const;

export const categoryNav = [
  { slug: 'necklace', name: 'گردنبند', latin: 'Necklaces' },
  { slug: 'bracelet', name: 'دستبند', latin: 'Bracelets' },
  { slug: 'earrings', name: 'گوشواره', latin: 'Earrings' },
  { slug: 'ring', name: 'انگشتر', latin: 'Rings' },
] as const;

export const genderNav = [
  { slug: 'women', name: 'زنانه', latin: 'Women' },
  { slug: 'men', name: 'مردانه', latin: 'Men' },
] as const;

export const sortOptions = [
  { value: 'latest', label: 'تازه‌ترین‌ها' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'bestseller', label: 'پرفروش‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
] as const;

export type SortValue = (typeof sortOptions)[number]['value'];

export const PAGE_SIZE = 9;

export const provinces = [
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'اصفهان',
  'البرز',
  'ایلام',
  'بوشهر',
  'تهران',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان رضوی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'فارس',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد',
] as const;

export const orderStatusLabels: Record<string, string> = {
  DEMO_PLACED: 'ثبت شده',
  PROCESSING: 'در حال آماده‌سازی',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
};

export const contactStatusLabels: Record<string, string> = {
  NEW: 'جدید',
  READ: 'خوانده‌شده',
  ARCHIVED: 'بایگانی',
};

export const genderLabels: Record<string, string> = {
  WOMEN: 'زنانه',
  MEN: 'مردانه',
  UNISEX: 'مشترک',
};

export const emptyCartMessage = 'هنوز چیزی به سبدت اضافه نکردی.';
export const emptyOrdersMessage =
  'هنوز سفارشی ثبت نکردی؛ شاید انتخاب بعدی همین‌جا منتظر تو باشد.';
