import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { services, pages } = await getSiteContent();

  return (
    <>
      <PageHero page={pages.services} />

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#28583e]">{pages.services.eyebrow}</p>
              <h2 className="text-3xl text-[#172019] md:text-4xl">{pages.services.title}</h2>
            </div>
            <Link href="/request-quotation" className="inline-flex items-center gap-2 text-sm font-semibold text-[#28583e] hover:text-[#17231d]">
              Discuss a requirement <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="service-card group overflow-hidden rounded-[1.75rem] border border-[#dfe5df] bg-white">
                <div className="relative h-60 overflow-hidden sm:h-72">
                  <img src={imageSource(service.image, 1000)} alt={service.alt} className="service-card-image h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101812]/90 via-[#101812]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-7">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b3e3ed]">{service.number} <span className="mx-1 text-white/50">/</span> {service.short}</p>
                      <h2 className="mt-2 max-w-xl text-2xl text-white sm:text-3xl">{service.title}</h2>
                    </div>
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowUpRight className="h-5 w-5" /></span>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-sm leading-7 text-[#56615a] sm:text-base">{service.introduction}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {service.capabilities.slice(0, 4).map((capability) => (
                      <span key={capability} className="flex items-start gap-2 text-xs leading-5 text-[#354239] sm:text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#28583e]" />{capability}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 border-t border-[#e7ebe7] pt-4 text-xs leading-5 text-[#647067]">
                    <span className="font-semibold text-[#354239]">Working with:</span> {service.audience}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <EditableSections sections={pages.services.sections} />
    </>
  );
}
