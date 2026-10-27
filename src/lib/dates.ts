const jalaliLong = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const jalaliNumeric = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const jalaliWithTime = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatJalali(date: Date | string): string {
  return jalaliLong.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatJalaliNumeric(date: Date | string): string {
  return jalaliNumeric.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatJalaliDateTime(date: Date | string): string {
  return jalaliWithTime.format(typeof date === 'string' ? new Date(date) : date);
}

/** Human order number, e.g. VNR-7K2M-4QX9 (Latin + digits, safe to read aloud). */
export function generateOrderNumber(): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const block = (length: number) =>
    Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `VNR-${stamp}${block(2)}-${block(4)}`;
}
