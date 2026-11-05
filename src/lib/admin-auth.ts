import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getPublisherByEmail, verifyPublisherPassword } from '@/lib/admin-publishers';

const cookieName = 'jama_tech_admin';
const sessionLifetime = 60 * 60 * 24 * 30;

export type AdminPrincipal = {
  username: string;
  role: 'admin' | 'publisher';
  publisherId?: number;
};

type SessionClaims = AdminPrincipal & { expiresAt: number };

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && sessionSecret());
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim();
    const host = forwardedHost || request.headers.get('host');
    const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
    const protocol = forwardedProtocol || new URL(request.url).protocol.replace(/:$/, '');
    return Boolean(host && originUrl.host.toLowerCase() === host.toLowerCase() && originUrl.protocol === `${protocol}:`);
  } catch {
    return false;
  }
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!sessionSecret() || !expectedUsername || !expectedPassword) return false;
  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

function sign(value: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error('Admin session secret is not configured.');
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createAdminSessionToken(principal: AdminPrincipal) {
  const claims: SessionClaims = {
    ...principal,
    expiresAt: Date.now() + sessionLifetime * 1000,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyLegacyAdminSessionToken(token: string) {
  const [expiresAt, signature, extra] = token.split('.');
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;
  return safeEqual(signature, sign(expiresAt));
}

function verifyAdminSessionToken(token: string | undefined): SessionClaims | undefined {
  if (!token || !sessionSecret()) return undefined;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return undefined;
  if (verifyLegacyAdminSessionToken(token)) {
    const username = process.env.ADMIN_USERNAME;
    return username ? { username, role: 'admin', expiresAt: Number(payload) } : undefined;
  }
  if (!safeEqual(signature, sign(payload))) return undefined;
  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!claims || typeof claims !== 'object') return undefined;
    const session = claims as Partial<SessionClaims>;
    if (!Number.isSafeInteger(session.expiresAt) || (session.expiresAt ?? 0) <= Date.now() ||
      typeof session.username !== 'string' ||
      (session.role !== 'admin' && session.role !== 'publisher') ||
      (session.role === 'publisher' && (!Number.isSafeInteger(session.publisherId) || (session.publisherId ?? 0) < 1))) return undefined;
    return session as SessionClaims;
  } catch {
    return undefined;
  }
}

export async function getAdminSession(): Promise<AdminPrincipal | undefined> {
  const cookieStore = await cookies();
  const claims = verifyAdminSessionToken(cookieStore.get(cookieName)?.value);
  if (!claims) return undefined;
  if (claims.role === 'admin') return { username: claims.username, role: 'admin' };
  const publisher = await getPublisherByEmail(claims.username);
  if (!publisher || publisher.id !== claims.publisherId || publisher.status !== 'active') return undefined;
  return { username: publisher.email, role: 'publisher', publisherId: publisher.id };
}

export async function hasAdminSession() {
  return Boolean(await getAdminSession());
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminPrincipal | undefined> {
  if (validateAdminCredentials(username, password)) return { username, role: 'admin' };
  const publisher = await getPublisherByEmail(username);
  if (!publisher || publisher.status !== 'active' || !(await verifyPublisherPassword(password, publisher.passwordHash))) return undefined;
  return { username: publisher.email, role: 'publisher', publisherId: publisher.id };
}

export async function setAdminSession(principal: AdminPrincipal) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, createAdminSessionToken(principal), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: sessionLifetime,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}