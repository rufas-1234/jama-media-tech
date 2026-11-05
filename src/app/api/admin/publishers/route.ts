import { NextResponse } from 'next/server';
import { getAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { createPublisher, deletePublisher, listPublishers } from '@/lib/admin-publishers';
import { tidbIsConfigured } from '@/lib/tidb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

function isDuplicateEmail(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error &&
    (error.code === 'ER_DUP_ENTRY' || error.code === '1062');
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only an admin can manage publisher accounts.' }, { status: 403, headers: noStore });
  if (!tidbIsConfigured()) return NextResponse.json({ error: 'TiDB must be configured to manage publisher accounts.' }, { status: 503, headers: noStore });

  try {
    return NextResponse.json({ publishers: await listPublishers() }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Publisher accounts could not be loaded.';
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only an admin can create publisher accounts.' }, { status: 403, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  if (!tidbIsConfigured()) return NextResponse.json({ error: 'TiDB must be configured to manage publisher accounts.' }, { status: 503, headers: noStore });

  let body: Record<string, unknown>;
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    body = value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Publisher details must be valid JSON.' }, { status: 400, headers: noStore });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (name.length < 2 || name.length > 120) return NextResponse.json({ error: 'Name must be between 2 and 120 characters.' }, { status: 400, headers: noStore });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400, headers: noStore });
  if (email === process.env.ADMIN_USERNAME?.trim().toLowerCase()) return NextResponse.json({ error: 'This email is already reserved for the primary admin account.' }, { status: 409, headers: noStore });
  if (password.length < 12 || password.length > 256) return NextResponse.json({ error: 'Password must be between 12 and 256 characters.' }, { status: 400, headers: noStore });

  try {
    const publisher = await createPublisher(name, email, password);
    return NextResponse.json({ publisher }, { status: 201, headers: noStore });
  } catch (error) {
    if (isDuplicateEmail(error)) return NextResponse.json({ error: 'A publisher with this email already exists.' }, { status: 409, headers: noStore });
    const message = error instanceof Error ? error.message : 'Publisher account could not be created.';
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only an admin can remove publisher accounts.' }, { status: 403, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  if (!tidbIsConfigured()) return NextResponse.json({ error: 'TiDB must be configured to manage publisher accounts.' }, { status: 503, headers: noStore });

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'A valid publisher ID is required.' }, { status: 400, headers: noStore });
  try {
    if (!(await deletePublisher(id))) return NextResponse.json({ error: 'Publisher account was not found.' }, { status: 404, headers: noStore });
    return NextResponse.json({ deleted: true }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Publisher account could not be removed.';
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}
