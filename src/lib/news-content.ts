import { getNews, type ContentItem } from '@/lib/cms-content';
import { imageSource } from '@/lib/content';

export type NewsCard = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  images: string[];
};

export const fallbackArticles: NewsCard[] = [
  { slug: 'community-recovery', title: 'Community resilience through practical local action', excerpt: 'How sustainable operations and digital systems can support long-term resilience in challenging environments.', content: 'Practical action, sustainable systems and local partnerships can help communities recover, adapt and build healthier futures in complex operating environments.', date: 'October 2026', category: 'Community', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'] },
  { slug: 'digital-inclusion', title: 'Digital inclusion and stronger institutional systems', excerpt: 'Connecting information, operations and access to build smarter and more responsive institutions.', content: 'Technology should support organisational resilience, better decision-making and stronger access to information for the stakeholders that need it most.', date: 'September 2026', category: 'Technology', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'] },
  { slug: 'circular-economy', title: 'Circular economy strategies for local value creation', excerpt: 'Reducing waste while supporting practical opportunities in resource recovery and sustainable operations.', content: 'Circular systems can unlock environmental benefits while creating local opportunities in waste recovery, resource management and service delivery.', date: 'August 2026', category: 'Sustainability', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80', images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80'] },
];

function displayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

export function toNewsCards(items: ContentItem[]): NewsCard[] {
  return items.filter((item) => item.slug && item.title).map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: (item.excerpt || item.content).slice(0, 220),
    content: item.content,
    date: displayDate(item.date),
    category: item.category || 'News & insights',
    image: imageSource(item.imageUrl || fallbackArticles[0].image, 900),
    images: item.imageUrls.length ? item.imageUrls : [imageSource(item.imageUrl || fallbackArticles[0].image, 900)],
  }));
}

export async function getNewsCards() {
  const { items } = await getNews();
  const articles = toNewsCards(items);
  const liveSlugs = new Set(articles.map((article) => article.slug));
  return [...articles, ...fallbackArticles.filter((article) => !liveSlugs.has(article.slug))];
}