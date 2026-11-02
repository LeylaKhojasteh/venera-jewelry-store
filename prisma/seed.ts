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
    slug: 'necklace-avid',
    name: 'گردنبند آوید',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_490_000,
    compareAtPrice: 1_790_000,
    sku: 'VNR-NC-001',
    description:
      'آویز قطره‌ای که روی زنجیر نازک می‌نشیند؛ طولش طوری گرفته شده که روی گودی گردن قرار بگیرد. برای روزهایی که فقط یک آیتم می‌خواهی، همین کافی است.',
    story:
      'آوید از یک قطره شروع شد؛ فرمی که با حرکت بدن آرام تاب می‌خورد. زنجیر را نازک نگه داشتیم تا وزن آویز، آن را به جلو نکشد و آیتم همیشه صاف بنشیند.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 14,
    isFeatured: true,
    isBestSeller: true,
    tags: ['قطره‌ای', 'استیل', 'هدیه'],
    images: [
      { file: 'necklace-avid-01.jpg', alt: 'گردنبند آوید؛ آویز قطره‌ای روی زنجیر استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۰ سانتی‌متر', stock: 5 },
      { kind: 'SIZE', label: '۴۵ سانتی‌متر', stock: 6 },
      { kind: 'SIZE', label: '۵۰ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'necklace-mahtab',
    name: 'گردنبند مهتاب',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_890_000,
    sku: 'VNR-NC-002',
    description:
      'ردیفی از مرواریدهای ریز روی زنجیر نازک؛ درخششی نرم و مات. برای مهمانی‌های بی‌سروصدا و لباس‌های ساده.',
    story:
      'مهتاب دربارهٔ نظم است: مرواریدها باید هم‌اندازه و هم‌فاصله باشند تا خط گردن تمیز دیده شود. برای همین، هر مروارید را جدا اندازه گرفتیم.',
    materials: 'استیل ۳۱۶، مروارید پرورشی',
    care,
    stock: 9,
    isBestSeller: true,
    tags: ['مروارید', 'استیل', 'مهمانی'],
    images: [
      { file: 'necklace-mahtab-01.jpg', alt: 'گردنبند مهتاب؛ ردیف مرواریدهای ریز روی زنجیر استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۲ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۴۷ سانتی‌متر', stock: 5 },
    ],
  },
  {
    slug: 'necklace-arka',
    name: 'گردنبند آرکا',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_390_000,
    sku: 'VNR-NC-003',
    description:
      'زنجیر باریک و یکدست با بست ساده. برای روزهایی که فقط یک خط فلز روی گردن می‌خواهی و چیزی بیشتر نه.',
    story:
      'آرکا ساده‌ترین آیتم مجموعه است: زنجیری با ضخامت کم و بستی که پشت گردن پنهان می‌شود. سطح را مات نگه داشتیم تا در استفادهٔ روزمره، خط‌وخش کمتر دیده شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 7,
    isBestSeller: true,
    tags: ['مینیمال', 'استیل', 'روزمره'],
    images: [
      { file: 'necklace-arka-01.jpg', alt: 'گردنبند آرکا؛ زنجیر باریک استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۵۰ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۵۵ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'necklace-nilo',
    name: 'گردنبند نیلو',
    category: 'necklace',
    gender: 'WOMEN',
    price: 1_690_000,
    sku: 'VNR-NC-004',
    description:
      'گل‌های ریز که در امتداد زنجیر تکرار می‌شوند؛ از دور ساده به نظر می‌رسد و از نزدیک، بافت دارد.',
    story:
      'نیلو از یک نقش گل شروع شد که ساده‌اش کردیم تا تکراری و سبک بماند. فاصلهٔ گل‌ها را طوری چیدیم که روی گردن، یکنواخت دیده شود.',
    materials: 'استیل ۳۱۶',
    care,
    stock: 8,
    isBestSeller: true,
    tags: ['گل', 'استیل', 'ظریف'],
    images: [
      { file: 'necklace-nilo-01.jpg', alt: 'گردنبند نیلو؛ گل‌های ریز روی زنجیر استیل' },
    ],
    variants: [
      { kind: 'SIZE', label: '۴۰ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: '۴۵ سانتی‌متر', stock: 4 },
    ],
  },
  {
    slug: 'bracelet-celine',
    name: 'دستبند سلین',
    category: 'bracelet',
    gender: 'WOMEN',
    price: 980_000,
    compareAtPrice: 1_180_000,
    sku: 'VNR-BR-001',
    description:
      'دستبند زنجیری با حلقه‌های ریز و بست قفل‌شو. سبک است و روی مچ حرکت می‌کند؛ همان اندازه که باید.',
    story:
      'سلین را برای مچ‌های ظریف طراحی کردیم؛ حلقه‌ها کوچک‌ترند تا دستبند سنگین به نظر نرسد. بست را طوری ساختیم که با یک دست هم بسته شود.',
    materials: 'طلای ۱۸ عیار با آبکاری رزگلد',
    care,
    stock: 18,
    isFeatured: true,
    tags: ['طلایی', 'ظریف', 'روزمره'],
    images: [
      { file: 'bracelet-celine-01.jpg', alt: 'دستبند سلین؛ زنجیر طلایی ظریف زنانه' },
      { file: 'bracelet-celine-detail-02.jpg', alt: 'جزئیات حلقه‌های دستبند سلین' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۶ سانتی‌متر', stock: 6 },
      { kind: 'SIZE', label: 'مچ ۱۷ سانتی‌متر', stock: 7 },
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 5 },
    ],
  },
  {
    slug: 'bracelet-ares',
    name: 'دستبند آرس',
    category: 'bracelet',
    gender: 'MEN',
    price: 1_250_000,
    sku: 'VNR-BR-002',
    description:
      'دستبند بافته با بست مغناطیسی و وزنی محسوس. طراحی خطی و بی‌نقش؛ چیزی که با ساعت هم رقابت نمی‌کند.',
    story:
      'آرس بر پایهٔ یک بافت سه‌رشته‌ای ساخته شده است. بست مغناطیسی را بعد از چند نمونه انتخاب کردیم؛ ساده است و در استفادهٔ روزمره باز نمی‌شود.',
    materials: 'استیل ۳۱۶ با آبکاری طلای ۱۸ عیار، بست مغناطیسی',
    care,
    stock: 11,
    isBestSeller: true,
    tags: ['مردانه', 'بافته', 'روزمره'],
    images: [
      { file: 'bracelet-ares-01.jpg', alt: 'دستبند آرس؛ بافت سه‌رشته‌ای طلایی مردانه' },
      { file: 'bracelet-ares-detail-02.jpg', alt: 'جزئیات بافت دستبند آرس' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: 'مچ ۱۹ سانتی‌متر', stock: 4 },
      { kind: 'SIZE', label: 'مچ ۲۰ سانتی‌متر', stock: 3 },
    ],
  },
  {
    slug: 'bracelet-nova',
    name: 'دستبند نوا',
    category: 'bracelet',
    gender: 'MEN',
    price: 890_000,
    compareAtPrice: 1_090_000,
    sku: 'VNR-BR-003',
    description:
      'یک نوار باریک فلزی با سطح مات. کم‌ترین جزئیات، بیشترین استفاده؛ برای هر روز و هر دست.',
    story:
      'نوا ساده‌ترین آیتم مجموعه است: یک نوار با انتهای گرد. سطح مات را انتخاب کردیم تا خط‌وخش‌های روزمره کمتر دیده شوند.',
    materials: 'استیل ۳۱۶ با روکش طلای مات',
    care,
    stock: 5,
    tags: ['مردانه', 'مینیمال', 'مات'],
    images: [
      { file: 'bracelet-nova-01.jpg', alt: 'دستبند نوا؛ نوار باریک طلایی مات' },
      { file: 'bracelet-nova-detail-02.jpg', alt: 'نمای نزدیک سطح مات دستبند نوا' },
    ],
    variants: [
      { kind: 'SIZE', label: 'مچ ۱۸ سانتی‌متر', stock: 3 },
      { kind: 'SIZE', label: 'مچ ۱۹ سانتی‌متر', stock: 2 },
    ],
  },
  {
    slug: 'earrings-alara',
    name: 'گوشواره الارا',
    category: 'earrings',
    gender: 'WOMEN',
    price: 1_090_000,
    compareAtPrice: 1_290_000,
    sku: 'VNR-ER-001',
    description:
      'حلقه‌های آویز با سطح صیقلی و بست میله‌ای. سبک‌اند اما در حرکت، نور را به خوبی بازمی‌تابانند.',
    story:
      'الارا از یک حلقهٔ ساده شروع شد که آویزی کوتاه به آن اضافه شد. طول آویز را اندازه گرفتیم تا با موهای بسته و باز هر دو دیده شود.',
    materials: 'طلای ۱۸ عیار، بست میله‌ای ضدحساسیت',
    care,
    stock: 12,
    isFeatured: true,
    isBestSeller: true,
    tags: ['آویز', 'حلقه‌ای', 'مهمانی'],
    images: [
      { file: 'earrings-alara-01.jpg', alt: 'گوشواره الارا؛ حلقه‌های آویز طلایی' },
      { file: 'earrings-alara-detail-02.jpg', alt: 'جزئیات سطح صیقلی گوشواره الارا' },
    ],
  },
  {
    slug: 'earrings-livora',
    name: 'گوشواره لیورا',
    category: 'earrings',
    gender: 'WOMEN',
    price: 790_000,
    sku: 'VNR-ER-002',
    description:
      'گوشواره‌های کوچک و سبک؛ برای سوراخ اول گوش یا لایه‌بندی با حلقه‌های ساده. در طول روز فراموششان می‌کنی.',
    story:
      'لیورا برای کسانی است که گوشوارهٔ بزرگ نمی‌خواهند. ابعاد را کوچک نگه داشتیم تا وزن کم بماند و روی گوش، آرام و بی‌حرکت باشد.',
    materials: 'طلای ۱۸ عیار',
    care,
    stock: 20,
    tags: ['کوچک', 'روزمره', 'لایه‌بندی'],
    images: [
      { file: 'earrings-livora-01.jpg', alt: 'گوشواره لیورا؛ جفت گوشوارهٔ طلایی' },
      { file: 'earrings-livora-detail-02.jpg', alt: 'جزئیات گوشوارهٔ لیورا' },
    ],
  },
  {
    slug: 'ring-roja',
    name: 'انگشتر روژا',
    category: 'ring',
    gender: 'WOMEN',
    price: 1_590_000,
    sku: 'VNR-RG-001',
    description:
      'انگشتر با نگین مرکزی و شاخه‌های باریک. ارتفاع نگین کم است تا با دستکش و جیب هم راحت باشد.',
    story:
      'روژا دربارهٔ تعادل است: نگین باید دیده شود، اما نه به قیمت راحتی. ارتفاع را کم گرفتیم و شاخه‌ها را نازک کردیم تا انگشتر سبک بماند.',
    materials: 'طلای ۱۸ عیار، نگین زیرکونیا با برش گرد',
    care,
    stock: 6,
    isFeatured: true,
    tags: ['نگین‌دار', 'کلاسیک', 'زنانه'],
    images: [
      { file: 'ring-roja-01.jpg', alt: 'انگشتر روژا؛ نگین گرد روی شاخه‌های باریک' },
      { file: 'ring-roja-detail-02.jpg', alt: 'جزئیات نگین انگشتر روژا' },
    ],
    variants: [
      { kind: 'SIZE', label: 'سایز ۵۰', stock: 2 },
      { kind: 'SIZE', label: 'سایز ۵۲', stock: 2 },
      { kind: 'SIZE', label: 'سایز ۵۴', stock: 1 },
      { kind: 'SIZE', label: 'سایز ۵۶', stock: 1 },
    ],
  },
  {
    slug: 'ring-diyar',
    name: 'انگشتر دیار',
    category: 'ring',
    gender: 'MEN',
    price: 1_450_000,
    compareAtPrice: 1_690_000,
    sku: 'VNR-RG-002',
    description:
      'انگشتر پهن با سطح مات و لبه‌های گرد. سنگ‌ها کنار هم نشسته‌اند؛ بی‌آنکه بخواهند بدرخشند.',
    story:
      'دیار از یک نوار پهن شروع شد که با گذاشتن چند سنگ کوچک، بافت پیدا کرد. سطح مات را نگه داشتیم تا در استفادهٔ روزانه، خط‌وخش بخشی از ظاهر شود.',
    materials: 'نقرهٔ ۹۲۵ با آبکاری رودیوم تیره، سنگ‌های اونیکس',
    care,
    stock: 4,
    isBestSeller: true,
    tags: ['مردانه', 'مات', 'سنگ'],
    images: [
      { file: 'ring-diyar-01.jpg', alt: 'انگشتر دیار؛ نوار پهن تیره با سنگ‌های کوچک' },
      { file: 'ring-diyar-detail-02.jpg', alt: 'جزئیات سطح و سنگ‌های انگشتر دیار' },
    ],
    variants: [
      { kind: 'SIZE', label: 'سایز ۵۴', stock: 2 },
      { kind: 'SIZE', label: 'سایز ۵۶', stock: 1 },
      { kind: 'SIZE', label: 'سایز ۵۸', stock: 1 },
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
        width: 1000,
        height: 1250,
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

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    create: {
      name: process.env.SEED_ADMIN_NAME ?? 'مدیر ونرا',
      email: adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'ADMIN',
    },
    update: { role: 'ADMIN', passwordHash: await bcrypt.hash(adminPassword, 12) },
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
    update: { passwordHash: await bcrypt.hash(customerPassword, 12) },
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
