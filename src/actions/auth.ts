'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession, getCurrentUser } from '@/lib/auth/session';
import { resetRateLimit, rateLimit } from '@/lib/auth/rate-limit';
import { loginSchema, registerSchema } from '@/lib/validation';
import { clientIp, safeNextPath } from '@/lib/request';
import { normalizeEmail } from '@/lib/persian';
import type { ActionResult } from '@/types';

function zodFields(error: { issues: { path: PropertyKey[]; message: string }[] }): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
}

export async function loginAction(input: {
  email: string;
  password: string;
  next?: string;
}): Promise<ActionResult<{ next: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'اطلاعات ورود را بررسی کن.', fieldErrors: zodFields(parsed.error) };
  }

  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}:${parsed.data.email}`, 6, 10 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      message: `تلاش‌های ناموفق زیاد بوده است. ${limit.retryAfter} ثانیه دیگر دوباره تلاش کن.`,
      code: 'RATE_LIMITED',
    };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;

  if (!user || !valid) {
    return {
      ok: false,
      message: 'ایمیل یا گذرواژه نادرست است.',
      code: 'INVALID_CREDENTIALS',
    };
  }

  resetRateLimit(`login:${ip}:${parsed.data.email}`);
  await createSession(user);
  revalidatePath('/', 'layout');
  return { ok: true, data: { next: safeNextPath(input.next) ?? '/' } };
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  next?: string;
}): Promise<ActionResult<{ next: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'اطلاعات ثبت‌نام را کامل کن.', fieldErrors: zodFields(parsed.error) };
  }

  const ip = await clientIp();
  const limit = rateLimit(`register:${ip}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      message: 'ثبت‌نام‌های زیادی از این دستگاه انجام شده است. کمی بعد دوباره تلاش کن.',
      code: 'RATE_LIMITED',
    };
  }

  const email = normalizeEmail(parsed.data.email);
  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash: await hashPassword(parsed.data.password),
        role: 'CUSTOMER',
      },
    });
    await createSession(user);
    revalidatePath('/', 'layout');
    return { ok: true, data: { next: safeNextPath(input.next) ?? '/' } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ok: false,
        message: 'این ایمیل قبلاً ثبت شده است. وارد شو یا ایمیل دیگری انتخاب کن.',
        fieldErrors: { email: ['این ایمیل قبلاً ثبت شده است.'] },
        code: 'EMAIL_TAKEN',
      };
    }
    console.error('registerAction failed', error);
    return { ok: false, message: 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کن.' };
  }
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath('/', 'layout');
}

export async function currentSessionAction(): Promise<{ id: string; name: string; role: string } | null> {
  const user = await getCurrentUser();
  return user ? { id: user.id, name: user.name, role: user.role } : null;
}
