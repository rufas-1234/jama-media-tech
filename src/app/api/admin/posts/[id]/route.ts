import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { deleteAdminPost, updateAdminPost } from '@/lib/admin-posts';
import { validateDraft } from '@/lib/admin-post-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

async function revalidateNews() {
  revalidateTag('cms-content', { expire: 0 });
  revalidatePath('/', 'page');
  revalidatePath('/news', 'page');
  revalidatePath('/news/[slug]', 'page');
  revalidatePath('/projects', 'page');
  revalidatePath('/projects/[slug]', 'page');
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'Post ID is invalid.' }, { status: 400, headers: noStore });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Post data must be valid JSON.' }, { status: 400, headers: noStore });
  }
  const validated = validateDraft(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400, headers: noStore });
  try {
    const post = await updateAdminPost(id, validated.draft);
    if (!post) return NextResponse.json({ error: 'Post was not found.' }, { status: 404, headers: noStore });
    await revalidateNews();
    return NextResponse.json({ post }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Post could not be updated.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'Post ID is invalid.' }, { status: 400, headers: noStore });
  const contentType = new URL(request.url).searchParams.get('type') === 'project' ? 'project' : 'news';
  try {
    if (!(await deleteAdminPost(id, contentType))) return NextResponse.json({ error: 'Post was not found.' }, { status: 404, headers: noStore });
    await revalidateNews();
    return new Response(null, { status: 204, headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Post could not be deleted.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}