import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { ADMIN, CUSTOMER, assertNoOverflow, login, register, uniqueEmail } from './helpers';

const shots = path.join('docs', 'screenshots');
fs.mkdirSync(shots, { recursive: true });

async function shot(page: import('@playwright/test').Page, name: string, width: number) {
  await page.screenshot({ path: path.join(shots, `${name}-${width}.png`), fullPage: true });
}

test.describe('storefront', () => {
  test('home, navigation and catalog filters work against the database', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('اکسسوری لوکس');
    await expect(page.getByRole('link', { name: /دیدن کالکشن/ }).first()).toBeVisible();
    await expect(page.locator('.v3-category-card')).toHaveCount(4);

    await page.locator('.v3-nav').getByRole('button', { name: 'محصولات' }).click();
    const productsMenu = page.locator('#v3-products-menu');
    await expect(productsMenu.getByRole('link', { name: 'همه محصولات' })).toBeVisible();
    await productsMenu.getByRole('link', { name: 'همه محصولات' }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { level: 1, name: 'همه محصولات' })).toBeVisible();

    await page.goto('/products?category=necklace');
    await expect(page.locator('article')).toHaveCount(5);

    await page.goto('/products?gender=men');
    await expect(page.locator('article')).toHaveCount(3);

    await page.goto('/products?discount=1');
    await expect(page.locator('article')).toHaveCount(5);

    await page.goto('/products?q=%D9%82%D8%B7%D8%B1%D9%87');
    await expect(page.locator('article')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'گردنبند قطره' })).toBeVisible();

    await page.goto('/products?min=3000000');
    await expect(page.getByText('چیزی با این فیلترها پیدا نشد')).toBeVisible();
  });

  test('guest cart merges on registration, then checkout creates a demo order', async ({ page }) => {
    const email = uniqueEmail('flow');
    const user = { name: 'کاربر آزمایشی', email, password: 'DemoPass1404' };

    await page.goto('/products/necklace-drop');
    await expect(page.getByRole('heading', { level: 1, name: 'گردنبند قطره' })).toBeVisible();
    await page.getByRole('button', { name: '۴۵ سانتی‌متر' }).click();
    await page.getByRole('button', { name: /افزودن به سبد/ }).first().click();
    await expect(page.getByText('به سبد اضافه شد.').first()).toBeVisible();

    await page.goto('/cart');
    await expect(page.getByText('گردنبند قطره').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'ورود و ادامهٔ سفارش' })).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    await shot(page, 'cart', 375);
    await page.setViewportSize({ width: 1440, height: 900 });
    await shot(page, 'cart', 1440);

    await register(page, user);
    await page.waitForURL('http://127.0.0.1:3000/');

    await page.goto('/cart');
    await expect(page.getByText('گردنبند قطره').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'ادامهٔ سفارش' })).toBeVisible();

    await page.goto('/profile/addresses');
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('نام گیرنده').fill('کاربر آزمایشی');
    await dialog.getByLabel('شمارهٔ همراه').fill('09123456789');
    await dialog.getByLabel('استان').selectOption('تهران');
    await dialog.getByLabel('شهر').fill('تهران');
    await dialog.getByLabel('کد پستی').fill('1234567890');
    await dialog.getByLabel('نشانی کامل').fill('خیابان آزمایشی، کوچهٔ نمونه، پلاک ۱۰، واحد ۲');
    await dialog.getByRole('button', { name: 'افزودن نشانی' }).click();
    await expect(page.getByText('خیابان آزمایشی، کوچهٔ نمونه، پلاک ۱۰، واحد ۲')).toBeVisible();

    await shot(page, 'profile-addresses', 1440);

    await page.goto('/cart');
    await page.getByRole('link', { name: 'ادامهٔ سفارش' }).click();
    await page.waitForURL(/\/checkout/);
    await expect(page.getByRole('heading', { level: 1, name: 'یک قدم تا ثبت' })).toBeVisible();
    await page.getByLabel('یادداشت سفارش (اختیاری)').fill('لطفاً بسته‌بندی هدیه.');
    await shot(page, 'checkout', 1440);
    await page.setViewportSize({ width: 375, height: 812 });
    await shot(page, 'checkout', 375);
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.getByRole('button', { name: /ثبت سفارش/ }).click();
    await page.waitForURL(/\/order-success\//, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'ممنون که انتخاب کردی.' })).toBeVisible();
    const orderNumber = await page.locator('p.font-latin').first().innerText();
    expect(orderNumber.trim()).toMatch(/^VNR-/);
    await shot(page, 'order-success', 1440);
    await page.setViewportSize({ width: 375, height: 812 });
    await shot(page, 'order-success', 375);
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/profile/orders');
    await expect(page.getByText(orderNumber.trim()).first()).toBeVisible();
    await expect(page.getByText('ثبت شده').first()).toBeVisible();

    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: /سلام/ })).toBeVisible();
    await shot(page, 'profile', 1440);
    await page.setViewportSize({ width: 375, height: 812 });
    await shot(page, 'profile', 375);
    await page.setViewportSize({ width: 1440, height: 900 });

    await expect(page.getByRole('button', { name: 'خروج از حساب' })).toBeVisible();
    await page.getByRole('button', { name: 'خروج از حساب' }).click();
    await page.waitForURL('http://127.0.0.1:3000/');
  });

  test('contact form persists a message', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('نام', { exact: true }).fill('بازبین ونرا');
    await page.getByLabel('ایمیل').fill('reviewer@venera.example');
    await page.getByLabel('موضوع').fill('سؤال دربارهٔ اندازهٔ انگشتر');
    await page
      .getByLabel('پیام')
      .fill('سلام، برای انگشتر فیروزه‌ای بین سایز ۵۲ و ۵۴ مردد هستم؛ کدام را پیشنهاد می‌کنید؟');
    await page.getByRole('button', { name: /ارسال پیام/ }).click();
    await expect(page.getByRole('heading', { name: 'پیامت ثبت شد.' })).toBeVisible();
  });

  test('unauthenticated visitors are redirected and protected pages stay private', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login\?next=%2Fprofile/);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin/);

    await login(page, CUSTOMER);
    await page.waitForURL('http://127.0.0.1:3000/');
    await page.goto('/admin');
    await expect(page.getByText('این صفحه پیدا نشد.')).toBeVisible();
  });
});

