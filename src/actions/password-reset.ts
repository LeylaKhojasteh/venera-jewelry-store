'use server';

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { rateLimit } from '@/lib/auth/rate-limit';
import { clientIp } from '@/lib/request';
import { env } from '@/lib/env';
import { sendPasswordResetEmail } from '@/lib/email';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation';
import type { ActionResult } from '@/types';

const RESET_TTL_MS = 30 * 60 * 1000;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function requestPasswordResetAction(input: { email: string }): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'یک ایمیل معتبر وارد کن.' };
  }

  const ip = await clientIp();
  const limit = rateLimit(`password-reset:${ip}:${parsed.data.email}`, 4, 15 * 60_000);
  if (!limit.ok) {
    return { ok: false, message: 'درخواست‌های زیادی ثبت شده است. کمی بعد دوباره تلاش کن.', code: 'RATE_LIMITED' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + RESET_TTL_MS);

      await prisma.$executeRaw`DELETE FROM "PasswordResetToken" WHERE "userId" = ${user.id} AND "usedAt" IS NULL`;
      await prisma.$executeRaw`
        INSERT INTO "PasswordResetToken" ("id", "userId", "tokenHash", "expiresAt")
        VALUES (${randomUUID()}, ${user.id}, ${tokenHash}, ${expiresAt})
      `;

      const resetUrl = `${env.siteUrl}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return {
      ok: true,
      data: undefined,
      message: 'اگر این ایمیل در ونرا ثبت شده باشد، پیوند بازیابی برایت فرستاده می‌شود.',
    };
  } catch (error) {
    console.error('requestPasswordResetAction failed', error);
    return { ok: false, message: 'درخواست بازیابی انجام نشد. دوباره تلاش کن.' };
  }
}

export async function resetPasswordAction(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult<{ next: string }>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'اطلاعات را بررسی کن.', fieldErrors: { password: parsed.error.issues.map((issue) => issue.message) } };
  }

  const ip = await clientIp();
  const limit = rateLimit(`password-reset-confirm:${ip}`, 8, 15 * 60_000);
  if (!limit.ok) {
    return { ok: false, message: 'تلاش‌های زیادی انجام شده است. کمی بعد دوباره تلاش کن.', code: 'RATE_LIMITED' };
  }

  const tokenHash = hashToken(parsed.data.token);

  try {
    const rows = await prisma.$queryRaw<{ id: string; userId: string }[]>`
      SELECT "id", "userId"
      FROM "PasswordResetToken"
      WHERE "tokenHash" = ${tokenHash}
        AND "usedAt" IS NULL
        AND "expiresAt" > NOW()
      LIMIT 1
    `;
    const record = rows[0];
    if (!record) {
      return { ok: false, message: 'این پیوند معتبر یا تازه نیست. دوباره درخواست بازیابی بفرست.' };
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash, sessionVersion: { increment: 1 } },
      }),
      prisma.$executeRaw`UPDATE "PasswordResetToken" SET "usedAt" = NOW() WHERE "id" = ${record.id}`,
      prisma.$executeRaw`DELETE FROM "PasswordResetToken" WHERE "userId" = ${record.userId} AND "id" <> ${record.id}`,
    ]);

    return { ok: true, data: { next: '/login?reset=1' }, message: 'گذرواژه تغییر کرد. حالا وارد شو.' };
  } catch (error) {
    console.error('resetPasswordAction failed', error);
    return { ok: false, message: 'تغییر گذرواژه انجام نشد. دوباره تلاش کن.' };
  }
}
