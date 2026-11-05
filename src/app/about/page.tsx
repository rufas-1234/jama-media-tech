import { EditableSections, PageHero, TeamMembersSection } from '@/components/content/EditablePage';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const { pages, teamMembers } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.about} />
      <EditableSections sections={pages.about.sections} />
      <TeamMembersSection teamMembers={teamMembers} eyebrow="The people behind Jama Tech" title="Local experience. Shared purpose." />
    </>
  );
}
