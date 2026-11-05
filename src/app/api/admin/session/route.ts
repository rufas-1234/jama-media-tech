import { NextResponse } from 'next/server';
import { adminAuthConfigured, authenticateAdmin, clearAdminSession, hasAdminSession, isSameOriginRequest, setAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function noStoreHeaders() {
  return { 'Cache-Control': 'no-store' };
}

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ error: 'Admin login is not configured on this server.' }, { status: 503, headers: noStoreHeaders() });
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStoreHeaders() });
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a username and password.' }, { status: 400, headers: noStoreHeaders() });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const principal = await authenticateAdmin(username, password);
  if (!principal) {
    return NextResponse.json({ error: 'The username or password is incorrect.' }, { status: 401, headers: noStoreHeaders() });
  }

  await setAdminSession(principal);
  return NextResponse.json({ authenticated: true }, { headers: noStoreHeaders() });
}

export async function DELETE() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStoreHeaders() });
  }
  await clearAdminSession();
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}