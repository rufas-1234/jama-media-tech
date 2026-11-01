import type { HomeSection, Service, SiteContent, TeamMember } from '@/lib/site-content';

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, name: string, maximum: number, required = false): string {
  if (typeof value !== 'string') throw new Error(`${name} must be text.`);
  const result = value.trim();
  if (required && !result) throw new Error(`${name} is required.`);
  if (result.length > maximum) throw new Error(`${name} must be ${maximum} characters or fewer.`);
  return result;
}

function imageReference(value: unknown, name: string): string {
  const result = text(value, name, 2000);
  if (!result || result.startsWith('photo-')) return result;
  if (result.startsWith('/uploads/') && !result.includes('..')) return result;
  try {
    const url = new URL(result);
    if (url.protocol === 'https:' || url.protocol === 'http:') return result;
  } catch {
    // Report invalid image values with a field-specific message below.
  }
  throw new Error(`${name} must be an HTTP/HTTPS URL, an uploaded image, or an Unsplash photo ID.`);
}

function stringList(value: unknown, name: string, maximumItems: number): string[] {
  if (!Array.isArray(value) || value.length > maximumItems) throw new Error(`${name} must contain no more than ${maximumItems} items.`);
  return value.map((item, index) => text(item, `${name} item ${index + 1}`, 240, true)).filter(Boolean);
}

function service(value: unknown, index: number): Service {
  if (!isRecord(value)) throw new Error(`Service ${index + 1} is invalid.`);
  const slug = text(value.slug, `Service ${index + 1} slug`, 80, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Service ${index + 1} slug can only contain lowercase letters, numbers, and hyphens.`);
  return {
    slug,
    number: text(value.number, 'Service number', 8),
    short: text(value.short, 'Service short label', 100, true),
    title: text(value.title, 'Service title', 180, true),
    description: text(value.description, 'Service description', 600, true),
    introduction: text(value.introduction, 'Service introduction', 3000, true),
    image: imageReference(value.image, 'Service image'),
    alt: text(value.alt, 'Service image description', 240),
    capabilities: stringList(value.capabilities, 'Service capabilities', 30),
    audience: text(value.audience, 'Service audience', 1500, true),
  };
}

function homeSection(value: unknown, index: number): HomeSection {
  if (!isRecord(value)) throw new Error(`Homepage section ${index + 1} is invalid.`);
  return {
    id: text(value.id, `Homepage section ${index + 1} ID`, 80, true),
    eyebrow: text(value.eyebrow, 'Section label', 100),
    title: text(value.title, 'Section title', 180, true),
    body: text(value.body, 'Section body', 3000, true),
    imageUrl: imageReference(value.imageUrl, 'Section image'),
    enabled: value.enabled === true,
  };
}

function teamMember(value: unknown, index: number): TeamMember {
  if (!isRecord(value)) throw new Error(`Team member ${index + 1} is invalid.`);
  return {
    id: text(value.id, `Team member ${index + 1} ID`, 80, true),
    name: text(value.name, 'Team member name', 120, true),
    role: text(value.role, 'Team member role', 160, true),
    biography: text(value.biography, 'Team member biography', 3000, true),
    imageUrl: imageReference(value.imageUrl, 'Team member image'),
  };
}

export function validateSiteContent(value: unknown): SiteContent {
  if (!isRecord(value) || !isRecord(value.company) || !isRecord(value.homepage)) throw new Error('Site content is invalid.');
  if (!Array.isArray(value.services) || value.services.length < 1 || value.services.length > 24) throw new Error('Keep at least one service and no more than 24.');
  if (!Array.isArray(value.homepage.sections) || value.homepage.sections.length > 12) throw new Error('Homepage can contain no more than 12 custom sections.');
  if (!Array.isArray(value.teamMembers) || value.teamMembers.length > 40) throw new Error('Team can contain no more than 40 members.');

  const slugs = new Set<string>();
  const services = value.services.map(service);
  for (const item of services) {
    if (slugs.has(item.slug)) throw new Error(`Service slug "${item.slug}" is used more than once.`);
    slugs.add(item.slug);
  }

  return {
    company: {
      name: text(value.company.name, 'Company name', 120, true),
      location: text(value.company.location, 'Company location', 200, true),
      email: text(value.company.email, 'Company email', 180, true),
      phone: text(value.company.phone, 'Company phone', 80),
      description: text(value.company.description, 'Company description', 1000, true),
      vision: text(value.company.vision, 'Company vision', 3000, true),
      mission: text(value.company.mission, 'Company mission', 3000, true),
    },
    homepage: {
      headline: text(value.homepage.headline, 'Homepage headline', 220, true),
      introduction: text(value.homepage.introduction, 'Homepage introduction', 1000, true),
      sections: value.homepage.sections.map(homeSection),
    },
    services,
    teamMembers: value.teamMembers.map(teamMember),
  };
}