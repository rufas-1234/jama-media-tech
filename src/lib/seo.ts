import type { Metadata } from 'next';
import { company } from './content';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export function metadata(title: string, path: string, description = company.description): Metadata {
  return { title, description, alternates: { canonical: `${siteUrl}${path}` }, openGraph: { title: `${title} | Jama Tech LTD`, description, url: `${siteUrl}${path}`, siteName: company.name, type: 'website' } };
}
export function jsonLd(data: object) { return JSON.stringify(data).replace(/</g, '\\u003c'); }