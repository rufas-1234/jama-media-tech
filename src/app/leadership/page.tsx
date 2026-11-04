import { ArrowRight } from 'lucide-react';
import { imageSource, leadershipRoles } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  const { teamMembers } = await getSiteContent();
  return (
    <>
      <section className="about-hero relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
        <div className="container">
          <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5e8ed]">Leadership &amp; governance</p>
          <h1 className="max-w-4xl text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">Leadership for practical delivery.</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Jama Tech LTD is led by a multidisciplinary team focused on technical delivery, operational excellence, sustainability and institutional partnership.
          </p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {teamMembers.length ? teamMembers.map((member) => (
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
          )) : leadershipRoles.map((role, index) => (
            <div key={role} className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-6 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">{index + 1}</div>
              <h2 className="mb-2 text-xl text-[#1d1f20]">{role}</h2>
              <p className="text-base leading-7 text-[#4f5557]">Leadership profile to be published once approved by the company.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-16 text-white lg:py-20">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl text-white md:text-4xl lg:text-5xl">Partnership and leadership conversations</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">Connect with the team to discuss governance, operations, supply, sustainability and digital transformation priorities.</p>
          <a href="/contact" className="btn btn-primary inline-flex">
            Contact our team <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </>
  );
}
