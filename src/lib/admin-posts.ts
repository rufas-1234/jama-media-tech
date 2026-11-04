import 'server-only';

import { getLocalPosts, createLocalPost, updateLocalPost, deleteLocalPost, type ContentKind, type ManagedPost, type PostDraft } from '@/lib/local-news-store';
import { tidbHasConfiguration, tidbIsConfigured } from '@/lib/tidb';
import { createTiDBPost, deleteTiDBPost, getAdminTiDBPosts, updateTiDBPost } from '@/lib/tidb-store';

export function postStorageMode(): 'tidb' | 'local' | 'unavailable' {
  if (tidbIsConfigured()) return 'tidb';
  if (tidbHasConfiguration()) return 'unavailable';
  return process.env.NODE_ENV === 'development' ? 'local' : 'unavailable';
}

export async function listAdminPosts(contentType: ContentKind): Promise<ManagedPost[]> {
  if (postStorageMode() === 'tidb') return getAdminTiDBPosts(contentType);
  if (postStorageMode() === 'local') return getLocalPosts(contentType);
  throw new Error('TiDB is not configured for this deployment.');
}

export async function createAdminPost(draft: PostDraft): Promise<ManagedPost> {
  if (postStorageMode() === 'tidb') return createTiDBPost(draft);
  if (postStorageMode() === 'local') return createLocalPost(draft);
  throw new Error('TiDB is not configured for this deployment.');
}

export async function updateAdminPost(id: number, draft: PostDraft): Promise<ManagedPost | undefined> {
  if (postStorageMode() === 'tidb') return updateTiDBPost(id, draft);
  if (postStorageMode() === 'local') return updateLocalPost(id, draft);
  throw new Error('TiDB is not configured for this deployment.');
}

export async function deleteAdminPost(id: number, contentType: ContentKind): Promise<boolean> {
  if (postStorageMode() === 'tidb') return deleteTiDBPost(id, contentType);
  if (postStorageMode() === 'local') return deleteLocalPost(id);
  throw new Error('TiDB is not configured for this deployment.');
}