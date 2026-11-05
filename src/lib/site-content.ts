import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { company as defaultCompany, companyDirection, companyOperatingModel, services as defaultServices, values } from '@/lib/content';
import { getCachedTiDBSiteContent, getTiDBSiteContent, saveTiDBSiteContent } from '@/lib/tidb-store';
import { tidbHasConfiguration, tidbIsConfigured } from '@/lib/tidb';

export type SiteCompany = {
  name: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  vision: string;
  mission: string;
  direction?: string;
  operatingModel?: string;
};

export type HomeSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  imageUrl: string;
  enabled: boolean;
  items?: { title: string; body: string; imageUrl?: string }[];
  buttonText?: string;
  buttonHref?: string;
};

export type EditablePage = {
  label: string;
  eyebrow: string;
  title: string;
  introduction: string;
  imageUrl: string;
  sections: HomeSection[];
};

export type SiteNavigationItem = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
};

export type SiteNavigation = {
  items: SiteNavigationItem[];
  ctaLabel: string;
  ctaHref: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  biography: string;
  imageUrl: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
};

export type Service = (typeof defaultServices)[number];

export type SiteContent = {
  company: SiteCompany;
  homepage: {
    headline: string;
    introduction: string;
    eyebrow: string;
    heroImage: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    sections: HomeSection[];
  };
  services: Service[];
  teamMembers: TeamMember[];
  pages: Record<string, EditablePage>;
  navigation: SiteNavigation;
};

const section = (
  id: string,
  eyebrow: string,
  title: string,
  body: string,
  imageUrl = '',
  items: { title: string; body: string; imageUrl?: string }[] = [],
): HomeSection => ({ id, eyebrow, title, body, imageUrl, items, enabled: true });

