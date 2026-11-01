import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <section className="page-hero relative py-20 lg:py-28">
        <div className="container relative z-10">
          <p className="page-kicker">{service.short}</p>
          <h1 className="page-title max-w-3xl">{service.title}</h1>
          <p className="page-intro max-w-2xl">{service.introduction}</p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="page-kicker !bg-transparent !border-0 !p-0 !text-[#496b5b] !tracking-[0.2em] !text-xs !mb-4">What we deliver</p>
              <h2 className="mb-5 text-3xl text-[#1d1f20] md:text-4xl">{service.title}</h2>
              <p className="mb-6 text-lg leading-8 text-[#4f5557]">{service.introduction}</p>
              <div className="space-y-4">
                {service.capabilities.map((capability) => (
                  <div key={capability} className="flex items-start gap-3 rounded-[1.25rem] border border-[#d9d0c4] bg-white/80 p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--color-emerald)]" />
                    <span className="text-base text-[#1d1f20]">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/80 p-8 shadow-[0_18px_35px_rgba(17,24,26,0.04)]">
              <h3 className="mb-4 text-2xl text-[#1d1f20]">Target clients</h3>
              <p className="mb-6 text-base leading-7 text-[#4f5557]">{service.audience}</p>
              <div className="rounded-[1.5rem] border border-[#d9d0c4] bg-[#f4f0ea] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-emerald)]">Delivery approach</p>
                <p className="text-base leading-7 text-[#4f5557]">We align the right resources, operational model and delivery plan to the specific needs of each organisation and project environment.</p>
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
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-emerald)]">{item.short}</p>
                  <h3 className="mb-3 text-2xl text-[#1d1f20]">{item.title}</h3>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-emerald)]">
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
