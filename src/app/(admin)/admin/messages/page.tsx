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
        <h1 className="display text-3xl">پیام‌های تماس</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">
          پیام‌های فرم تماس، مستقیم از پایگاه‌داده. در این نسخه ایمیل خودکار ارسال نمی‌شود؛ وضعیت را برای
          پیگیری داخلی تغییر بده.
        </p>
      </div>

      <p className="mt-5 text-xs text-ink-soft">
        {new Intl.NumberFormat('fa-IR').format(newCount)} پیام تازه از{' '}
        {new Intl.NumberFormat('fa-IR').format(messages.length)} پیام
      </p>

      <div className="mt-4 space-y-3">
        {messages.length === 0 ? (
          <p className="border border-dashed border-line bg-paper-soft p-8 text-center text-sm text-ink-soft">
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
