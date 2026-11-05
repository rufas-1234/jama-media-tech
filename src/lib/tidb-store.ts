import 'server-only';

import { unstable_cache } from 'next/cache';
import { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import type { SiteContent } from '@/lib/site-content';
import type { ContentKind, ManagedPost, PostDraft } from '@/lib/local-news-store';
import { getTiDBPool } from '@/lib/tidb';

type PostRow = RowDataPacket & {
  id: number | string | bigint;
  content_type: ContentKind;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'publish';
  category: string;
  location: string;
  image_url: string;
  gallery_images: string | string[] | null;
  date: Date | string | null;
  modified: Date | string;
};

function toIsoDate(value: Date | string | null) {
  if (value === null) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('TiDB returned an invalid post date.');
  return date.toISOString();
}

function toManagedPost(row: PostRow): ManagedPost {
  const id = Number(row.id);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('TiDB returned an invalid post ID.');
  let galleryImages: string[] = [];
  if (Array.isArray(row.gallery_images)) galleryImages = row.gallery_images.filter((image): image is string => typeof image === 'string');
  else if (typeof row.gallery_images === 'string' && row.gallery_images) {
    try {
      const parsed: unknown = JSON.parse(row.gallery_images);
      if (Array.isArray(parsed)) galleryImages = parsed.filter((image): image is string => typeof image === 'string');
    } catch (error) {
      console.error(`TiDB returned invalid gallery images for post ${id}.`, error);
    }
  }
  const imageUrls = [...new Set([row.image_url, ...galleryImages].filter(Boolean))];
  return {
    id,
    contentType: row.content_type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    category: row.category,
    location: row.location,
    imageUrl: imageUrls[0] ?? '',
    imageUrls,
    date: toIsoDate(row.date),
    modified: toIsoDate(row.modified),
  };
}

const postColumns = '`id`, `content_type`, `title`, `slug`, `excerpt`, `content`, `status`, `category`, `location`, `image_url`, `gallery_images`, `date`, `modified`';

export async function getPublishedTiDBPosts(contentType: ContentKind) {
  const [rows] = await getTiDBPool().execute<PostRow[]>(
    `SELECT ${postColumns} FROM posts WHERE content_type = ? AND status = 'publish' ORDER BY \`date\` DESC, id DESC`,
    [contentType],
  );
  return rows.map(toManagedPost);
}

export async function getPublishedTiDBPostBySlug(contentType: ContentKind, slug: string) {
  const [rows] = await getTiDBPool().execute<PostRow[]>(
    `SELECT ${postColumns} FROM posts WHERE content_type = ? AND slug = ? AND status = 'publish' LIMIT 1`,
    [contentType, slug],
  );
  return rows[0] ? toManagedPost(rows[0]) : undefined;
}

export async function getAdminTiDBPosts(contentType: ContentKind) {
  const [rows] = await getTiDBPool().execute<PostRow[]>(
    `SELECT ${postColumns} FROM posts WHERE content_type = ? ORDER BY modified DESC, id DESC`,
    [contentType],
  );
  return rows.map(toManagedPost);
}

export async function createTiDBPost(draft: PostDraft) {
  const now = new Date();
  const publishedAt = draft.status === 'publish' ? now : null;
  const [result] = await getTiDBPool().execute<ResultSetHeader>(
    `INSERT INTO posts (content_type, title, slug, excerpt, content, status, category, location, image_url, gallery_images, \`date\`, modified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [draft.contentType, draft.title, draft.slug, draft.excerpt, draft.content, draft.status, draft.category, draft.location, draft.imageUrl, JSON.stringify(draft.imageUrls), publishedAt, now],
  );
  const id = Number(result.insertId);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('TiDB did not return a valid post ID.');
  return { ...draft, id, date: publishedAt?.toISOString() ?? '', modified: now.toISOString() };
}

export async function updateTiDBPost(id: number, draft: PostDraft) {
  const now = new Date();
  await getTiDBPool().execute(
    `UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, status = ?, category = ?, location = ?, image_url = ?, gallery_images = ?,
     \`date\` = IF(? = 'publish', COALESCE(\`date\`, ?), NULL), modified = ?
     WHERE id = ? AND content_type = ?`,
    [draft.title, draft.slug, draft.excerpt, draft.content, draft.status, draft.category, draft.location, draft.imageUrl, JSON.stringify(draft.imageUrls), draft.status, now, now, id, draft.contentType],
  );
  const [rows] = await getTiDBPool().execute<PostRow[]>(
    `SELECT ${postColumns} FROM posts WHERE id = ? AND content_type = ? LIMIT 1`,
    [id, draft.contentType],
  );
  return rows[0] ? toManagedPost(rows[0]) : undefined;
}

export async function deleteTiDBPost(id: number, contentType: ContentKind) {
  const [result] = await getTiDBPool().execute<ResultSetHeader>(
    'DELETE FROM posts WHERE id = ? AND content_type = ?',
    [id, contentType],
  );
  return result.affectedRows > 0;
}

export async function getTiDBSiteContent(): Promise<SiteContent | undefined> {
  const [rows] = await getTiDBPool().execute<RowDataPacket[]>(
    'SELECT content FROM site_settings WHERE setting_key = ? LIMIT 1',
    ['main'],
  );
  if (!rows[0]) return undefined;
  const stored: unknown = rows[0].content;
  const content = typeof stored === 'string' ? JSON.parse(stored) as unknown : stored;
  if (!content || typeof content !== 'object' || !('company' in content) || !('homepage' in content) || !('services' in content) || !('teamMembers' in content)) {
    throw new Error('TiDB contains an invalid site content record.');
  }
  return content as SiteContent;
}

export const getCachedTiDBSiteContent = unstable_cache(
  async () => getTiDBSiteContent(),
  ['jama-site-content'],
  { revalidate: 300, tags: ['site-content'] },
);

export async function saveTiDBSiteContent(content: SiteContent) {
  await getTiDBPool().execute(
    `INSERT INTO site_settings (setting_key, content) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = CURRENT_TIMESTAMP(3)`,
    ['main', JSON.stringify(content)],
  );
}
