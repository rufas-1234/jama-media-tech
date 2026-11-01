import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { company as defaultCompany, services as defaultServices } from '@/lib/content';
import { getWordPressSiteContent, isWordPressAdminConfigured, saveWordPressSiteContent } from '@/lib/wordpress-admin';

export type SiteCompany = {
  name: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  vision: string;
  mission: string;
};

export type HomeSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  imageUrl: string;
  enabled: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  biography: string;
  imageUrl: string;
};

export type Service = (typeof defaultServices)[number];

export type SiteContent = {
  company: SiteCompany;
  homepage: {
    headline: string;
    introduction: string;
    sections: HomeSection[];
  };
  services: Service[];
  teamMembers: TeamMember[];
};

export const defaultSiteContent: SiteContent = {
  company: { ...defaultCompany },
  homepage: {
    headline: 'Innovating for a sustainable, connected & resilient future.',
    introduction: 'A South Sudanese social enterprise turning local capacity into lasting resilience.',
    sections: [],
  },
  services: defaultServices,
  teamMembers: [],
};

export type SiteContentStorage = 'local' | 'wordpress' | 'unavailable';

const localStorePath = join(process.cwd(), 'data', 'site-content.json');

function cloneDefaults(): SiteContent {
  return structuredClone(defaultSiteContent);
}

export function siteContentStorage(): SiteContentStorage {
  if (isWordPressAdminConfigured()) return 'wordpress';
  if (process.env.WORDPRESS_API_URL) return 'unavailable';
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
  if (isWordPressAdminConfigured()) {
    try {
      return (await getWordPressSiteContent()) ?? cloneDefaults();
    } catch (error) {
      console.error('WordPress site content unavailable.');
      return cloneDefaults();
    }
  }
  if (process.env.NODE_ENV === 'development' && !process.env.WORDPRESS_API_URL) return readLocalContent();
  return cloneDefaults();
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const storage = siteContentStorage();
  if (storage === 'wordpress') return (await getWordPressSiteContent()) ?? cloneDefaults();
  if (storage === 'local') return readLocalContent();
  throw new Error('Site content storage is not configured for this server.');
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const storage = siteContentStorage();
  if (storage === 'wordpress') return saveWordPressSiteContent(content);
  if (storage === 'unavailable') throw new Error('Site content storage is not configured for this server.');
  await mkdir(dirname(localStorePath), { recursive: true });
  const temporaryPath = `${localStorePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(content, null, 2), 'utf8');
  await rename(temporaryPath, localStorePath);
  return content;
}