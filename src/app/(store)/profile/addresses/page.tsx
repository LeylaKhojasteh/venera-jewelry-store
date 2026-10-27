import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { AddressManager } from '@/components/profile/AddressManager';

export const metadata: Metadata = {
  title: 'نشانی‌ها',
  robots: { index: false, follow: false },
};

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser('/profile/addresses');
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      recipient: true,
      phone: true,
      province: true,
      city: true,
      postalCode: true,
      street: true,
      label: true,
      isDefault: true,
    },
  });

  return <AddressManager addresses={addresses} next={next} />;
}
