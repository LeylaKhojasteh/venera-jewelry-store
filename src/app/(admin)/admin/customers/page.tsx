import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatJalali } from '@/lib/dates';
import { formatToman } from '@/lib/money';

export const metadata = { title: 'مشتریان' };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      orders: { select: { total: true, status: true, createdAt: true } },
    },
  });

  return (
    <div>
      <div>
        <h1 className="v3-display">مشتریان</h1>
        <p className="v3-lead" style={{ marginTop: '0.75rem' }}>
          فهرست حساب‌های فروشگاه و جمع سفارش‌های هر مشتری.
        </p>
      </div>

      <div className="v3-admin-table-wrap" style={{ marginTop: '1.5rem' }}>
        <table className="v3-admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>عضویت</th>
              <th>سفارش‌ها</th>
              <th>جمع خرید</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="v3-admin-muted" style={{ textAlign: 'center' }}>
                  هنوز مشتری ثبت‌نامی وجود ندارد.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const paid = customer.orders.filter((order) => order.status !== 'CANCELLED');
                return (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td dir="ltr">
                      <a href={`mailto:${customer.email}`}>{customer.email}</a>
                    </td>
                    <td>{formatJalali(customer.createdAt)}</td>
                    <td>{new Intl.NumberFormat('fa-IR').format(customer.orders.length)}</td>
                    <td>{formatToman(paid.reduce((sum, order) => sum + order.total, 0))}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
