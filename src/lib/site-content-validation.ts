import type { EditablePage, HomeHeroSlide, HomeSection, Service, SiteContent, SiteNavigation, TeamMember } from '@/lib/site-content';
import { defaultPages, defaultSiteContent, normalizeSiteContent } from '@/lib/site-content';

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

function safePath(value: string, name: string): string {
  if (!value.startsWith('/') || value.startsWith('//')) throw new Error(`${name} must be a site path beginning with one slash.`);
  return value;
}

function socialLink(value: unknown, name: string): string {
  const result = text(value ?? '', name, 500);
  if (!result) return '';
  try {
    const url = new URL(result);
    if (url.protocol === 'https:' && url.hostname.includes('.')) return result;
  } catch {
    // Report invalid social URLs with a field-specific message below.
  }
  throw new Error(`${name} must be a secure HTTPS URL.`);
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
  const items = value.items ?? [];
  if (!Array.isArray(items) || items.length > 12) throw new Error(`Homepage section ${index + 1} can contain no more than 12 cards.`);
  return {
    id: text(value.id, `Homepage section ${index + 1} ID`, 80, true),
    eyebrow: text(value.eyebrow, 'Section label', 100),
    title: text(value.title, 'Section title', 180, true),
    body: text(value.body, 'Section body', 3000),
    imageUrl: imageReference(value.imageUrl, 'Section image'),
    enabled: value.enabled === true,
    items: items.map((item, itemIndex) => {
      if (!isRecord(item)) throw new Error(`Section card ${itemIndex + 1} is invalid.`);
      return {
        title: text(item.title, 'Card title', 180, true),
        body: text(item.body, 'Card text', 1500),
        imageUrl: item.imageUrl === undefined ? '' : imageReference(item.imageUrl, 'Card image'),
      };
    }),
    buttonText: text(value.buttonText ?? '', 'Section button text', 100),
    buttonHref: value.buttonHref ? safePath(text(value.buttonHref, 'Section button link', 500), 'Section button link') : '',
  };
}

function homeHeroSlide(value: unknown, index: number): HomeHeroSlide {
  if (!isRecord(value)) throw new Error(`Homepage hero slide ${index + 1} is invalid.`);
  const primaryCtaLabel = text(value.primaryCtaLabel ?? '', 'Hero primary button', 100);
  const secondaryCtaLabel = text(value.secondaryCtaLabel ?? '', 'Hero secondary button', 100);
  const primaryCtaHref = text(value.primaryCtaHref ?? '', 'Hero primary button link', 500);
  const secondaryCtaHref = text(value.secondaryCtaHref ?? '', 'Hero secondary button link', 500);
  return {
    id: text(value.id, `Homepage hero slide ${index + 1} ID`, 80, true),
    eyebrow: text(value.eyebrow ?? '', 'Hero eyebrow', 120),
    headline: text(value.headline, 'Hero headline', 220, true),
    introduction: text(value.introduction ?? '', 'Hero introduction', 1000),
    imageUrl: imageReference(value.imageUrl ?? '', 'Hero image'),
    imageAlt: text(value.imageAlt ?? '', 'Hero image description', 240),
    primaryCtaLabel,
    primaryCtaHref: primaryCtaHref ? safePath(primaryCtaHref, 'Hero primary button link') : '',
    secondaryCtaLabel,
    secondaryCtaHref: secondaryCtaHref ? safePath(secondaryCtaHref, 'Hero secondary button link') : '',
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
    linkedin: socialLink(value.linkedin, 'LinkedIn profile'),
    facebook: socialLink(value.facebook, 'Facebook profile'),
    instagram: socialLink(value.instagram, 'Instagram profile'),
    x: socialLink(value.x, 'X profile'),
  };
}

