import 'server-only';

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'Venera <onboarding@resend.dev>';

  if (!apiKey) {
    // Local/development fallback. Never print a live reset token in production logs.
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[password-reset] ${to}: ${resetUrl}`);
    } else {
      console.warn('[password-reset] RESEND_API_KEY is not configured; email was not sent.');
    }
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'بازیابی گذرواژهٔ ونرا',
        html: `<div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:1.9">
          <p>برای تعیین گذرواژهٔ تازه روی پیوند زیر بزن. این پیوند ۳۰ دقیقه معتبر است و فقط یک بار استفاده می‌شود.</p>
          <p><a href="${resetUrl}">تعیین گذرواژهٔ تازه</a></p>
          <p>اگر این درخواست را تو نفرستاده‌ای، این ایمیل را نادیده بگیر.</p>
        </div>`,
      }),
    });
    if (!response.ok) {
      console.error('sendPasswordResetEmail failed', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('sendPasswordResetEmail failed', error);
    return false;
  }
}
