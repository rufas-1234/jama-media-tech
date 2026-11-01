import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export type ContentKind = 'news' | 'project';

export type PostDraft = {
  contentType: ContentKind;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'publish';
  category: string;
  location: string;
  imageUrl: string;
};

export type ManagedPost = PostDraft & {
  id: number;
  date: string;
  modified: string;
};

const storePath = join(process.cwd(), 'data', 'news-posts.json');

async function readStore(): Promise<ManagedPost[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(storePath, 'utf8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value) => {
      if (typeof value !== 'object' || value === null) return [];
      const post = value as Record<string, unknown>;
      if (typeof post.id !== 'number' || typeof post.title !== 'string' || typeof post.slug !== 'string' ||
        typeof post.excerpt !== 'string' || typeof post.content !== 'string' ||
        (post.status !== 'draft' && post.status !== 'publish') || typeof post.date !== 'string' ||
        typeof post.modified !== 'string') return [];
      return [{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
        date: post.date,
        modified: post.modified,
        contentType: post.contentType === 'project' ? 'project' as const : 'news' as const,
        category: typeof post.category === 'string' ? post.category : '',
        location: typeof post.location === 'string' ? post.location : '',
        imageUrl: typeof post.imageUrl === 'string' ? post.imageUrl : '',
      }];
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeStore(posts: ManagedPost[]) {
  await mkdir(dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(posts, null, 2), 'utf8');
  await rename(temporaryPath, storePath);
}

export async function getLocalPosts(contentType?: ContentKind) {
  const posts = await readStore();
  return posts.filter((post) => !contentType || post.contentType === contentType)
    .sort((left, right) => right.modified.localeCompare(left.modified));
}

export async function createLocalPost(draft: PostDraft) {
  const posts = await readStore();
  const now = new Date().toISOString();
  const post: ManagedPost = {
    ...draft,
    id: Math.max(0, ...posts.map((item) => item.id)) + 1,
    date: draft.status === 'publish' ? now : '',
    modified: now,
  };
  await writeStore([post, ...posts]);
  return post;
}

export async function updateLocalPost(id: number, draft: PostDraft) {
  const posts = await readStore();
  const existing = posts.find((post) => post.id === id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  const updated: ManagedPost = {
    ...existing,
    ...draft,
    date: draft.status === 'publish' ? existing.date || now : '',
    modified: now,
  };
  await writeStore(posts.map((post) => post.id === id ? updated : post));
  return updated;
}

export async function deleteLocalPost(id: number) {
  const posts = await readStore();
  const remaining = posts.filter((post) => post.id !== id);
  if (remaining.length === posts.length) return false;
  await writeStore(remaining);
  return true;
}

export function localPostToContentItem(post: ManagedPost) {
  const paragraphHtml = (value: string) => value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`)
    .join('');

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    status: post.status,
    title: { rendered: post.title },
    content: { rendered: paragraphHtml(post.content) },
    excerpt: { rendered: paragraphHtml(post.excerpt) },
    meta: {
      jama_project_category: post.category,
      jama_project_location: post.location,
      jama_cover_image: post.imageUrl,
    },
    ...(post.imageUrl ? { _embedded: { 'wp:featuredmedia': [{ source_url: post.imageUrl, alt_text: post.title }] } } : {}),
  };
}