export function validateSiteContent(value: unknown): SiteContent {
  if (!isRecord(value) || !isRecord(value.company) || !isRecord(value.homepage)) throw new Error('Site content is invalid.');
  if (!Array.isArray(value.services) || value.services.length < 1 || value.services.length > 24) throw new Error('Keep at least one service and no more than 24.');
  if (!Array.isArray(value.homepage.sections) || value.homepage.sections.length > 24) throw new Error('Homepage can contain no more than 24 sections.');
  if (!Array.isArray(value.teamMembers) || value.teamMembers.length > 40) throw new Error('Team can contain no more than 40 members.');

  const slugs = new Set<string>();
  const services = value.services.map(service);
  for (const item of services) {
    if (slugs.has(item.slug)) throw new Error(`Service slug "${item.slug}" is used more than once.`);
    slugs.add(item.slug);
  }

  const normalized = normalizeSiteContent(value as unknown as SiteContent);
  const rawHeroSlides = value.homepage.heroSlides ?? [{
    id: 'home-hero-1',
    eyebrow: value.homepage.eyebrow ?? normalized.homepage.eyebrow,
    headline: value.homepage.headline ?? normalized.homepage.headline,
    introduction: value.homepage.introduction ?? normalized.homepage.introduction,
    imageUrl: value.homepage.heroImage ?? normalized.homepage.heroImage,
    imageAlt: '',
    primaryCtaLabel: value.homepage.primaryCtaLabel ?? normalized.homepage.primaryCtaLabel,
    primaryCtaHref: value.homepage.primaryCtaHref ?? normalized.homepage.primaryCtaHref,
    secondaryCtaLabel: value.homepage.secondaryCtaLabel ?? normalized.homepage.secondaryCtaLabel,
    secondaryCtaHref: value.homepage.secondaryCtaHref ?? normalized.homepage.secondaryCtaHref,
  }];
  if (!Array.isArray(rawHeroSlides) || rawHeroSlides.length < 1 || rawHeroSlides.length > 4) throw new Error('Homepage must contain between 1 and 4 hero slides.');
  const heroSlides = rawHeroSlides.map(homeHeroSlide);
  if (new Set(heroSlides.map((slide) => slide.id)).size !== heroSlides.length) throw new Error('Homepage hero slide IDs must be unique.');
  const pagesValue = isRecord(value.pages) ? value.pages : defaultPages;
  const pages: Record<string, EditablePage> = {};
  const pageEntries = Object.entries({ ...defaultPages, ...pagesValue });
  if (pageEntries.length > 20) throw new Error('Keep no more than 20 editable pages.');
  for (const [slug, rawPage] of pageEntries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !isRecord(rawPage)) throw new Error(`Page "${slug}" is invalid.`);
    if (!Array.isArray(rawPage.sections) || rawPage.sections.length > 24) throw new Error(`Page "${slug}" can contain no more than 24 sections.`);
    pages[slug] = {
      label: text(rawPage.label ?? slug, 'Page label', 100, true),
      eyebrow: text(rawPage.eyebrow ?? '', 'Page eyebrow', 120),
      title: text(rawPage.title, 'Page title', 220, true),
      introduction: text(rawPage.introduction ?? '', 'Page introduction', 3000),
      imageUrl: imageReference(rawPage.imageUrl ?? '', 'Page hero image'),
      sections: rawPage.sections.map(homeSection),
    };
  }

  const rawNavigation = isRecord(value.navigation) ? value.navigation : normalized.navigation;
  const rawItems = Array.isArray(rawNavigation.items) ? rawNavigation.items : normalized.navigation.items;
  if (rawItems.length > 20) throw new Error('Navigation can contain no more than 20 links.');
  const navigation: SiteNavigation = {
    items: rawItems.map((item, index) => {
      if (!isRecord(item)) throw new Error(`Navigation link ${index + 1} is invalid.`);
      const href = text(item.href, 'Navigation link', 500, true);
      if ((!href.startsWith('/') || href.startsWith('//')) && !/^https:\/\/[^ ]+$/i.test(href)) throw new Error('Navigation links must be site paths or secure HTTPS URLs.');
      return {
        id: text(item.id, 'Navigation link ID', 80, true),
        label: text(item.label, 'Navigation link label', 100, true),
        href,
        enabled: item.enabled === true,
      };
    }),
    ctaLabel: text(rawNavigation.ctaLabel ?? '', 'Navigation call to action', 100),
    ctaHref: safePath(text(rawNavigation.ctaHref ?? '', 'Navigation call to action link', 500), 'Navigation call to action link'),
  };

  return {
    company: {
      name: text(value.company.name, 'Company name', 120, true),
      location: text(value.company.location, 'Company location', 200, true),
      email: text(value.company.email, 'Company email', 180, true),
      phone: text(value.company.phone, 'Company phone', 80),
      description: text(value.company.description, 'Company description', 1000, true),
      vision: text(value.company.vision, 'Company vision', 3000, true),
      mission: text(value.company.mission, 'Company mission', 3000, true),
      direction: text(value.company.direction ?? '', 'Company direction', 3000),
      operatingModel: text(value.company.operatingModel ?? '', 'Operating model', 3000),
    },
    homepage: {
      headline: heroSlides[0].headline,
      introduction: heroSlides[0].introduction,
      eyebrow: heroSlides[0].eyebrow,
      heroImage: heroSlides[0].imageUrl,
      primaryCtaLabel: heroSlides[0].primaryCtaLabel,
      primaryCtaHref: heroSlides[0].primaryCtaHref || '/services',
      secondaryCtaLabel: heroSlides[0].secondaryCtaLabel,
      secondaryCtaHref: heroSlides[0].secondaryCtaHref || '/about',
      heroSlides,
      sections: value.homepage.sections.map(homeSection),
    },
    services,
    teamMembers: value.teamMembers.map(teamMember),
    pages,
    navigation,
  };
}