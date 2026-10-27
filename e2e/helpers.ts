import type { Page } from '@playwright/test';

export const CUSTOMER = { email: 'demo@venera.example', password: 'VeneraDemo!1404' };
export const ADMIN = { email: 'admin@venera.example', password: 'VeneraAdmin!1404' };

export function uniqueEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@venera.example`;
}

export async function login(page: Page, credentials: { email: string; password: string }) {
  await page.goto('/login');
  await page.getByLabel('ایمیل', { exact: true }).fill(credentials.email);
  await page.getByLabel('گذرواژه', { exact: true }).fill(credentials.password);
  await page.getByRole('button', { name: /ورود به حساب/ }).click();
}

export async function register(
  page: Page,
  user: { name: string; email: string; password: string },
  password = user.password,
) {
  await page.goto('/register');
  await page.getByLabel('نام و نام خانوادگی').fill(user.name);
  await page.getByLabel('ایمیل', { exact: true }).fill(user.email);
  await page.getByLabel('گذرواژه', { exact: true }).fill(password);
  await page.getByLabel('تکرار گذرواژه').fill(password);
  await page.getByRole('button', { name: /ساخت حساب/ }).click();
}

export function assertNoOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
}
