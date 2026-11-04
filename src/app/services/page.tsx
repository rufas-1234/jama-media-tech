import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, ClipboardCheck, Compass, Handshake, SearchCheck } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const { services } = await getSiteContent();
  const steps = [
    { number: '01', title: 'Understand the need', body: 'Start with the operating context, requirements and intended outcomes.', Icon: SearchCheck },
    { number: '02', title: 'Shape the response', body: 'Agree a practical scope and the right capabilities for the work.', Icon: Compass },
    { number: '03', title: 'Coordinate delivery', body: 'Align people, resources and communication around the agreed plan.', Icon: Handshake },
    { number: '04', title: 'Close out clearly', body: 'Share progress, delivery records and next steps with the partner.', Icon: ClipboardCheck },
  ];

  return (
    <>
      <section className="services-hero relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
        <div className="container relative z-10 grid items-end gap-8 lg:grid-cols-[1fr_0.7fr]">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5e8ed] backdrop-blur-xl">What we do</p>
            <h1 className="max-w-4xl text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">One connected partner.<br />Essential capabilities.</h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Practical services across supply, sustainability and technology—shaped around each partner’s operating context.
            </p>
            <p className="mt-5 text-sm font-medium text-[#b3e3ed]">{services.length} service areas · South Sudan</p>
          </div>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#28583e]">Our capabilities</p>
              <h2 className="text-3xl text-[#172019] md:text-4xl">Designed around real operating needs.</h2>
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

      <section className="bg-[#17231d] py-16 text-white lg:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#69d6ec]">A clear way of working</p>
            <h2 className="text-3xl text-white md:text-4xl">From first conversation to clear delivery.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ number, title, body, Icon }) => (
              <article key={number} className="service-step rounded-2xl border border-white/10 bg-[#ffffff0f] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#69d6ec]">{number}</span>
                  <Icon className="h-5 w-5 text-[#a6d6b1]" />
                </div>
                <h3 className="mt-7 text-lg text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-xl text-white">Have a specific requirement?</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">Talk with our team about scope, timing and the right service for your needs.</p>
            </div>
            <Link href="/request-quotation" className="btn btn-primary shrink-0 justify-center">
              Request a quotation <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
