import { notFound } from 'next/navigation';
import { EditableSections, PageHero } from '@/components/content/EditablePage';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { pages } = await getSiteContent();
  const page = pages[slug];
  if (!page) notFound();

  return <><PageHero page={page} /><EditableSections sections={page.sections} /></>;
}