export const defaultPages: Record<string, EditablePage> = {
  about: {
    label: 'About',
    eyebrow: 'About Jama Tech',
    title: 'Local capability. Practical progress.',
    introduction: 'Jama Tech LTD is a Juba-based social enterprise operating across technology, supply chain logistics and environmental sustainability. We help institutions, communities and enterprises solve practical challenges with dependable service and long-term thinking.',
    imageUrl: 'photo-1522202176988-66273c2fd55f',
    sections: [
      section('who-we-are', 'Who we are', 'Built around practical action.', 'Our work combines operational reliability with innovation, creating systems that support food security, circular economies, digital transformation and modern infrastructure in South Sudan.', 'photo-1522202176988-66273c2fd55f'),
      section('vision-mission', 'Our purpose', 'A shared vision and mission.', '', '', [
        { title: 'Vision', body: 'To be South Sudan’s leading social enterprise in driving sustainable community development, empowering organizations through cutting-edge technology, eco-friendly resource management, and dependable supply chain logistics.' },
        { title: 'Mission', body: 'To drive sustainable growth and resilience across South Sudan by delivering reliable supply chain solutions, eco-friendly recycling innovations, and robust digital infrastructure—empowering communities, businesses, and development partners to thrive in a connected world.' },
      ]),
      section('our-values', 'Our values', 'The principles behind our work.', '', '', values.map(([title, body]) => ({ title, body }))),
      section('our-direction', 'Our direction', 'A clear strategy for meaningful outcomes.', companyDirection),
      section('operating-model', 'Operating model', 'How we create value.', companyOperatingModel),
    ],
  },
  sustainability: {
    label: 'Sustainability',
    eyebrow: 'Sustainability',
    title: 'Environmental stewardship is part of how we work.',
    introduction: 'Jama Tech LTD recognises that resilient communities and thriving organisations depend on healthier environments, circular systems and practical local solutions.',
    imageUrl: 'photo-1532996122724-e3c354a0b15b',
    sections: [
      section('environmental-commitment', 'Environmental commitment', 'Cleaner systems, stronger local value.', 'Our sustainability approach focuses on reducing waste, reclaiming valuable resources and supporting communities to participate in cleaner, stronger local economies.\n\nWe work to combine practical operational needs with environmental responsibility, ensuring our work contributes to long-term value rather than temporary gain.', 'photo-1532996122724-e3c354a0b15b'),
      section('priority-themes', 'Priority themes', 'Sustainability in action.', '', '', [
        { title: 'Plastic waste management', body: 'Collecting and processing material streams responsibly.' },
        { title: 'Mechanical processing', body: 'Transforming waste into recoverable resources for reintegration into value chains.' },
        { title: 'Circular economy', body: 'Reducing waste through smarter resource use and local recovery systems.' },
        { title: 'Community participation', body: 'Raising awareness and empowering local participation in environmental action.' },
      ]),
      section('sustainability-future', 'Our commitment', 'Better systems for a healthier future.', 'We believe that sustainability is an operational commitment that improves systems, protects resources and creates opportunity.'),
    ],
  },
  leadership: {
    label: 'Leadership',
    eyebrow: 'Leadership & governance',
    title: 'Leadership for practical delivery.',
    introduction: 'Jama Tech LTD is led by a multidisciplinary team focused on technical delivery, operational excellence, sustainability and institutional partnership.',
    imageUrl: '',
    sections: [section('leadership-conversations', 'Partnerships', 'Partnership and leadership conversations', 'Connect with the team to discuss governance, operations, supply, sustainability and digital transformation priorities.')],
  },
  services: {
    label: 'Services',
    eyebrow: 'What we do',
    title: 'One connected partner. Essential capabilities.',
    introduction: 'Practical services across supply, sustainability and technology—shaped around each partner’s operating context.',
    imageUrl: '',
    sections: [section('service-approach', 'A clear way of working', 'From first conversation to clear delivery.', 'Understand the need, shape the response, coordinate delivery and close out clearly.', '', [
      { title: 'Understand the need', body: 'Start with the operating context, requirements and intended outcomes.' },
      { title: 'Shape the response', body: 'Agree a practical scope and the right capabilities for the work.' },
      { title: 'Coordinate delivery', body: 'Align people, resources and communication around the agreed plan.' },
      { title: 'Close out clearly', body: 'Share progress, delivery records and next steps with the partner.' },
    ])],
  },
  projects: {
    label: 'Projects',
    eyebrow: 'Projects & impact',
    title: 'Practical work that creates measurable value.',
    introduction: 'Our projects span digital systems, sustainable logistics, recycling initiatives and community-facing solutions across South Sudan.',
    imageUrl: '',
    sections: [],
  },
  news: {
    label: 'News & insights',
    eyebrow: 'News & insights',
    title: 'Updates, stories and sector insights.',
    introduction: '',
    imageUrl: '',
    sections: [],
  },
  contact: {
    label: 'Contact',
    eyebrow: 'Contact us',
    title: 'Let’s talk about your next opportunity.',
    introduction: 'We welcome partnerships, procurement enquiries, project discussions and technology collaborations across South Sudan and the wider region.',
    imageUrl: '',
    sections: [section('business-enquiries', 'Get in touch', 'Business enquiry categories', 'Supply and logistics enquiries\nWaste recycling and environmental projects\nICT and digital solutions\nInternet infrastructure and web development\nPartnership and collaboration opportunities')],
  },
  'request-quotation': {
    label: 'Request a quotation',
    eyebrow: 'Request a quotation',
    title: 'Tell us what you need.',
    introduction: 'Share a brief overview of your requirements and we will respond with a suitable scope, service recommendation and next steps.',
    imageUrl: '',
    sections: [],
  },
  'privacy-policy': {
    label: 'Privacy policy',
    eyebrow: 'Privacy policy',
    title: 'Privacy policy',
    introduction: '',
    imageUrl: '',
    sections: [
      section('privacy-use', '', 'How we use information', 'This website is managed to support legitimate business communication and service enquiries. Personal information submitted through forms will be used only for the purposes stated at the point of collection.'),
      section('privacy-sharing', '', 'Data sharing and retention', 'We do not sell or share personal data with third parties for marketing purposes. Data may be retained to respond to enquiries, maintain records and support operational follow-up.'),
      section('privacy-rights', '', 'Your choices', 'Visitors may request access to, correction of or deletion of personal information where applicable and as permitted under law.'),
    ],
  },
  'terms-conditions': {
    label: 'Terms & conditions',
    eyebrow: 'Terms & conditions',
    title: 'Terms & conditions',
    introduction: '',
    imageUrl: '',
    sections: [
      section('terms-use', '', 'Website use', 'These terms govern the use of the Jama Tech LTD website and the information contained herein. The content is provided for informational and business communication purposes only.'),
      section('terms-information', '', 'Information on this website', 'Users should not rely on website information as formal legal, financial or technical advice. Jama Tech LTD may update or revise information without notice.'),
      section('terms-enquiries', '', 'Enquiries and quotations', 'All enquiries and quotations remain subject to confirmation and contract terms agreed between the parties.'),
    ],
  },
};

