import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { createAdminPost, listAdminPosts, postStorageMode } from '@/lib/admin-posts';
import { validateDraft } from '@/lib/admin-post-validation';
import type { ContentKind } from '@/lib/local-news-store';

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

function requestedType(request: Request): ContentKind {
  return new URL(request.url).searchParams.get('type') === 'project' ? 'project' : 'news';
}

export async function GET(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  try {
    const contentType = requestedType(request);
    return NextResponse.json({ posts: await listAdminPosts(contentType), storage: postStorageMode() }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Posts could not be loaded.';
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Post data must be valid JSON.' }, { status: 400, headers: noStore });
  }

  const validated = validateDraft(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400, headers: noStore });
  try {
    const post = await createAdminPost(validated.draft);
    await revalidateNews();
    return NextResponse.json({ post }, { status: 201, headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Post could not be created.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}