test.describe('admin', () => {
  test('admin can open the dashboard, update stock and see contact messages', async ({ page }) => {
    await login(page, ADMIN);
    await page.waitForURL('http://127.0.0.1:3000/');

    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1, name: 'نمای کلی فروشگاه' })).toBeVisible();
    await expect(page.getByText('محصولات').first()).toBeVisible();

    await page.goto('/admin/products');
    await expect(page.getByRole('heading', { name: 'قیمت، موجودی و نمایش' })).toBeVisible();

    const row = page
      .locator('div.grid')
      .filter({ has: page.getByRole('link', { name: 'گردنبند قطره' }) })
      .last();
    const stockInput = row.getByLabel('موجودی');
    const original = await stockInput.inputValue();
    const next = String(Number(original) + 1);
    await stockInput.fill(next);
    await row.getByRole('button', { name: /ذخیره/ }).click();
    await expect(row.getByRole('button', { name: /ذخیره شد/ })).toBeVisible();

    await page.reload();
    const reloadedRow = page
      .locator('div.grid')
      .filter({ has: page.getByRole('link', { name: 'گردنبند قطره' }) })
      .last();
    await expect(reloadedRow.getByLabel('موجودی')).toHaveValue(next);

    await reloadedRow.getByLabel('موجودی').fill(original);
    await reloadedRow.getByRole('button', { name: /ذخیره/ }).click();
    await expect(reloadedRow.getByRole('button', { name: /ذخیره شد/ })).toBeVisible();

    await page.goto('/admin/messages');
    await expect(page.getByRole('heading', { name: 'پیام‌های تماس' })).toBeVisible();
    await expect(page.getByText('سؤال دربارهٔ اندازهٔ انگشتر').first()).toBeVisible();
  });
});

