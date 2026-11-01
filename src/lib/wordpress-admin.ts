import 'server-only';

import { plainText } from '@/lib/wordpress';
import type { ContentKind, ManagedPost, PostDraft } from '@/lib/local-news-store';
import type { SiteContent } from '@/lib/site-content';

type WordPressField = { rendered?: string; raw?: string };
type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  status: string;
  title: WordPressField;
  excerpt: WordPressField;
  content: WordPressField;
  meta?: Record<string, string | number | boolean>;
};

type WordPressSiteSettings = {
  id: number;
  meta?: { jama_site_content?: string };
};

export function isWordPressAdminConfigured() {
  return Boolean(process.env.WORDPRESS_API_URL && process.env.WORDPRESS_API_USER && process.env.WORDPRESS_API_PASSWORD);
}

function postsEndpoint(contentType: ContentKind) {
  const base = process.env.WORDPRESS_API_URL;
  const username = process.env.WORDPRESS_API_USER;
  const password = process.env.WORDPRESS_API_PASSWORD;
  if (!base || !username || !password) throw new Error('WordPress publishing is not configured.');
  return {
    url: `${base.replace(/\/$/, '')}/wp/v2/${contentType === 'project' ? 'projects' : 'posts'}`,
    authorization: `Basic ${Buffer.from(`${username}:${password.replace(/\s/g, '')}`).toString('base64')}`,
  };
}

function toManagedPost(post: WordPressPost, contentType: ContentKind): ManagedPost {
  const rawText = (field: WordPressField) => {
    const value = field.raw ?? field.rendered ?? '';
    return plainText(value).replace(/\s*\n\s*/g, '\n').trim();
  };
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    status: post.status === 'publish' ? 'publish' : 'draft',
    contentType,
    category: String(post.meta?.jama_project_category ?? ''),
    location: String(post.meta?.jama_project_location ?? ''),
    imageUrl: String(post.meta?.jama_cover_image ?? ''),
    title: rawText(post.title),
    excerpt: rawText(post.excerpt),
    content: rawText(post.content),
  };
}

function htmlParagraphs(text: string) {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    .map((part) => `<p>${escape(part).replace(/\n/g, '<br>')}</p>`).join('');
}

async function requestWordPress<T>(contentType: ContentKind, path = '', init: RequestInit = {}): Promise<T> {
  const { url, authorization } = postsEndpoint(contentType);
  const response = await fetch(`${url}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`WordPress post request failed (${response.status}): ${detail.slice(0, 500)}`);
    throw new Error(response.status === 401 || response.status === 403
      ? 'WordPress rejected the configured application password or permissions.'
      : `WordPress could not complete the request (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getWordPressPosts(contentType: ContentKind) {
  const data = await requestWordPress<WordPressPost[]>(contentType, '?context=edit&status=any&per_page=100&orderby=modified&order=desc');
  if (!Array.isArray(data)) throw new Error('WordPress returned an invalid post list.');
  return data.map((post) => toManagedPost(post, contentType));
}

export async function createWordPressPost(draft: PostDraft) {
  const post = await requestWordPress<WordPressPost>(draft.contentType, '', {
    method: 'POST',
    body: JSON.stringify({
      title: draft.title,
      slug: draft.slug,
      excerpt: htmlParagraphs(draft.excerpt),
      content: htmlParagraphs(draft.content),
      status: draft.status,
      meta: {
        jama_project_category: draft.category,
        jama_project_location: draft.location,
        jama_cover_image: draft.imageUrl,
      },
    }),
  });
  return toManagedPost(post, draft.contentType);
}

export async function updateWordPressPost(id: number, contentType: ContentKind, draft: PostDraft) {
  try {
    const post = await requestWordPress<WordPressPost>(contentType, `/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        title: draft.title,
        slug: draft.slug,
        excerpt: htmlParagraphs(draft.excerpt),
        content: htmlParagraphs(draft.content),
        status: draft.status,
        meta: {
          jama_project_category: draft.category,
          jama_project_location: draft.location,
          jama_cover_image: draft.imageUrl,
        },
      }),
    });
    return toManagedPost(post, contentType);
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return undefined;
    throw error;
  }
}

export async function deleteWordPressPost(id: number, contentType: ContentKind) {
  try {
    await requestWordPress<undefined>(contentType, `/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return false;
    throw error;
  }
}

export async function uploadWordPressMedia(filename: string, mimeType: string, bytes: Buffer) {
  const { authorization } = postsEndpoint('news');
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WordPress publishing is not configured.');
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);
  const response = await fetch(`${base.replace(/\/$/, '')}/wp/v2/media`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: authorization,
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`WordPress media upload failed (${response.status}): ${detail.slice(0, 500)}`);
    throw new Error(response.status === 401 || response.status === 403
      ? 'WordPress rejected media upload permissions. Check the application password and upload_files capability.'
      : `WordPress could not store the image (${response.status}).`);
  }
  const media: unknown = await response.json();
  if (!media || typeof media !== 'object' || !('source_url' in media) || typeof media.source_url !== 'string') {
    throw new Error('WordPress returned an invalid media URL.');
  }
  return media.source_url;
}

async function requestSiteSettings<T>(path = '', init: RequestInit = {}): Promise<T> {
  const { url, authorization } = postsEndpoint('news');
  const endpoint = url.replace(/\/posts$/, '/site-settings');
  const response = await fetch(`${endpoint}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`WordPress site settings failed (${response.status}): ${detail.slice(0, 500)}`);
    throw new Error(response.status === 401 || response.status === 403
      ? 'WordPress rejected the configured application password or permissions.'
      : `WordPress site settings could not be loaded (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function getWordPressSiteContent(): Promise<SiteContent | undefined> {
  const records = await requestSiteSettings<WordPressSiteSettings[]>('?context=edit&status=any&slug=jama-site-content');
  const serialized = Array.isArray(records) ? records[0]?.meta?.jama_site_content : undefined;
  if (!serialized) return undefined;
  try {
    const value: unknown = JSON.parse(serialized);
    if (value && typeof value === 'object' && 'company' in value && 'homepage' in value && 'services' in value && 'teamMembers' in value) {
      return value as SiteContent;
    }
  } catch {
    throw new Error('WordPress site settings contain invalid JSON.');
  }
  throw new Error('WordPress site settings are missing required fields.');
}

export async function saveWordPressSiteContent(content: SiteContent): Promise<SiteContent> {
  const records = await requestSiteSettings<WordPressSiteSettings[]>('?context=edit&status=any&slug=jama-site-content');
  const recordId = Array.isArray(records) ? records[0]?.id : undefined;
  const path = recordId ? `/${recordId}` : '';
  await requestSiteSettings<WordPressSiteSettings>(path, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Jama Tech site settings',
      slug: 'jama-site-content',
      status: 'private',
      content: '',
      meta: { jama_site_content: JSON.stringify(content) },
    }),
  });
  return content;
}