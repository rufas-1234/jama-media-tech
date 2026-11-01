import { ArrowRight } from 'lucide-react';
import { imageSource, leadershipRoles } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  const { teamMembers } = await getSiteContent();
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <p className="page-kicker">Leadership & governance</p>
          <h1 className="page-title">Experienced leadership for practical delivery.</h1>
          <p className="page-intro max-w-3xl">
            Jama Tech LTD is led by a multidisciplinary team focused on technical delivery, operational excellence, sustainability and institutional partnership.
          </p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.length ? teamMembers.map((member) => (
            <div key={member.id} className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-6 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
              {member.imageUrl ? <img src={imageSource(member.imageUrl, 700)} alt={member.name} className="mb-5 h-56 w-full rounded-xl object-cover" /> : <div aria-hidden="true" className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">{member.name.slice(0, 1)}</div>}
              <h2 className="mb-1 text-xl text-[#1d1f20]">{member.name}</h2>
              <p className="mb-3 text-sm font-medium text-[#28583e]">{member.role}</p>
              <p className="whitespace-pre-line text-base leading-7 text-[#4f5557]">{member.biography}</p>
            </div>
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
