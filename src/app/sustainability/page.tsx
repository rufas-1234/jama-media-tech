import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, ShieldCheck, Users } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <p className="page-kicker">Sustainability</p>
          <h1 className="page-title">Environmental stewardship is part of how we work.</h1>
          <p className="page-intro max-w-3xl">
            Jama Tech LTD recognises that resilient communities and thriving organisations depend on healthier environments, circular systems and practical local solutions.
          </p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Environmental commitment</p>
            <h2 className="mb-6 text-3xl text-[#1d1f20] md:text-4xl">Cleaner systems, stronger local value.</h2>
            <p className="mb-4 text-lg leading-8 text-[#4f5557]">
              Our sustainability approach focuses on reducing waste, reclaiming valuable resources and supporting communities to participate in cleaner, stronger local economies.
            </p>
            <p className="text-lg leading-8 text-[#4f5557]">
              We work to combine practical operational needs with environmental responsibility, ensuring our work contributes to long-term value rather than temporary gain.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white shadow-[0_18px_50px_rgba(17,24,26,0.08)]">
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80" alt="Waste recycling process" className="h-full min-h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-16 text-white lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#9ac8a7] !tracking-[0.2em] !text-xs !mb-4">Priority themes</p>
            <h2 className="text-3xl text-white md:text-4xl lg:text-5xl">Sustainability in action.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Plastic waste management', description: 'Collecting and processing material streams responsibly.', icon: Recycle },
              { title: 'Mechanical processing', description: 'Transforming waste into recoverable resources for reintegration into value chains.', icon: Leaf },
              { title: 'Circular economy', description: 'Reducing waste through smarter resource use and local recovery systems.', icon: ShieldCheck },
              { title: 'Community participation', description: 'Raising awareness and empowering local participation in environmental action.', icon: Users },
            ].map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <Icon className="mb-4 h-10 w-10 text-[var(--color-emerald)]" />
                <h3 className="mb-3 text-xl text-white">{title}</h3>
                <p className="text-base leading-7 text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl text-[#1d1f20] md:text-4xl lg:text-5xl">Better systems for a healthier future.</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-8 text-[#4f5557]">
            We believe that sustainability is not just a policy area—it is an operational commitment that improves systems, protects resources and creates opportunity.
          </p>
          <Link href="/contact" className="btn btn-primary inline-flex">
            Discuss a sustainability partnership <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
