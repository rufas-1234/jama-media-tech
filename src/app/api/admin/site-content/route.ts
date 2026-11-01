import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { getAdminSiteContent, saveSiteContent, siteContentStorage } from '@/lib/site-content';
import { validateSiteContent } from '@/lib/site-content-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (siteContentStorage() === 'unavailable') return NextResponse.json({ error: 'Site content storage is not configured for this server.' }, { status: 503, headers: noStore });
  try {
    return NextResponse.json({ content: await getAdminSiteContent(), storage: siteContentStorage() }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Site content could not be loaded.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  if (siteContentStorage() === 'unavailable') return NextResponse.json({ error: 'Site content storage is not configured for this server.' }, { status: 503, headers: noStore });
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > 300_000) return NextResponse.json({ error: 'Site content is too large.' }, { status: 413, headers: noStore });

  try {
    const content = validateSiteContent(await request.json());
    await saveSiteContent(content);
    revalidateTag('site-content', { expire: 0 });
    revalidatePath('/', 'layout');
    revalidatePath('/about', 'page');
    revalidatePath('/contact', 'page');
    revalidatePath('/services', 'page');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/leadership', 'page');
    return NextResponse.json({ content, storage: siteContentStorage() }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Site content could not be saved.';
    return NextResponse.json({ error: message }, { status: 400, headers: noStore });
  }
}