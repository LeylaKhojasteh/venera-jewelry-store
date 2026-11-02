import { prisma } from '@/lib/db';

type ImageRow = { data: Uint8Array | null; mimeType: string | null };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await prisma.$queryRaw<ImageRow[]>`
    SELECT "data", "mimeType" FROM "ProductImage" WHERE "id" = ${id} LIMIT 1
  `;
  const image = rows[0];
  if (!image?.data) {
    return new Response('Not found', { status: 404 });
  }

  const body = Buffer.from(image.data);
  return new Response(body, {
    headers: {
      'Content-Type': image.mimeType ?? 'application/octet-stream',
      'Content-Length': String(body.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
