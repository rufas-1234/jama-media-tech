import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { createAdminPost, listAdminPosts } from '@/lib/admin-posts';
import { fallbackProjects } from '@/lib/project-content';
import { getAdminSiteContent, saveSiteContent } from '@/lib/site-content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });

  try {
    const content = await getAdminSiteContent();
    if (content.projectsInitialized) return NextResponse.json({ imported: 0 }, { headers: noStore });

    const existing = await listAdminPosts('project');
    const fallbackSlugs = new Set(fallbackProjects.map((project) => project.slug));
    const conflictingDrafts = existing.filter((post) => post.status === 'draft' && fallbackSlugs.has(post.slug));
    if (conflictingDrafts.length) {
      const titles = conflictingDrafts.map((post) => `“${post.title}”`).join(', ');
      return NextResponse.json({
        error: `Resolve these draft projects with matching sample URLs before importing: ${titles}. Publish them, rename them, or delete them.`,
      }, { status: 409, headers: noStore });
    }

    const existingSlugs = new Set(existing.map((post) => post.slug));
    const missingProjects = fallbackProjects.filter((project) => !existingSlugs.has(project.slug));

    for (const project of missingProjects) {
      await createAdminPost({
        contentType: 'project',
        title: project.title,
        slug: project.slug,
        excerpt: project.description,
        content: project.content,
        status: 'publish',
        category: project.category,
        location: project.location,
        imageUrl: project.image,
        imageUrls: project.images,
      });
    }

    await saveSiteContent({ ...content, projectsInitialized: true });

    revalidateTag('cms-content', { expire: 0 });
    revalidateTag('site-content', { expire: 0 });
    revalidatePath('/projects', 'page');
    revalidatePath('/projects/[slug]', 'page');

    return NextResponse.json({ imported: missingProjects.length }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Site projects could not be imported.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}
