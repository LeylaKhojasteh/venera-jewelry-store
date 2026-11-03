/**
 * Venera seed — idempotent.
 *
 * Run with: npx tsx prisma/seed.ts
 * Re-running updates the same rows (matched by slug / email) and never duplicates them.
 */
import 'dotenv/config';
import { PrismaClient, type Gender, type VariantKind } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'necklace',
    name: 'گردنبند',
    latinName: 'Necklaces',
    tagline: 'نزدیک به گلو، نزدیک به تو',
    description:
      'زنجیرهایی که خط گردن را دنبال می‌کنند؛ از زنجیرهای نازک روزمره تا آویزهای سنگین‌تر برای شب.',
    image: '/images/categories/necklace.jpg',
    imageAlt: 'گردنبند مرواریدی روی زمینهٔ روشن',
    sortOrder: 1,
  },
  {
    slug: 'bracelet',
    name: 'دستبند',
    latinName: 'Bracelets',
    tagline: 'وزنی آرام روی مچ',
    description:
      'دستبندهای زنجیری و بافته با بست‌های ساده؛ طراحی‌شده برای ماندن روی مچ، نه برای تکان‌خوردن.',
    image: '/images/categories/bracelet.jpg',
    imageAlt: 'دستبند طلا روی زمینهٔ روشن',
    sortOrder: 2,
  },
  {
    slug: 'earrings',
    name: 'گوشواره',
    latinName: 'Earrings',
    tagline: 'جزئیاتی در قاب صورت',
    description:
      'حلقه‌ها و آویزهای سبک که با حرکت سر زنده می‌شوند و در عکس‌ها، قاب صورت را کامل می‌کنند.',
    image: '/images/categories/earrings.jpg',
    imageAlt: 'گوشوارهٔ طلا روی زمینهٔ روشن',
    sortOrder: 3,
  },
  {
    slug: 'ring',
    name: 'انگشتر',
    latinName: 'Rings',
    tagline: 'امضایی کوچک',
    description:
      'انگشترهای ساده و نگین‌دار با اندازه‌های مشخص؛ چیزی که هر روز می‌پوشی و کم‌کم بخشی از دستت می‌شود.',
    image: '/images/categories/ring.jpg',
    imageAlt: 'انگشتر طلا با نگین روی زمینهٔ روشن',
    sortOrder: 4,
  },
];

type SeedVariant = { kind: VariantKind; label: string; stock: number };

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  gender: Gender;
  price: number;
  compareAtPrice?: number;
  sku: string;
  description: string;
  story: string;
  materials: string;
  care: string;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  images: { file: string; alt: string }[];
  variants?: SeedVariant[];
};

const care =
  'از تماس با عطر، مواد شیمیایی و آب کلر پرهیز کن. پس از هر بار استفاده با پارچهٔ نرم و خشک پاک کن و جدا از آیتم‌ها دیگر نگه دار.';

