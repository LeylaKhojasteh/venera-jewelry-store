'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/auth/rate-limit';
import { clientIp, hashIp } from '@/lib/request';
import type { ActionResult } from '@/types';

export async function submitContactAction(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  startedAt?: number;
}): Promise<ActionResult<{ id: string }>> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, message: 'پیام را کامل کن.', fieldErrors };
  }

  // Honeypot: real visitors leave this empty.
  if (parsed.data.company) {
    return { ok: false, message: 'ارسال پیام ممکن نشد.' };
  }

  const ip = await clientIp();
  const limit = rateLimit(`contact:${ip}`, 6, 10 * 60_000);
  if (!limit.ok) {
    return { ok: false, message: 'پیام‌های ارسالی زیاد بوده است. کمی بعد تلاش کن.', code: 'RATE_LIMITED' };
  }

  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        ipHash: hashIp(ip),
      },
      select: { id: true },
    });
    revalidatePath('/admin/messages');
    return {
      ok: true,
      data: { id: message.id },
      message: 'پیامت ثبت شد. تیم ونرا در اولین فرصت پاسخ می‌دهد.',
    };
  } catch (error) {
    console.error('submitContactAction failed', error);
    return { ok: false, message: 'ثبت پیام انجام نشد. لطفاً دوباره تلاش کن.' };
  }
}
