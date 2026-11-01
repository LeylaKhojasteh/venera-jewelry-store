import { prisma } from '@/lib/db';
import { formatJalaliDateTime } from '@/lib/dates';
import { AdminMessageCard } from '@/components/admin/AdminMessageCard';

export const metadata = { title: 'پیام‌های تماس' };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 200,
  });

  const newCount = messages.filter((message) => message.status === 'NEW').length;

  return (
    <div>
      <div>
        <h1 className="v3-display">پیام‌های تماس</h1>
        <p className="v3-lead" style={{ marginTop: '0.75rem', maxWidth: '56ch' }}>
          پیام‌های فرم تماس، مستقیم از پایگاه‌داده. در این نسخه ایمیل خودکار ارسال نمی‌شود؛ وضعیت را برای
          پیگیری داخلی تغییر بده.
        </p>
      </div>

      <p className="v3-small" style={{ marginTop: '1rem' }}>
        {new Intl.NumberFormat('fa-IR').format(newCount)} پیام تازه از{' '}
        {new Intl.NumberFormat('fa-IR').format(messages.length)} پیام
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
        {messages.length === 0 ? (
          <p className="v3-empty" style={{ background: 'var(--ink-2)', padding: '2rem', textAlign: 'center' }}>
            هنوز پیامی ثبت نشده است. فرم تماس را از فروشگاه امتحان کن.
          </p>
        ) : (
          messages.map((message) => (
            <AdminMessageCard
              key={message.id}
              message={{
                id: message.id,
                name: message.name,
                email: message.email,
                subject: message.subject,
                message: message.message,
                status: message.status,
                createdAtLabel: formatJalaliDateTime(message.createdAt),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
