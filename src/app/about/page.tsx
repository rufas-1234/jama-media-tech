import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Lightbulb, MapPin, Target, Users } from 'lucide-react';
import { imageSource, values } from '@/lib/content';
import { defaultSiteContent, getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const { company, services, teamMembers } = await getSiteContent();
  const digitalService = services.find((service) => service.slug === 'ict-consultancy') ?? services[0];
  const supplyService = services.find((service) => service.slug === 'food-and-nfis') ?? services[0];
  const direction = company.direction || defaultSiteContent.company.direction;
  const operatingModel = company.operatingModel || defaultSiteContent.company.operatingModel;
  return (
    <>
      <section className="about-hero relative overflow-hidden bg-white py-16 text-[#172019] sm:py-20 lg:py-28">
        <div className="container relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#dfe5df] bg-[#f7f8f5] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#28583e]">About Jama Tech</p>
            <h1 className="max-w-3xl text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-[#172019]">Local capability.<br />Practical progress.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#48534b] sm:text-lg sm:leading-8">{company.description}</p>
            <div className="mt-7 flex items-center gap-2 text-sm text-[#48534b]">
              <MapPin className="h-4 w-4 shrink-0 text-[#28583e]" />
              <span>{company.location}</span>
            </div>
            <Link href="/services" className="btn btn-primary mt-8">
              Explore our capabilities <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="about-hero-image relative overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_35px_90px_rgba(0,0,0,0.3)]">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="A team working together around a table" className="h-72 w-full object-cover sm:h-[24rem]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101812]/90 to-transparent px-6 pb-5 pt-14">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b3e3ed]">Rooted in South Sudan</p>
              <p className="mt-1 text-lg font-semibold text-white">Building for the way organisations work here.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Who we are</p>
            <h2 className="mb-6 text-3xl text-[#1d1f20] md:text-4xl">Built around practical action.</h2>
            <p className="mb-4 text-lg leading-8 text-[#4f5557]">
              Jama Tech LTD is a Juba-based social enterprise operating across technology, supply chain logistics and environmental sustainability. We help institutions, communities and enterprises solve practical challenges with dependable service and long-term thinking.
            </p>
            <p className="text-lg leading-8 text-[#4f5557]">
              Our work combines operational reliability with innovation, creating systems that support food security, circular economies, digital transformation and modern infrastructure in South Sudan.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white shadow-[0_18px_50px_rgba(17,24,26,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Jama Tech team collaborating"
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-black lg:py-24">
        <div className="container grid gap-10 md:grid-cols-2">
          <div className="vision-panel rounded-[2rem] border border-[#e2e7e2] bg-white p-8">
            <p className="text-sm font-semibold uppercase text-[#28583e]">Vision</p>
            <h2 className="mb-0 mt-4 text-xl leading-8 text-black md:text-2xl">{company.vision}</h2>
          </div>
          <div className="vision-panel rounded-[2rem] border border-[#e2e7e2] bg-white p-8">
            <p className="text-sm font-semibold uppercase text-[#28583e]">Mission</p>
            <h2 className="mb-0 mt-4 text-xl leading-8 text-black md:text-2xl">{company.mission}</h2>
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#28583e]">Our people</p>
              <h2 className="text-3xl text-[#172019] md:text-4xl">The people behind the progress.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#56615a]">Meet the colleagues shaping our work across technology, operations, supply and sustainability.</p>
            </div>
            <Link href="/leadership" className="inline-flex items-center gap-2 text-sm font-semibold text-[#28583e] transition-colors hover:text-[#17231d]">
              Leadership &amp; governance <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {teamMembers.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => <article key={member.id} className="team-profile group overflow-hidden rounded-[1.75rem] border border-[#dfe5df] bg-white">
              {member.imageUrl ? (
                <div className="relative overflow-hidden bg-[#edf2ed]">
                  <img src={imageSource(member.imageUrl, 800)} alt={`${member.name}, ${member.role}`} className="team-profile-image h-72 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101812]/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ) : (
                <div aria-hidden="true" className="team-profile-placeholder relative grid h-72 place-items-center overflow-hidden bg-[#17231d] text-6xl font-semibold text-white">
                  <span className="relative z-10">{member.name.trim().slice(0, 1).toUpperCase()}</span>
                </div>
              )}
              <div className="p-6 sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#28583e]">{member.role}</p>
                <h3 className="mt-2 text-2xl text-[#172019]">{member.name}</h3>
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
            </article>)}
          </div> : <p className="rounded-2xl border border-dashed border-[#cbd5cb] bg-white/70 px-6 py-8 text-sm leading-6 text-[#56615a]">Approved team profiles will appear here. Add member names, roles, biographies, photos and social profile links in the admin panel.</p>}
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Our values</p>
            <h2 className="text-3xl text-[#1d1f20] md:text-4xl lg:text-5xl">The principles behind our work.</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map(([title, desc]) => (
              <div key={title} className="rounded-[2rem] border border-[#d9d0c4] bg-white/75 p-6 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
                <CheckCircle2 className="mb-4 h-8 w-8 text-[var(--color-emerald)]" />
                <h3 className="mb-2 text-xl text-[#1d1f20]">{title}</h3>
                <p className="text-base leading-7 text-[#4f5557]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Our direction</p>
            <h2 className="text-3xl text-[#1d1f20] md:text-4xl lg:text-5xl">A clear strategy for meaningful outcomes.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#56615a]">{direction}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Innovation', description: 'Deliver practical technologies that make operations more efficient and effective.', icon: Lightbulb },
              { title: 'Sustainability', description: 'Support recycling, resource recovery and circular economic opportunities.', icon: Compass },
              { title: 'Operations', description: 'Create dependable supply chains and resilient service delivery models.', icon: Target },
              { title: 'Partnerships', description: 'Work alongside communities, institutions and private sector partners.', icon: Users },
            ].map(({ title, description, icon: Icon }) => (
              <div key={title} className="direction-card rounded-[1.5rem] border border-[#d9d0c4] bg-white/80 p-6">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#17231d] text-[#69d6ec]"><Icon className="h-5 w-5" /></span>
                <h3 className="mb-3 text-xl text-[#1d1f20]">{title}</h3>
                <p className="text-base leading-7 text-[#4f5557]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="mb-10">
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Operating model</p>
            <h2 className="text-3xl text-[#1d1f20] md:text-4xl lg:text-5xl">How we create value.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#56615a]">{operatingModel}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-8 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
              <h3 className="mb-3 text-2xl text-[#1d1f20]">Technical & digital services</h3>
              <p className="mb-5 text-base leading-7 text-[#4f5557]">
                We help organisations modernise their systems, strengthen connectivity and deliver digital solutions that support productivity and accountability.
              </p>
              <ul className="feature-list">
                {(digitalService?.capabilities ?? []).slice(0, 4).map((item) => (
                  <li key={item}><span>•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-8 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
              <h3 className="mb-3 text-2xl text-[#1d1f20]">Sustainable logistics & operations</h3>
              <p className="mb-5 text-base leading-7 text-[#4f5557]">
                We connect procurement, distribution and resource recovery in a more resilient and responsible operating model built for challenging environments.
              </p>
              <ul className="feature-list">
                {(supplyService?.capabilities ?? []).slice(0, 4).map((item) => (
                  <li key={item}><span>•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-16 text-white lg:py-24">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl text-white md:text-4xl lg:text-5xl">Connect with our team</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">We are ready to discuss your operational, technological or organisational requirements.</p>
          <Link href="/contact" className="btn btn-primary inline-flex">
            Contact our team <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