export const defaultSiteContent: SiteContent = {
  company: {
    ...defaultCompany,
    direction: companyDirection,
    operatingModel: companyOperatingModel,
  },
  homepage: {
    headline: 'Innovating for a sustainable, connected & resilient future.',
    introduction: 'A South Sudanese social enterprise turning local capacity into lasting resilience.',
    eyebrow: 'South Sudanese social enterprise',
    heroImage: 'photo-1593113630400-ea4288922497',
    primaryCtaLabel: 'Explore our services',
    primaryCtaHref: '/services',
    secondaryCtaLabel: 'Discover Jama Tech',
    secondaryCtaHref: '/about',
    sections: [
      section('home-partnerships', 'Our partnerships', 'Built around the way you operate.', 'Local knowledge and practical capability across humanitarian, government, private sector and community partnerships.', '', [
        { title: 'Humanitarian & Government', body: 'Compliant procurement, documented distribution and field-ready logistics for agencies delivering at scale.' },
        { title: 'Private Sector', body: 'Supply chain, recycling and digital infrastructure delivered on clear service levels.' },
        { title: 'Community & Local Partners', body: 'Local collection networks, skills training and shared-value programmes that keep benefit in the community.' },
      ]),
      section('home-delivery', 'How we work', 'From scoped assessment to documented delivery.', 'Each engagement starts with a scoped assessment and ends with clear, auditable delivery.\n\nOur team brings together procurement, field logistics, digital infrastructure and recycling expertise to meet the requirements of each partner.', 'photo-1593113630400-ea4288922497'),
      section('home-approach', 'The Jama Tech approach', 'A more thoughtful way to grow.', '', '', [
        { title: 'Integrity & Transparency', body: 'Clear accountability, ethical standards and honest communication across every partnership.' },
        { title: 'Environmental Stewardship', body: 'Circular economy and responsible resource management to protect local ecosystems.' },
        { title: 'Community Empowerment', body: 'Local opportunity, technical capacity and support for development initiatives.' },
      ]),
    ],
  },
  services: defaultServices,
  teamMembers: [],
  pages: defaultPages,
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '/', enabled: true },
      { id: 'about', label: 'About', href: '/about', enabled: true },
      { id: 'services', label: 'Services', href: '/services', enabled: true },
      { id: 'sustainability', label: 'Sustainability', href: '/sustainability', enabled: true },
      { id: 'projects', label: 'Projects', href: '/projects', enabled: true },
      { id: 'news', label: 'Insights', href: '/news', enabled: true },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true },
    ],
    ctaLabel: 'Request a Quote',
    ctaHref: '/request-quotation',
  },
};

export type SiteContentStorage = 'local' | 'tidb' | 'unavailable';

const localStorePath = join(process.cwd(), 'data', 'site-content.json');

function cloneDefaults(): SiteContent {
  return structuredClone(defaultSiteContent);
}

export function siteContentStorage(): SiteContentStorage {
  if (tidbIsConfigured()) return 'tidb';
  if (tidbHasConfiguration()) return 'unavailable';
  return process.env.NODE_ENV === 'development' ? 'local' : 'unavailable';
}

async function readLocalContent(): Promise<SiteContent> {
  try {
    const stored: unknown = JSON.parse(await readFile(localStorePath, 'utf8'));
    if (stored && typeof stored === 'object' && 'company' in stored && 'homepage' in stored && 'services' in stored && 'teamMembers' in stored) {
      return stored as SiteContent;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') console.error('Local site content could not be read.');
  }
  return cloneDefaults();
}

export async function getSiteContent(): Promise<SiteContent> {
  if (tidbIsConfigured()) {
    try {
      return normalizeSiteContent((await getCachedTiDBSiteContent()) ?? cloneDefaults());
    } catch (error) {
      console.error('TiDB site content is unavailable.', error);
      return cloneDefaults();
    }
  }
  if (process.env.NODE_ENV === 'development' && !tidbHasConfiguration()) return normalizeSiteContent(await readLocalContent());
  return cloneDefaults();
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const storage = siteContentStorage();
  if (storage === 'tidb') return normalizeSiteContent((await getTiDBSiteContent()) ?? cloneDefaults());
  if (storage === 'local') return normalizeSiteContent(await readLocalContent());
  throw new Error('Site content storage is not configured for this server.');
}

export function normalizeSiteContent(value: SiteContent): SiteContent {
  return {
    ...cloneDefaults(),
    ...value,
    company: { ...cloneDefaults().company, ...value.company },
    homepage: { ...cloneDefaults().homepage, ...value.homepage, sections: mergeSections(cloneDefaults().homepage.sections, value.homepage?.sections ?? []) },
    services: value.services?.length ? value.services : cloneDefaults().services,
    teamMembers: value.teamMembers ?? [],
    pages: { ...defaultPages, ...value.pages },
    navigation: {
      ...cloneDefaults().navigation,
      ...value.navigation,
      items: value.navigation?.items?.length ? value.navigation.items : cloneDefaults().navigation.items,
    },
  };
}

function mergeSections(defaults: HomeSection[], saved: HomeSection[]) {
  const savedById = new Map(saved.map((item) => [item.id, item]));
  return [
    ...defaults.map((item) => ({ ...item, ...savedById.get(item.id) })),
    ...saved.filter((item) => !defaults.some((defaultItem) => defaultItem.id === item.id)),
  ];
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const storage = siteContentStorage();
  if (storage === 'tidb') {
    await saveTiDBSiteContent(content);
    return content;
  }
  if (storage === 'unavailable') throw new Error('Site content storage is not configured for this server.');
  await mkdir(dirname(localStorePath), { recursive: true });
  const temporaryPath = `${localStorePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(content, null, 2), 'utf8');
  await rename(temporaryPath, localStorePath);
  return content;
}