const products: SeedProduct[] = [
  {
    slug: 'necklace-drop',
    name: 'گردنبند قطره',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_290_000,
    compareAtPrice: 1_850_000,
    sku: 'VNR-NC-001',
    description: 'آویز قطره‌ای روی زنجیر نازک؛ طولش طوری گرفته شده که روی گودی گردن بنشیند.',
    story: 'قطره با حرکت بدن آرام تاب می‌خورد؛ زنجیر را نازک نگه داشتیم تا وزن آویز آن را به جلو نکشد.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 14,
    isFeatured: true,
    tags: ['قطره\u200cای', 'استیل', 'هدیه'],
    images: [
      { file: 'necklace-drop-01.jpg', alt: 'گردنبند قطره؛ آویز قطره‌ای روی زنجیر استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۰ سانتی‌متر', stock: 5 },
      { kind: 'SIZE', label: '۴۵ سانتی‌متر', stock: 6 },
      { kind: 'SIZE', label: '۵۰ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'necklace-pearl',
    name: 'گردنبند مرواریدی',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_890_000,
    sku: 'VNR-NC-002',
    description: 'ردیفی از مرواریدهای ریز روی زنجیر نازک؛ درخششی نرم و مات برای لباس‌های ساده.',
    story: 'مرواریدها هم‌اندازه و هم‌فاصله انتخاب شدند تا خط گردن تمیز و یکدست دیده شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 9,
    isBestSeller: true,
    tags: ['مروارید', 'استیل', 'مهمانی'],
    images: [
      { file: 'necklace-pearl-01.jpg', alt: 'گردنبند مرواریدی؛ ردیف مرواریدهای ریز روی زنجیر' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۲ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۴۷ سانتی‌متر', stock: 5 },
    ],
  },
  {
    slug: 'necklace-minimal',
    name: 'گردنبند مینیمال',
    category: 'necklace',
    gender: 'WOMEN',
    price: 990_000,
    sku: 'VNR-NC-003',
    description: 'زنجیر باریک و یکدست با بست ساده؛ فقط یک خط فلز روی گردن.',
    story: 'ساده‌ترین آیتم مجموعه؛ سطح مات انتخاب شد تا خط‌وخش روزمره کمتر دیده شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 7,
    isBestSeller: true,
    tags: ['مینیمال', 'استیل', 'روزمره'],
    images: [
      { file: 'necklace-minimal-01.jpg', alt: 'گردنبند مینیمال؛ زنجیر باریک استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۰ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۵۵ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'necklace-flower',
    name: 'گردنبند گل',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_690_000,
    sku: 'VNR-NC-004',
    description: 'گل‌های ریز در امتداد زنجیر؛ از دور ساده و از نزدیک بافت‌دار.',
    story: 'نقش گل را ساده کردیم تا تکراری و سبک بماند؛ فاصلهٔ گل‌ها روی گردن یکنواخت است.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 8,
    isBestSeller: true,
    tags: ['گل', 'استیل', 'ظریف'],
    images: [
      { file: 'necklace-flower-01.jpg', alt: 'گردنبند گل؛ گل‌های ریز روی زنجیر استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۲ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۴۷ سانتی‌متر', stock: 4 },
    ],
  },
  {
    slug: 'necklace-vintage',
    name: 'گردنبند وینتیج',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_990_000,
    sku: 'VNR-NC-005',
    description: 'زنجیر وینتیج با حلقه‌های ریز و آویز قدیمی؛ برای روزهایی که یک اکسسوری با شخصیت می‌خواهی.',
    story: 'وینتیج از یک آویز قدیمی شروع شد؛ فرمی که با زنجیر نازک امروزی ترکیب شد تا سنگین به نظر نرسد.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 11,
    tags: ['وینتیج', 'استیل', 'گردنبند'],
    images: [
      { file: 'necklace-vintage-01.jpg', alt: 'گردنبند وینتیج؛ زنجیر ریز با آویز قدیمی' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۵ سانتی‌متر', stock: 5 },
      { kind: 'SIZE', label: '۵۰ سانتی‌متر', stock: 6 },
    ],
  },
  {
    slug: 'bracelet-spiral-silver',
    name: 'دستبند حلزونی نقره‌ای',
    category: 'bracelet',
    gender: 'WOMEN',
    price: 1_150_000,
    sku: 'VNR-BR-001',
    description: 'دستبند حلزونی با حلقه‌های ریز و بست قفل‌شو؛ سبک و متحرک روی مچ.',
    story: 'حلقه‌ها کوچک‌ترند تا دستبند سنگین نشود؛ بست طوری ساخته شد که با یک دست هم بسته شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 18,
    isFeatured: true,
    tags: ['حلزونی', 'نقره\u200cای', 'روزمره'],
    images: [
      { file: 'bracelet-spiral-silver-01.jpg', alt: 'دستبند حلزونی نقره‌ای؛ حلقه‌های ریز پیوسته' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۶ سانتی‌متر', stock: 6 },
      { kind: 'SIZE', label: 'مچ ۱۷ سانتی‌متر', stock: 7 },
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 5 },
    ],
  },
  {
    slug: 'bracelet-triple-ring',
    name: 'دستبند حلقه سه‌تایی',
    category: 'bracelet',
    gender: 'MEN',
    price: 1_490_000,
    sku: 'VNR-BR-002',
    description: 'سه حلقهٔ درهم با سطح صیقلی؛ ساده و قابل استفادهٔ روزمره.',
    story: 'سه حلقه با ضخامت‌های کمی متفاوت چیده شدند تا کنار هم یک فرم واحد بسازند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 11,
    isBestSeller: true,
    tags: ['مردانه', 'حلقه', 'روزمره'],
    images: [
      { file: 'bracelet-triple-ring-01.jpg', alt: 'دستبند حلقه سه‌تایی؛ سه حلقهٔ درهم استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: 'مچ ۱۹ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: 'مچ ۲۰ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'bracelet-silver-simple',
    name: 'دستبند نقره‌ای ساده',
    category: 'bracelet',
    gender: 'MEN',
    price: 850_000,
    sku: 'VNR-BR-003',
    description: 'نوار باریک نقره‌ای با سطح مات؛ کم‌ترین جزئیات برای هر روز.',
    story: 'ساده‌ترین آیتم مجموعه؛ انتهای نوار گرد شد و سطح مات ماند تا خط‌وخش کمتر دیده شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 5,
    tags: ['مردانه', 'مینیمال', 'مات'],
    images: [
      { file: 'bracelet-silver-simple-01.jpg', alt: 'دستبند نقره‌ای ساده؛ نوار باریک مات' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 3 },
      { kind: 'SIZE', label: 'مچ ۱۹ سانتی‌متر', stock: 2 },
    ],
  },
  {
    slug: 'bracelet-colorful',
    name: 'دستبند اویز رنگی',
    category: 'bracelet',
    gender: 'WOMEN',
    price: 750_000,
    compareAtPrice: 1_070_000,
    sku: 'VNR-BR-004',
    description: 'چهار اویز رنگی روی زنجیر نازک؛ نقطهٔ رنگی آرام برای استایل روزمره.',
    story: 'رنگ‌ها را کم و مات انتخاب کردیم تا دستبند شلوغ نشود و در کنار بقیهٔ آیتم‌ها بنشیند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 13,
    tags: ['رنگی', 'اویز', 'استیل'],
    images: [
      { file: 'bracelet-colorful-01.jpg', alt: 'دستبند اویز رنگی؛ چهار اویز کوچک روی زنجیر' },
    ],
    variants: [
      { kind: 'SIZE', label: '۱۶ سانتی‌متر', stock: 7 },
      { kind: 'SIZE', label: '۱۸ سانتی‌متر', stock: 6 },
    ],
  },
  {
    slug: 'bracelet-double-chain',
    name: 'دستبند زنجیر دوتایی',
    category: 'bracelet',
    gender: 'WOMEN',
    price: 1_250_000,
    sku: 'VNR-BR-005',
    description: 'دو زنجیر نازک که کنار هم می‌چرخند؛ ساده، اما با حرکت دست زنده می‌شود.',
    story: 'فاصلهٔ دو زنجیر را طوری تنظیم کردیم که روی مچ گره نخورند و همیشه یک خط تمیز بمانند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 9,
    tags: ['زنجیر', 'دوتایی', 'استیل'],
    images: [
      { file: 'bracelet-double-chain-01.jpg', alt: 'دستبند زنجیر دوتایی؛ دو زنجیر نازک کنار هم' },
    ],
    variants: [
      { kind: 'SIZE', label: '۱۶ سانتی‌متر', stock: 5 },
      { kind: 'SIZE', label: '۱۸ سانتی‌متر', stock: 4 },
    ],
  },
  {
    slug: 'bracelet-gold-simple',
    name: 'دستبند طلایی ساده',
    category: 'bracelet',
    gender: 'WOMEN',
    price: 590_000,
    sku: 'VNR-BR-006',
    description: 'نوار باریک طلایی با سطح مات؛ سبک‌ترین دستبند این کالکشن برای استفادهٔ هر روز.',
    story: 'برای شروع روز ساخته شد: سبک، بدون سنگ و با بستی که خودش را نشان نمی‌دهد.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 16,
    tags: ['طلایی', 'ساده', 'روزمره'],
    images: [
      { file: 'bracelet-gold-simple-01.jpg', alt: 'دستبند طلایی ساده؛ نوار باریک مات' },
    ],
    variants: [
      { kind: 'SIZE', label: '۱۶ سانتی‌متر', stock: 9 },
      { kind: 'SIZE', label: '۱۸ سانتی‌متر', stock: 7 },
    ],
  },
  {
    slug: 'earrings-clear-flower',
    name: 'گوشواره گل شفاف',
    category: 'earrings',
    gender: 'WOMEN',
    price: 690_000,
    compareAtPrice: 1_150_000,
    sku: 'VNR-ER-001',
    description: 'گل شفاف با گلبرگ‌های کوچک؛ درخشش سبک روی گوش.',
    story: 'گلبرگ‌ها را نازک و کمی نامتقارن ساختیم تا گوشواره با حرکت سر زنده بماند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 16,
    tags: ['گل', 'شفاف', 'هدیه'],
    images: [
      { file: 'earrings-clear-flower-01.jpg', alt: 'گوشواره گل شفاف؛ گلبرگ‌های کوچک روی فلز' },
    ],
  },
  {
    slug: 'earrings-lotus',
    name: 'گوشواره نیلوفری',
    category: 'earrings',
    gender: 'WOMEN',
    price: 950_000,
    sku: 'VNR-ER-002',
    description: 'فرم نیلوفری با لبه‌های گرد؛ ساده و کمی مجسمه‌وار.',
    story: 'نیلوفر را از یک فرم ساده شروع کردیم و لبه‌ها را گرد نگه داشتیم تا روی پوست راحت باشد.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 13,
    isBestSeller: true,
    tags: ['نیلوفری', 'استیل', 'مهمانی'],
    images: [
      { file: 'earrings-lotus-01.jpg', alt: 'گوشواره نیلوفری؛ فرم گرد و مجسمه‌وار' },
    ],
  },
  {
    slug: 'earrings-triple-hoop',
    name: 'گوشواره حلقه سه‌تایی',
    category: 'earrings',
    gender: 'WOMEN',
    price: 640_000,
    sku: 'VNR-ER-003',
    description: 'سه حلقهٔ هم‌مرکز با اندازه‌های متفاوت؛ سبک و متحرک روی گوش.',
    story: 'حلقه‌ها را از کوچک به بزرگ چیدیم تا گوشواره از روبه‌رو عمق پیدا کند، بدون اینکه سنگین شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 12,
    tags: ['حلقه', 'سه\u200cتایی', 'استیل'],
    images: [
      { file: 'earrings-triple-hoop-01.jpg', alt: 'گوشواره حلقه سه‌تایی؛ سه حلقهٔ هم‌مرکز' },
    ],
  },
  {
    slug: 'earrings-heart',
    name: 'گوشواره قلبی',
    category: 'earrings',
    gender: 'WOMEN',
    price: 720_000,
    sku: 'VNR-ER-004',
    description: 'قلب کوچک آویز با لبهٔ گرد؛ هدیه‌ای ساده و قابل استفادهٔ روزمره.',
    story: 'قلب را کوچک و بدون برش تیز نگه داشتیم تا در استفادهٔ طولانی راحت باشد.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 10,
    tags: ['قلب', 'هدیه', 'استیل'],
    images: [
      { file: 'earrings-heart-01.jpg', alt: 'گوشواره قلبی؛ آویز قلب کوچک' },
    ],
  },
  {
    slug: 'earrings-square',
    name: 'گوشواره مربعی',
    category: 'earrings',
    gender: 'WOMEN',
    price: 580_000,
    sku: 'VNR-ER-005',
    description: 'مربع مینیمال با گوشه‌های گرد؛ کمی هندسی و کمی نرم.',
    story: 'فرم مربع را با گوشه‌های گرد انتخاب کردیم تا هم مدرن باشد هم روی پوست راحت بنشیند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 15,
    tags: ['مربع', 'مینیمال', 'استیل'],
    images: [
      { file: 'earrings-square-01.jpg', alt: 'گوشواره مربعی؛ فرم هندسی با گوشه‌های گرد' },
    ],
  },
  {
    slug: 'earrings-butterfly',
    name: 'گوشواره پروانه اویزی',
    category: 'earrings',
    gender: 'WOMEN',
    price: 880_000,
    sku: 'VNR-ER-006',
    description: 'پروانهٔ اویزی با بال‌های نازک؛ برای مهمانی‌های کوچک و استایل‌های دخترانه.',
    story: 'بال‌ها را نازک و کمی نامتقارن ساختیم تا با حرکت سر، طبیعی تکان بخورند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 8,
    tags: ['پروانه', 'اویز', 'مهمانی'],
    images: [
      { file: 'earrings-butterfly-01.jpg', alt: 'گوشواره پروانه اویزی؛ بال‌های نازک' },
    ],
  },
  {
    slug: 'ring-turquoise',
    name: 'انگشتر فیروزه‌ای',
    category: 'ring',
    gender: 'WOMEN',
    price: 1_390_000,
    compareAtPrice: 1_990_000,
    sku: 'VNR-RG-001',
    description: 'نگین فیروزه‌ای با برش گرد روی شاخه‌های باریک؛ نقطهٔ رنگی آرام.',
    story: 'نگین را گرد و کم‌ارتفاع انتخاب کردیم تا انگشتر در استفادهٔ روزمره گیر نکند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 8,
    tags: ['فیروزه\u200cای', 'نگین', 'استیل'],
    images: [
      { file: 'ring-turquoise-01.jpg', alt: 'انگشتر فیروزه‌ای؛ نگین گرد روی شاخهٔ باریک' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۲', stock: 2 },
      { kind: 'SIZE', label: '۵۴', stock: 3 },
      { kind: 'SIZE', label: '۵۶', stock: 3 },
    ],
  },
  {
    slug: 'ring-royal-double',
    name: 'انگشتر دوتایی رویال',
    category: 'ring',
    gender: 'MEN',
    price: 1_790_000,
    sku: 'VNR-RG-002',
    description: 'دو حلقهٔ درهم با سطح تیره و خطوط ساده؛ امضایی کوچک روی دست.',
    story: 'دو حلقه را با فاصلهٔ کم روی هم سوار کردیم تا فرم رویال دیده شود، بدون اینکه ضخیم شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 6,
    isBestSeller: true,
    tags: ['مردانه', 'دوتایی', 'استیل'],
    images: [
      { file: 'ring-royal-double-01.jpg', alt: 'انگشتر دوتایی رویال؛ دو حلقهٔ درهم تیره' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۲', stock: 2 },
      { kind: 'SIZE', label: '۵۴', stock: 2 },
      { kind: 'SIZE', label: '۵۶', stock: 2 },
    ],
  },
  {
    slug: 'ring-set-triple-silver',
    name: 'ست سه‌تایی نقره‌ای',
    category: 'ring',
    gender: 'WOMEN',
    price: 1_590_000,
    sku: 'VNR-RG-003',
    description: 'سه انگشتر نازک نقره‌ای که با هم یا جدا استفاده می‌شوند.',
    story: 'سه حلقه را با ضخامت‌های کمی متفاوت چیدیم تا کنار هم شبیه یک ست ساخته‌شده دیده شوند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 7,
    tags: ['ست', 'نقره\u200cای', 'سه\u200cتایی'],
    images: [
      { file: 'ring-set-triple-silver-01.jpg', alt: 'ست سه‌تایی نقره‌ای؛ سه انگشتر نازک' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۲', stock: 3 },
      { kind: 'SIZE', label: '۵۴', stock: 2 },
      { kind: 'SIZE', label: '۵۶', stock: 2 },
    ],
  },
  {
    slug: 'ring-set-six-gold',
    name: 'ست شش‌تایی مینیمال طلایی',
    category: 'ring',
    gender: 'WOMEN',
    price: 2_450_000,
    sku: 'VNR-RG-004',
    description: 'شش انگشتر مینیمال طلایی برای ترکیب‌های روزانه؛ ساده و قابل تعویض.',
    story: 'این ست برای کسانی است که دوست دارند هر روز یک ترکیب تازه بسازند؛ شش حلقه، شش حالت.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 5,
    isFeatured: true,
    tags: ['ست', 'طلایی', 'مینیمال'],
    images: [
      { file: 'ring-set-six-gold-01.jpg', alt: 'ست شش‌تایی مینیمال طلایی؛ شش انگشتر نازک' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۲', stock: 2 },
      { kind: 'SIZE', label: '۵۴', stock: 2 },
      { kind: 'SIZE', label: '۵۶', stock: 1 },
    ],
  },
  {
    slug: 'ring-set-five-stone',
    name: 'ست پنج‌تایی سنگی',
    category: 'ring',
    gender: 'WOMEN',
    price: 2_150_000,
    compareAtPrice: 3_590_000,
    sku: 'VNR-RG-005',
    description: 'پنج انگشتر با سنگ‌های کوچک؛ درخشان اما سبک برای استفادهٔ روزمره.',
    story: 'سنگ‌ها را کوچک انتخاب کردیم تا وزن انگشتر بالا نرود و ست، قابل پوشیدن روزانه بماند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 4,
    tags: ['ست', 'سنگی', 'پنج\u200cتایی'],
    images: [
      { file: 'ring-set-five-stone-01.jpg', alt: 'ست پنج‌تایی سنگی؛ پنج انگشتر با سنگ‌های کوچک' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۲', stock: 2 },
      { kind: 'SIZE', label: '۵۴', stock: 1 },
      { kind: 'SIZE', label: '۵۶', stock: 1 },
    ],
  },

];

async function main() {
  console.log('Seeding Venera…');

  const categoryBySlug = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        latinName: category.latinName,
        tagline: category.tagline,
        description: category.description,
        image: category.image,
        imageAlt: category.imageAlt,
        sortOrder: category.sortOrder,
      },
      select: { id: true },
    });
    categoryBySlug.set(category.slug, row.id);
  }

  // The owner replaced the original demo catalogue; remove its old slugs on an existing DB.
  await prisma.product.deleteMany({
    where: {
      slug: {
        in: [
          'necklace-avid',
          'necklace-mahtab',
          'necklace-arka',
          'necklace-nilo',
          'bracelet-celine',
          'bracelet-ares',
          'bracelet-nova',
          'earrings-alara',
          'earrings-livora',
          'ring-roja',
          'ring-diyar',
        ],
      },
    },
  });

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.category);
    if (!categoryId) throw new Error(`Unknown category ${product.category}`);

    const data = {
      name: product.name,
      description: product.description,
      story: product.story,
      categoryId,
      gender: product.gender,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      sku: product.sku,
      materials: product.materials,
      care: product.care,
      stock: product.stock,
      isActive: true,
      isFeatured: product.isFeatured ?? false,
      isBestSeller: product.isBestSeller ?? false,
      tags: product.tags,
    };

    const row = await prisma.product.upsert({
      where: { slug: product.slug },
      create: { slug: product.slug, ...data },
      update: data,
      select: { id: true },
    });

    await prisma.productImage.deleteMany({ where: { productId: row.id } });
    await prisma.productImage.createMany({
      data: product.images.map((image, index) => ({
        productId: row.id,
        url: `/images/products/${image.file}`,
        alt: image.alt,
        width: 1200,
        height: 1500,
        sortOrder: index,
      })),
    });

    for (const [index, variant] of (product.variants ?? []).entries()) {
      await prisma.productVariant.upsert({
        where: { productId_kind_label: { productId: row.id, kind: variant.kind, label: variant.label } },
        create: {
          productId: row.id,
          kind: variant.kind,
          label: variant.label,
          stock: variant.stock,
          sortOrder: index,
        },
        update: { stock: variant.stock, sortOrder: index },
      });
    }

    // Remove variants that no longer exist in the seed so re-running stays exact.
    const keepLabels = (product.variants ?? []).map((variant) => variant.label);
    await prisma.productVariant.deleteMany({
      where: { productId: row.id, label: { notIn: keepLabels.length > 0 ? keepLabels : ['__none__'] } },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@venera.example';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL ?? 'demo@venera.example';
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;

  if (!adminPassword || !customerPassword) {
    throw new Error('SEED_ADMIN_PASSWORD and SEED_CUSTOMER_PASSWORD must be set to seed demo accounts.');
  }
  if (adminPassword.length < 10 || customerPassword.length < 10) {
    throw new Error('Demo seed passwords must be at least 10 characters.');
  }

  const resetPasswords = process.env.SEED_RESET_PASSWORDS === 'true';
  const adminPasswordHash = resetPasswords ? await bcrypt.hash(adminPassword, 12) : null;
  const customerPasswordHash = resetPasswords ? await bcrypt.hash(customerPassword, 12) : null;

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    create: {
      name: process.env.SEED_ADMIN_NAME ?? 'مدیر ونرا',
      email: adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'ADMIN',
    },
    update: { role: 'ADMIN', ...(adminPasswordHash ? { passwordHash: adminPasswordHash } : {}) },
    select: { id: true },
  });

  const customer = await prisma.user.upsert({
    where: { email: customerEmail.toLowerCase() },
    create: {
      name: process.env.SEED_CUSTOMER_NAME ?? 'سارا کریمی',
      email: customerEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(customerPassword, 12),
      role: 'CUSTOMER',
    },
    update: customerPasswordHash ? { passwordHash: customerPasswordHash } : {},
    select: { id: true },
  });

  const addressCount = await prisma.address.count({ where: { userId: customer.id } });
  if (addressCount === 0) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        recipient: 'سارا کریمی',
        phone: '09120000000',
        province: 'تهران',
        city: 'تهران',
        postalCode: '1234567890',
        street: 'خیابان ولیعصر، کوچهٔ نمونه، پلاک ۱۲، واحد ۳',
        label: 'خانه',
        isDefault: true,
      },
    });
  }

  const counts = {
    admin: admin.id,
    customer: customer.id,
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    variants: await prisma.productVariant.count(),
  };

  console.log('Seed complete:', counts);
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Customer: ${customerEmail} / ${customerPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
