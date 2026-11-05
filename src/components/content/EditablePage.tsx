import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent, type EditablePage, type HomeSection, type TeamMember } from '@/lib/site-content';

const sectionImages: Record<string, string> = {
  'home-partnerships': 'photo-1521737711867-e3b97375f902',
  'home-approach': 'photo-1522202176988-66273c2fd55f',
  'vision-mission': 'photo-1521737711867-e3b97375f902',
  'our-values': 'photo-1532996122724-e3c354a0b15b',
  'our-direction': 'photo-1497366811353-6870744d04b2',
  'operating-model': 'photo-1586528116311-ad8dd3c8310d',
};

const cardImages: Record<string, string[]> = {
  'home-partnerships': ['photo-1593113630400-ea4288922497', 'photo-1497366811353-6870744d04b2', 'photo-1532996122724-e3c354a0b15b'],
  'home-approach': ['photo-1521737711867-e3b97375f902', 'photo-1532996122724-e3c354a0b15b', 'photo-1593113630400-ea4288922497'],
  'vision-mission': ['photo-1522202176988-66273c2fd55f', 'photo-1593113630400-ea4288922497'],
  'our-values': ['photo-1521737711867-e3b97375f902', 'photo-1497366811353-6870744d04b2', 'photo-1532996122724-e3c354a0b15b', 'photo-1522202176988-66273c2fd55f', 'photo-1586528116311-ad8dd3c8310d'],
};

export function PageHero({ page }: { page: EditablePage }) {
  return (
    <section className="relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
      <div className={`container relative z-10 grid items-center gap-10 ${page.imageUrl ? 'lg:grid-cols-[1fr_0.8fr]' : ''}`}>
        <div className="max-w-4xl">
          {page.eyebrow && <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3e3ed]">{page.eyebrow}</p>}
          <h1 className="whitespace-pre-line text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">{page.title}</h1>
          {page.introduction && <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{page.introduction}</p>}
        </div>
        {page.imageUrl && <img src={imageSource(page.imageUrl, 1200)} alt="" className="max-h-[28rem] min-h-64 w-full rounded-[2rem] object-cover shadow-2xl" />}
      </div>
    </section>
  );
}

export function EditableSections({ sections }: { sections: HomeSection[] }) {
  return (
    <>
      {sections.filter((section) => section.enabled).map((section, index) => (
        <section key={section.id} className={`${index % 2 ? 'bg-[#f4f6f3]' : 'bg-white'} py-16 text-[#172019] lg:py-24`}>
          <div className="container">
            <div className={`grid items-center gap-8 ${(section.imageUrl || sectionImages[section.id]) ? 'lg:grid-cols-[1fr_0.8fr]' : ''}`}>
              <div className="max-w-3xl">
                {section.eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{section.eyebrow}</p>}
                <h2 className="whitespace-pre-line text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{section.title}</h2>
                {section.body && <div className="mt-4 space-y-4 whitespace-pre-line text-base leading-8 text-[#48534b]">{section.body.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>}
                {section.buttonText && section.buttonHref && <Link href={section.buttonHref} className="btn btn-primary mt-6 inline-flex">{section.buttonText}<ArrowUpRight className="h-4 w-4" /></Link>}
              </div>
              {(section.imageUrl || sectionImages[section.id]) && <img src={imageSource(section.imageUrl || sectionImages[section.id], 1200)} alt="" className="max-h-[26rem] min-h-56 w-full rounded-[1.75rem] object-cover shadow-lg" />}
            </div>
            {section.items && section.items.length > 0 && (
              <div className={`mt-9 grid gap-5 ${section.items.length === 2 ? 'md:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                {section.items.map((item, itemIndex) => {
                  const image = item.imageUrl || cardImages[section.id]?.[itemIndex] || sectionImages[section.id] || 'photo-1522202176988-66273c2fd55f';
                  return (
                    <article key={`${item.title}-${itemIndex}`} className="group relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-[#17231d] p-6 text-white shadow-sm sm:min-h-[21rem] sm:p-7">
                      {image && <img src={imageSource(image, 900)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101812]/95 via-[#101812]/45 to-[#101812]/5" />
                      <h3 className="text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
                      <p className="mt-2 max-w-prose whitespace-pre-line text-sm leading-6 text-white/85">{item.body}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

export function TeamMembersSection({ teamMembers, eyebrow = 'Our people', title = 'Meet the team behind the work.' }: { teamMembers: TeamMember[]; eyebrow?: string; title?: string }) {
  if (!teamMembers.length) return null;
  return (
    <section className="bg-[#17231d] py-16 text-white lg:py-24">
      <div className="container">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b3e3ed]">{eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-7 text-white/70">The people, experience and local knowledge that turn our commitments into practical delivery.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white text-[#172019]">
              {member.imageUrl
                ? <img src={imageSource(member.imageUrl, 800)} alt={`${member.name}, ${member.role}`} className="h-64 w-full object-cover" />
                : <div aria-hidden="true" className="grid h-64 place-items-center bg-gradient-to-br from-[#28583e] to-[#17231d] text-6xl font-semibold text-white">{member.name.trim().slice(0, 1).toUpperCase()}</div>}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#28583e]">{member.role}</p>
                <h3 className="mt-2 text-2xl font-semibold">{member.name}</h3>
                {member.biography && <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-[#56615a]">{member.biography}</p>}
                {(member.linkedin || member.facebook || member.instagram || member.x) && (
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-[#e7ebe7] pt-4 text-xs font-semibold text-[#28583e]">
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                    {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                    {member.x && <a href={member.x} target="_blank" rel="noopener noreferrer">X</a>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function EditablePageView({ slug }: { slug: string }) {
  const { pages } = await getSiteContent();
  const page = pages[slug];
  if (!page) return null;
  return <><PageHero page={page} /><EditableSections sections={page.sections} /></>;
}
