import 'server-only';

import { getLocalPosts, createLocalPost, updateLocalPost, deleteLocalPost, type ContentKind, type ManagedPost, type PostDraft } from '@/lib/local-news-store';
import { createWordPressPost, deleteWordPressPost, getWordPressPosts, isWordPressAdminConfigured, updateWordPressPost } from '@/lib/wordpress-admin';

export function postStorageMode(): 'wordpress' | 'local' | 'unavailable' {
  if (isWordPressAdminConfigured()) return 'wordpress';
  if (process.env.WORDPRESS_API_URL) return 'unavailable';
  return process.env.NODE_ENV === 'development' ? 'local' : 'unavailable';
}

export async function listAdminPosts(contentType: ContentKind): Promise<ManagedPost[]> {
  if (postStorageMode() === 'wordpress') return getWordPressPosts(contentType);
  if (postStorageMode() === 'local') return getLocalPosts(contentType);
  throw new Error('WordPress publishing is not configured for this deployment.');
}

export async function createAdminPost(draft: PostDraft): Promise<ManagedPost> {
  if (postStorageMode() === 'wordpress') return createWordPressPost(draft);
  if (postStorageMode() === 'local') return createLocalPost(draft);
  throw new Error('WordPress publishing is not configured for this deployment.');
}

export async function updateAdminPost(id: number, draft: PostDraft): Promise<ManagedPost | undefined> {
  if (postStorageMode() === 'wordpress') return updateWordPressPost(id, draft.contentType, draft);
  if (postStorageMode() === 'local') return updateLocalPost(id, draft);
  throw new Error('WordPress publishing is not configured for this deployment.');
}

export async function deleteAdminPost(id: number, contentType: ContentKind): Promise<boolean> {
  if (postStorageMode() === 'wordpress') return deleteWordPressPost(id, contentType);
  if (postStorageMode() === 'local') return deleteLocalPost(id);
  throw new Error('WordPress publishing is not configured for this deployment.');
}