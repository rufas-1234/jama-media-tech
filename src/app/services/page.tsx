import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { services } = await getSiteContent();
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <p className="page-kicker">Our services</p>
          <h1 className="page-title">Integrated solutions for growth, resilience and sustainability.</h1>
          <p className="page-intro max-w-3xl">
            Jama Tech LTD delivers practical, end-to-end solutions across supply chain operations, environmental sustainability, ICT, and digital infrastructure.
          </p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white/80 shadow-[0_18px_40px_rgba(11,16,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,16,20,0.12)]">
              <div className="relative h-72">
                <img src={imageSource(service.image, 900)} alt={service.alt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-[var(--color-navy)]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-emerald)]">{service.short}</div>
                  <h2 className="mt-2 text-2xl text-white md:text-3xl">{service.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-5 text-base leading-7 text-[#4f5557]">{service.introduction}</p>
                <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-emerald)]">
                  Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
