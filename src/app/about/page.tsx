import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, Lightbulb, Target, Users } from 'lucide-react';
import { imageSource, values } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const { company, services, teamMembers } = await getSiteContent();
  const digitalService = services.find((service) => service.slug === 'ict-consultancy') ?? services[0];
  const supplyService = services.find((service) => service.slug === 'food-and-nfis') ?? services[0];
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-4xl">
            <p className="page-kicker">About us</p>
            <h1 className="page-title">Purpose-driven innovation for resilient communities.</h1>
            <p className="page-intro max-w-2xl">{company.description}</p>
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Who we are</p>
            <h2 className="mb-6 text-3xl text-[#1d1f20] md:text-4xl">Built for practical action.</h2>
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
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase text-[#28583e]">Our people</p>
            <h2 className="text-3xl text-[#172019] md:text-4xl">The team behind the work.</h2>
          </div>
          {teamMembers.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => <article key={member.id} className="overflow-hidden rounded-[1.5rem] border border-[#dfe5df] bg-white shadow-sm">
              {member.imageUrl ? <img src={imageSource(member.imageUrl, 800)} alt={member.name} className="h-72 w-full object-cover" /> : <div aria-hidden="true" className="grid h-48 place-items-center bg-[#edf2ed] text-4xl font-semibold text-[#28583e]">{member.name.slice(0, 1)}</div>}
              <div className="p-6">
                <h3 className="text-xl text-[#172019]">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#28583e]">{member.role}</p>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#56615a]">{member.biography}</p>
              </div>
            </article>)}
          </div> : <p className="rounded-xl border border-[#dfe5df] bg-white px-5 py-4 text-sm text-[#56615a]">Team profiles will be added here as they are approved.</p>}
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
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Innovation', description: 'Deliver practical technologies that make operations more efficient and effective.', icon: Lightbulb },
              { title: 'Sustainability', description: 'Support recycling, resource recovery and circular economic opportunities.', icon: Compass },
              { title: 'Operations', description: 'Create dependable supply chains and resilient service delivery models.', icon: Target },
              { title: 'Partnerships', description: 'Work alongside communities, institutions and private sector partners.', icon: Users },
            ].map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-6 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
                <Icon className="mb-4 h-10 w-10 text-[var(--color-emerald)]" />
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