test.describe('responsive', () => {
  const widths = [320, 375, 430, 768, 1024, 1440, 1920];
  const routes = ['/', '/products', '/products/necklace-drop', '/about', '/contact', '/cart', '/login'];

  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        const { scrollWidth, innerWidth } = await assertNoOverflow(page);
        expect(scrollWidth, `${route} overflows at ${width}px`).toBeLessThanOrEqual(innerWidth + 1);
      }
    });
  }

  test('fonts load, RTL is applied and images resolve', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const state = await page.evaluate(() => ({
      direction: getComputedStyle(document.body).direction,
      fontLoaded: document.fonts.check('16px Estedad'),
      displayLoaded: document.fonts.check('16px "Bodoni Moda"'),
      brokenImages: Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
        .slice(0, 5),
    }));

    expect(state.direction).toBe('rtl');
    expect(state.fontLoaded).toBe(true);
    expect(state.displayLoaded).toBe(true);
    expect(state.brokenImages).toEqual([]);
  });

  test('light theme is the default, toggles and persists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.v3-root')).toHaveCSS('background-color', 'rgb(247, 242, 234)');
    await expect(page.locator('h1')).toHaveCSS('color', 'rgb(58, 27, 36)');

    await page.getByRole('button', { name: 'تغییر به تم تیره' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.v3-root')).toHaveCSS('background-color', 'rgb(11, 10, 12)');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'تغییر به تم روشن' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('header and footer links animate on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('.v3-nav-trigger');
    await nav.hover();
    await page.waitForTimeout(400);
    const underline = await nav.evaluate((element) => getComputedStyle(element, '::after').transform);
    expect(underline).toContain('matrix(1');

    const footerLink = page.locator('.v3-foot-link').first();
    await footerLink.scrollIntoViewIfNeeded();
    await footerLink.hover();
    await page.waitForTimeout(400);
    const rule = await footerLink.evaluate((element) => getComputedStyle(element, '::before').width);
    expect(rule).toBe('12px');
  });

  test('cinematic menu opens, previews and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'منو' }).click();
    await expect(page.locator('.v3-menu-panel')).toBeVisible();
    await expect(page.locator('.v3-menu-links a')).toHaveCount(5);
    await expect(page.locator('.v3-menu-preview img')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(page.locator('.v3-menu-panel')).toHaveCount(0);
  });

  test('quick view adds a piece and opens the cart drawer', async ({ page }) => {
    await page.goto('/');
    await page.locator('.v3-grid-open').first().click({ force: true });
    await expect(page.locator('.v3-qv')).toBeVisible();
    await expect(page.locator('.v3-qv-variants .v3-choice').first()).toBeVisible();
    await page.locator('.v3-qv-variants .v3-choice').first().click();
    await page.getByRole('button', { name: 'افزودن به سبد' }).click();
    await expect(page.locator('.v3-drawer')).toBeVisible();
    await expect(page.locator('.v3-drawer-line')).toHaveCount(1);
    await page.getByRole('button', { name: 'بستن سبد' }).click();
  });

  test('layout quality: tap targets, grid columns, clipping and hero CTA', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const tinyTargets = await page.evaluate(() =>
      Array.from(document.querySelectorAll('header a, header button, .chip, .btn'))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
        })
        .map((element) => (element.textContent ?? '').trim().slice(0, 24)),
    );
    expect(tinyTargets).toEqual([]);

    const mobileColumns = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.v3-grid-media'))
        .slice(0, 4)
        .map((element) => element.closest('article'))
        .filter((element): element is HTMLElement => Boolean(element));
      return new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left))).size;
    });
    expect(mobileColumns).toBe(2);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const desktopColumns = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.v3-category-card')).slice(0, 4);
      return new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left))).size;
    });
    expect(desktopColumns).toBe(4);

    const ctaBox = await page.getByRole('link', { name: /دیدن کالکشن/ }).first().boundingBox();
    expect(ctaBox).not.toBeNull();
    expect((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0)).toBeLessThan(900);

    const desktopHero = await page.locator('[data-hero]').boundingBox();
    expect(desktopHero).not.toBeNull();
    expect((desktopHero?.y ?? 0) + (desktopHero?.height ?? 0)).toBeLessThanOrEqual(900);

    const clipped = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1, h2, .tabular'))
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => (element.textContent ?? '').trim().slice(0, 30)),
    );
    expect(clipped).toEqual([]);
  });

  test('capture review screenshots at 375 and 1440', async ({ page }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
      for (const [name, route] of [
        ['home', '/'],
        ['catalog', '/products'],
        ['product', '/products/necklace-drop'],
        ['about', '/about'],
        ['contact', '/contact'],
        ['ping', '/login'],
        ['cart-empty', '/cart'],
      ] as const) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await shot(page, name, width);
      }
    }
  });
});
