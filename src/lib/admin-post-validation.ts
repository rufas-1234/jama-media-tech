import type { PostDraft } from '@/lib/local-news-store';

function slugify(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
}

export function validateDraft(value: unknown): { draft: PostDraft } | { error: string } {
  if (!value || typeof value !== 'object') return { error: 'Post data is required.' };
  const body = value as Record<string, unknown>;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const contentType = body.contentType === 'project' ? 'project' : 'news';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
  const status = body.status === 'publish' ? 'publish' : body.status === 'draft' ? 'draft' : null;
  const requestedSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const slug = slugify(requestedSlug || title);

  if (title.length < 3 || title.length > 180) return { error: 'Title must be between 3 and 180 characters.' };
  if (!slug) return { error: 'Add a title that can be used to create a URL.' };
  if (excerpt.length > 500) return { error: 'Summary must be 500 characters or fewer.' };
  if (content.length < 1 || content.length > 50000) return { error: 'Post body must be between 1 and 50,000 characters.' };
  if (!status) return { error: 'Choose draft or published status.' };
  if (contentType === 'project' && !category) return { error: 'Choose a project category.' };
  if (contentType === 'project' && !location) return { error: 'Add the project location.' };
  if (category.length > 100 || location.length > 160) return { error: 'Project category or location is too long.' };
  const isLocalUpload = imageUrl.startsWith('/uploads/') && !imageUrl.includes('..');
  if (imageUrl && (imageUrl.length > 2000 || (!isLocalUpload && !/^https?:\/\//i.test(imageUrl)))) return { error: 'Cover image must be an uploaded image or an HTTP/HTTPS URL.' };
  return { draft: { title, slug, excerpt, content, status, contentType, category, location, imageUrl } };
}