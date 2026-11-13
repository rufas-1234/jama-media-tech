import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getBusinessRequests, isBusinessRequestsTableMissing, requestStorageMode } from '@/lib/business-requests';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only an admin can access customer requests.' }, { status: 403, headers: noStore });
  if (requestStorageMode() === 'unavailable') return NextResponse.json({ error: 'Request storage is not configured for this server.' }, { status: 503, headers: noStore });
  try {
    return NextResponse.json({ requests: await getBusinessRequests(), storage: requestStorageMode() }, { headers: noStore });
  } catch (error) {
    console.error('Business requests could not be loaded.', error);
    if (isBusinessRequestsTableMissing(error)) {
      return NextResponse.json({ error: 'Business request storage is not initialized. Apply db/migrations/004-business-requests.sql.' }, { status: 503, headers: noStore });
    }
    const message = error instanceof Error ? error.message : 'Business requests could not be loaded.';
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}
