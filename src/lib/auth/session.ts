import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';
import type { Role } from '@prisma/client';
import { prisma } from '@/lib/db';
import { assertAuthSecret } from '@/lib/env';

export const SESSION_COOKIE = 'venera_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ISSUER = 'venera';
const AUDIENCE = 'venera-web';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type SessionPayload = {
  role: Role;
  sv: number;
};

function secretKey(): Uint8Array {
  return new TextEncoder().encode(assertAuthSecret());
}

export async function createSession(user: {
  id: string;
  role: Role;
  sessionVersion: number;
}): Promise<void> {
  const token = await new SignJWT({ role: user.role, sv: user.sessionVersion } satisfies SessionPayload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

async function readToken(): Promise<{ userId: string; payload: SessionPayload } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER, audience: AUDIENCE });
    if (!payload.sub || typeof payload.sv !== 'number' || typeof payload.role !== 'string') return null;
    return { userId: payload.sub, payload: { role: payload.role as Role, sv: payload.sv } };
  } catch {
    return null;
  }
}

/**
 * The signed-in user for this request. Cached per render pass so a page can call
 * it in several server components without extra queries.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await readToken();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, sessionVersion: true },
  });

  // A password change or a forced sign-out bumps sessionVersion and invalidates old cookies.
  if (!user || user.sessionVersion !== session.payload.sv) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

export async function requireUser(nextPath = '/'): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=%2Fadmin');
  if (user.role !== 'ADMIN') notFound();
  return user;
}

/** Revalidate the session cookie after a security-relevant change. */
export async function rotateSession(userId: string): Promise<void> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { sessionVersion: { increment: 1 } },
    select: { id: true, role: true, sessionVersion: true },
  });
  await createSession(user);
}
