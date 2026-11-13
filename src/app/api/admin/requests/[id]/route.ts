import { NextResponse } from 'next/server';
import { getAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { isBusinessRequestsTableMissing, requestStorageMode, updateBusinessRequest } from '@/lib/business-requests';
import { validateBusinessRequestUpdate } from '@/lib/business-request-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only an admin can update customer requests.' }, { status: 403, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  if (requestStorageMode() === 'unavailable') return NextResponse.json({ error: 'Request storage is not configured for this server.' }, { status: 503, headers: noStore });

  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'Request ID is invalid.' }, { status: 400, headers: noStore });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request update must be valid JSON.' }, { status: 400, headers: noStore });
  }
  const validated = validateBusinessRequestUpdate(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400, headers: noStore });

  try {
    const updated = await updateBusinessRequest(id, validated.update);
    if (!updated) return NextResponse.json({ error: 'Request was not found.' }, { status: 404, headers: noStore });
    return NextResponse.json({ request: updated }, { headers: noStore });
  } catch (error) {
    console.error(`Business request ${id} could not be updated.`, error);
    if (isBusinessRequestsTableMissing(error)) {
      return NextResponse.json({ error: 'Business request storage is not initialized. Apply db/migrations/004-business-requests.sql.' }, { status: 503, headers: noStore });
    }
    return NextResponse.json({ error: 'Request could not be updated. Please try again.' }, { status: 502, headers: noStore });
  }
}
