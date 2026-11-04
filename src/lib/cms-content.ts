import 'server-only';

import { unstable_cache } from 'next/cache';
import { getLocalPosts, type ManagedPost } from '@/lib/local-news-store';
import { tidbHasConfiguration, tidbIsConfigured } from '@/lib/tidb';
import { getPublishedTiDBPostBySlug, getPublishedTiDBPosts } from '@/lib/tidb-store';

export type ContentItem = {
  id: number;
  slug: string;
  date: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'publish';
  category: string;
  location: string;
  imageUrl: string;
};
export type ContentResult = { items: ContentItem[]; available: boolean };

function postToContentItem(post: ManagedPost): ContentItem {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    status: post.status,
    category: post.category,
    location: post.location,
    imageUrl: post.imageUrl,
  };
}

const getCachedPublishedPosts = unstable_cache(
  async (contentType: 'news' | 'project') => getPublishedTiDBPosts(contentType),
  ['jama-published-posts'],
  { revalidate: 300, tags: ['cms-content'] },
);

const getCachedPublishedPost = unstable_cache(
  async (contentType: 'news' | 'project', slug: string) => getPublishedTiDBPostBySlug(contentType, slug),
  ['jama-published-post'],
  { revalidate: 300, tags: ['cms-content'] },
);

async function getPosts(contentType: 'news' | 'project'): Promise<ContentResult> {
  if (tidbIsConfigured()) {
    try {
      return { items: (await getCachedPublishedPosts(contentType)).map(postToContentItem), available: true };
    } catch (error) {
      console.error(`TiDB ${contentType} content is unavailable.`, error);
      return { items: [], available: false };
    }
  }
  if (!tidbHasConfiguration() && process.env.NODE_ENV === 'development') {
    const items = (await getLocalPosts(contentType)).filter((post) => post.status === 'publish').map(postToContentItem);
    return { items, available: true };
  }
  return { items: [], available: false };
}

export const getNews = () => getPosts('news');
export const getProjects = () => getPosts('project');

async function getPostBySlug(contentType: 'news' | 'project', slug: string) {
  if (tidbIsConfigured()) {
    try {
      const post = await getCachedPublishedPost(contentType, slug);
      return post ? postToContentItem(post) : undefined;
    } catch (error) {
      console.error(`TiDB ${contentType} content is unavailable.`, error);
      return undefined;
    }
  }
  if (!tidbHasConfiguration() && process.env.NODE_ENV === 'development') {
    const post = (await getLocalPosts(contentType)).find((item) => item.slug === slug && item.status === 'publish');
    return post ? postToContentItem(post) : undefined;
  }
  return undefined;
}

export const getArticleBySlug = (slug: string) => getPostBySlug('news', slug);
export const getProjectBySlug = (slug: string) => getPostBySlug('project', slug);
