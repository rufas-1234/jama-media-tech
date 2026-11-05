import { imageSource } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  const { teamMembers, pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.leadership} />
      <EditableSections sections={pages.leadership.sections} />

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.id} className="team-profile group overflow-hidden rounded-[1.75rem] border border-[#dfe5df] bg-white">
              {member.imageUrl ? (
                <div className="overflow-hidden bg-[#edf2ed]">
                  <img src={imageSource(member.imageUrl, 800)} alt={`${member.name}, ${member.role}`} className="team-profile-image h-72 w-full object-cover" />
                </div>
              ) : <div aria-hidden="true" className="team-profile-placeholder relative grid h-72 place-items-center overflow-hidden bg-[#17231d] text-6xl font-semibold text-white"><span className="relative z-10">{member.name.trim().slice(0, 1).toUpperCase()}</span></div>}
              <div className="p-6 sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#28583e]">{member.role}</p>
                <h2 className="mt-2 text-2xl text-[#172019]">{member.name}</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#56615a]">{member.biography}</p>
                {(member.linkedin || member.facebook || member.instagram || member.x) && (
                  <div aria-label={`${member.name} social profiles`} className="mt-6 flex items-center gap-2 border-t border-[#e7ebe7] pt-4">
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="team-social-link team-social-link-linkedin">in</a>}
                    {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Facebook`} className="team-social-link team-social-link-facebook">f</a>}
                    {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`} className="team-social-link team-social-link-instagram">◎</a>}
                    {member.x && <a href={member.x} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on X`} className="team-social-link team-social-link-x">X</a>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}
