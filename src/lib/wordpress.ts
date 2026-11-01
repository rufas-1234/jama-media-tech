import 'server-only';
import { getLocalPosts, localPostToContentItem } from '@/lib/local-news-store';

export type ContentItem = {
  id: number; slug: string; date: string;
  title: { rendered: string }; content: { rendered: string }; excerpt?: { rendered: string };
  status?: string;
  meta?: Record<string, string | number | boolean>;
  _embedded?: { 'wp:featuredmedia'?: { source_url: string; alt_text: string }[]; author?: { name: string }[] };
};
export type ContentResult = { items: ContentItem[]; available: boolean };
// Text-only rendering is deliberate: CMS HTML is not trusted as executable markup.
export function plainText(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
async function fetchContent(type: string, slug?: string): Promise<ContentResult> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) return { items: [], available: false };
  try {
    const items: ContentItem[] = [];
    let pages = 1;
    for (let page = 1; page <= pages; page++) {
      const query = new URLSearchParams({ _embed: '1', per_page: '100', page: String(page), status: 'publish' });
      if (slug) query.set('slug', slug);
      const response = await fetch(`${base.replace(/\/$/, '')}/wp/v2/${type}?${query}`, { next: { revalidate: 300, tags: ['wordpress'] }, signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`CMS returned ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid CMS collection');
      items.push(...data as ContentItem[]);
      pages = Number(response.headers.get('X-WP-TotalPages') || 1);
    }
    return { items, available: true };
  } catch {
    console.error(`CMS content unavailable: ${type}`);
    return { items: [], available: false };
  }
}
export const getPages = () => fetchContent('pages');
export const getServices = () => fetchContent('services');
export const getServiceBySlug = async (slug: string) => (await fetchContent('services', slug)).items[0];
export const getLeadership = () => fetchContent('leadership');
export async function getNews(): Promise<ContentResult> {
  if (process.env.WORDPRESS_API_URL) return fetchContent('posts');
  if (process.env.NODE_ENV === 'development') {
    const items = (await getLocalPosts('news')).filter((post) => post.status === 'publish').map(localPostToContentItem);
    return { items, available: true };
  }
  return { items: [], available: false };
}

export async function getArticleBySlug(slug: string) {
  if (process.env.WORDPRESS_API_URL) return (await fetchContent('posts', slug)).items[0];
  if (process.env.NODE_ENV === 'development') {
    const post = (await getLocalPosts('news')).find((item) => item.slug === slug && item.status === 'publish');
    return post ? localPostToContentItem(post) : undefined;
  }
  return undefined;
}

export async function getProjects(): Promise<ContentResult> {
  if (process.env.WORDPRESS_API_URL) return fetchContent('projects');
  if (process.env.NODE_ENV === 'development') {
    const items = (await getLocalPosts('project')).filter((project) => project.status === 'publish').map(localPostToContentItem);
    return { items, available: true };
  }
  return { items: [], available: false };
}

export async function getProjectBySlug(slug: string) {
  if (process.env.WORDPRESS_API_URL) return (await fetchContent('projects', slug)).items[0];
  if (process.env.NODE_ENV === 'development') {
    const project = (await getLocalPosts('project')).find((item) => item.slug === slug && item.status === 'publish');
    return project ? localPostToContentItem(project) : undefined;
  }
  return undefined;
}

export const getPageBySlug = async (slug: string) => (await fetchContent('pages', slug)).items[0];