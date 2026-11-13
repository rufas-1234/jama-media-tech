import { NextResponse } from 'next/server';
import { createBusinessRequest, isBusinessRequestsTableMissing } from '@/lib/business-requests';
import { validateBusinessRequest } from '@/lib/business-request-validation';
import { isSameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  if (!request.headers.get('origin') || !isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  }
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return NextResponse.json({ error: 'Request details are too large.' }, { status: 413, headers: noStore });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > 16_384) {
      return NextResponse.json({ error: 'Request details are too large.' }, { status: 413, headers: noStore });
    }
    body = JSON.parse(raw) as unknown;
  } catch {
    return NextResponse.json({ error: 'Request data must be valid JSON.' }, { status: 400, headers: noStore });
  }
  const validated = validateBusinessRequest(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400, headers: noStore });

  try {
    const saved = await createBusinessRequest(validated.request);
    return NextResponse.json({ requestId: saved.id }, { status: 201, headers: noStore });
  } catch (error) {
    console.error('Business request could not be saved.', error);
    if (isBusinessRequestsTableMissing(error)) {
      return NextResponse.json({ error: 'Request submissions are temporarily unavailable. Please contact Jama Tech directly.' }, { status: 503, headers: noStore });
    }
    const message = error instanceof Error ? error.message : 'Request could not be saved.';
    const status = message.includes('not configured') ? 503 : 502;
    return NextResponse.json({ error: status === 503 ? message : 'Request could not be saved. Please try again later.' }, { status, headers: noStore });
  }
}
