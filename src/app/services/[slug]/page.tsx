import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { services } = await getSiteContent();
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 2);

  return (
    <>
      <section className="service-detail-hero relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
        <div className="container relative z-10">
          <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5e8ed]">{service.number} / {service.short}</p>
          <h1 className="max-w-4xl text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">{service.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{service.introduction}</p>
          <Link href="/request-quotation" className="btn btn-primary mt-8">
            Discuss this service <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="service-capabilities-panel rounded-[1.75rem] border border-[#dfe5df] bg-white p-6 sm:p-8">
              <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">What we deliver</p>
              <h2 className="mb-4 text-3xl text-[#1d1f20] md:text-4xl">Capabilities for your requirements.</h2>
              <p className="mb-7 text-base leading-7 text-[#56615a]">{service.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {service.capabilities.map((capability) => (
                  <div key={capability} className="flex items-start gap-3 rounded-xl border border-[#e7ebe7] bg-[#f7f8f5] p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#28583e]" />
                    <span className="text-sm leading-6 text-[#26312a]">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="service-audience-panel rounded-[1.75rem] border border-[#dfe5df] bg-[#f1f4f0] p-6 sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17231d] text-[#69d6ec]"><Users className="h-5 w-5" /></span>
              <h3 className="mb-3 mt-6 text-2xl text-[#1d1f20]">Who we work with</h3>
              <p className="text-base leading-7 text-[#4f5557]">{service.audience}</p>
              <div className="mt-8 border-t border-[#d9e0d9] pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#28583e]">A considered approach</p>
                <p className="text-sm leading-7 text-[#4f5557]">We align scope, resources and delivery around your requirements and operating context.</p>
                <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#28583e] hover:text-[#17231d]">
                  Talk with our team <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f0ea] py-16 lg:py-24">
        <div className="container">
          <div className="mb-10">
            <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">Related services</p>
            <h2 className="text-3xl text-[#1d1f20] md:text-4xl lg:text-5xl">Explore more.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white/80 shadow-[0_18px_35px_rgba(17,24,26,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,16,20,0.12)]">
                <div className="h-48 overflow-hidden">
                  <img src={imageSource(item.image, 800)} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#28583e]">{item.short}</p>
                  <h3 className="mb-3 text-2xl text-[#1d1f20]">{item.title}</h3>
                  <span className="inline-flex items-center gap-2 font-semibold text-[#28583e]">
                    View service <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-16 text-white lg:py-20">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl text-white md:text-4xl lg:text-5xl">Need a tailored solution?</h2>
          <Link href="/request-quotation" className="btn btn-primary inline-flex">
            Request a quotation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
