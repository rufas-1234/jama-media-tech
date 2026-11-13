'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { imageSource } from '@/lib/content';
import type { Service } from '@/lib/site-content';

export function HomeServicesSection({
  services,
  eyebrow,
  title,
  introduction,
}: {
  services: Service[];
  eyebrow: string;
  title: string;
  introduction: string;
}) {
  const [activeService, setActiveService] = useState<string | null>(null);
  const visibleServices = activeService
    ? services.filter((service) => service.slug === activeService)
    : services;

  return (
    <section className="bg-[#f4f6f3] py-16 text-[#172019] sm:py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#56615a]">{introduction}</p>
          </div>
          <Link href="/services" className="inline-flex w-fit shrink-0 items-center gap-2 font-semibold text-[#28583e] transition-colors hover:text-[#17231d]">
            All services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter services">
          <button
            type="button"
            aria-pressed={activeService === null}
            onClick={() => setActiveService(null)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${activeService === null ? 'border-[#28583e] bg-[#28583e] text-white' : 'border-[#d3dbd4] bg-white/70 text-[#3d4941] hover:border-[#28583e]/50 hover:bg-white'}`}
          >
            All capabilities
          </button>
          {services.map((service) => <button
            key={service.slug}
            type="button"
            aria-pressed={activeService === service.slug}
            onClick={() => setActiveService(service.slug)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${activeService === service.slug ? 'border-[#28583e] bg-[#28583e] text-white' : 'border-[#d3dbd4] bg-white/70 text-[#3d4941] hover:border-[#28583e]/50 hover:bg-white'}`}
          >
            {service.short}
          </button>)}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visibleServices.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="home-service-card group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.65rem] bg-[#17231d] p-6 text-white sm:min-h-[25rem] sm:p-8"
            >
              <img src={imageSource(service.image, 1100)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101812]/95 via-[#101812]/35 to-[#101812]/15" />
              <div className="flex items-start justify-between gap-4">
                <p className="rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                  {service.number} <span className="mx-1 text-white/45">/</span> {service.short}
                </p>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/40 bg-black/15 text-white backdrop-blur transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#17231d]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <div>
                <h3 className="max-w-xl text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{service.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">{service.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                  Explore this service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
