import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero, TeamMembersSection } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  const { teamMembers, pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.leadership} />
      <EditableSections sections={pages.leadership.sections} />

      <TeamMembersSection teamMembers={teamMembers} eyebrow="Our people" title="Leadership & governance." />
    </>
  );
}
