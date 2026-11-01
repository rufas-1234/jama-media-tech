import { getProjectBySlug, getProjects, plainText, type ContentItem } from '@/lib/wordpress';

export type ProjectCard = {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  location: string;
  image: string;
};

export const fallbackProjects: ProjectCard[] = [
  { slug: 'digital-transformation', title: 'Digital Transformation for Community Operations', category: 'ICT Infrastructure', location: 'Juba, South Sudan', description: 'Supporting digital systems planning and infrastructure improvements for more resilient institutional operations.', content: 'A strategic initiative to strengthen digital systems and operational efficiency in community-facing institutions.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
  { slug: 'recycling-initiative', title: 'Plastic Recovery and Circular Economy Initiative', category: 'Recycling', location: 'South Sudan', description: 'Developing practical waste recovery pathways to reduce environmental pressure and create local circular opportunities.', content: 'A sustainability-focused effort to reduce waste and recover resources for longer-term environmental and economic value.', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80' },
  { slug: 'supply-logistics', title: 'Humanitarian Supply and Logistics Coordination', category: 'Supply Chain', location: 'Regional Operations', description: 'Coordinating essential supplies and efficient logistics support for institutions and partner organisations.', content: 'Operational support for structured supply chain movement, warehousing and delivery planning.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80' },
  { slug: 'web-platform', title: 'Corporate Website and Digital Asset Development', category: 'Web Development', location: 'Juba, South Sudan', description: 'Crafting digital platforms that present organisations clearly and support stakeholder engagement.', content: 'Designing digital assets and web systems that communicate purpose, capability and professionalism clearly.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80' },
];

export function toProjectCard(item: ContentItem): ProjectCard {
  const text = (value: string) => plainText(value);
  return {
    slug: item.slug,
    title: text(item.title.rendered),
    description: text(item.excerpt?.rendered || item.content.rendered).slice(0, 260),
    content: text(item.content.rendered),
    category: String(item.meta?.jama_project_category ?? 'Project'),
    location: String(item.meta?.jama_project_location ?? 'South Sudan'),
    image: String(item.meta?.jama_cover_image ?? item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? fallbackProjects[0].image),
  };
}

export async function getProjectCards() {
  const { items } = await getProjects();
  const projects = items.map(toProjectCard);
  const liveSlugs = new Set(projects.map((project) => project.slug));
  return [...projects, ...fallbackProjects.filter((project) => !liveSlugs.has(project.slug))];
}

export async function getProjectCardBySlug(slug: string) {
  const item = await getProjectBySlug(slug);
  if (item) return toProjectCard(item);
  return fallbackProjects.find((project) => project.slug === slug);
}