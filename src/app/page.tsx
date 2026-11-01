import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { company, homepage, services } = await getSiteContent();
  const articles = (await getNewsCards()).slice(0, 3);
  return (
    <>
      <section className="home-hero relative overflow-hidden bg-[#17231d] text-white">
        <div className="container relative z-10 py-20 lg:py-28">
          <div className="max-w-5xl pt-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#d8e7da]">
              <Sparkles className="h-3.5 w-3.5 text-[#9ac8a7]" />
              {company.name}
            </div>
            <h1 className="max-w-4xl whitespace-pre-line text-4xl font-semibold leading-none tracking-[-0.06em] text-white md:text-6xl lg:text-[5.5rem]">{homepage.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg text-[#d9d9d5] md:text-xl">
              {homepage.introduction}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/services" className="btn btn-primary">
                Explore Our Services <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Discover Jama Tech
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-3 text-sm text-[#d9d9d5]">
              {services.slice(0, 4).map((service) => <span key={service.slug} className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{service.short}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f0ea] py-16 text-[#1d1f20] lg:py-24">
        <div className="container">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
              One accountable partner across four essential service pillars.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Based in Juba', 'A South Sudanese social enterprise serving organisations and communities across the country.'],
              ['Nationwide Delivery', 'Field delivery to locations across South Sudan, including remote areas reached through our logistics network.'],
              ['Four Service Pillars', 'Supply logistics, plastic recycling, ICT consultancy, and internet and web development.'],
              ['Auditable Delivery', 'Every engagement begins with a scoped assessment and ends with documented delivery.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-[#d9d0c4] bg-white/40 p-6 shadow-[0_14px_40px_rgba(26,30,30,0.04)]">
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
                <p className="text-base leading-7 text-[#555b5c]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-[#1d1f20] lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#28583e]">Explore Jama Tech</p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">Integrated solutions for modern operations.</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-[#354239] transition-colors hover:text-[#28583e]">
              All solutions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group relative overflow-hidden rounded-[2rem] border border-[#dfe5df] bg-[#17231d]">
                <div className="relative h-72 overflow-hidden">
                  <img src={imageSource(service.image, 1000)} alt={service.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1114]/90 via-[#0d1114]/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#9ac8a7]">{service.short}</div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{service.title}</h3>
                  <p className="mt-3 max-w-md text-sm text-[#d7d5d2] md:text-base">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-[#1d1f20] lg:py-24">
        <div className="container grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-semibold uppercase text-[#28583e]">Our vision</p>
            <p className="text-lg leading-8 text-[#1b211d]">{company.vision}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-semibold uppercase text-[#28583e]">Our mission</p>
            <p className="text-lg leading-8 text-[#1b211d]">{company.mission}</p>
          </div>
        </div>
      </section>

      {homepage.sections.filter((section) => section.enabled).map((section, index) => (
        <section key={section.id} className={`${index % 2 === 0 ? 'bg-[#f4f6f3]' : 'bg-white'} py-16 text-[#1d1f20] lg:py-24`}>
          <div className={`container grid items-center gap-8 ${section.imageUrl ? 'lg:grid-cols-2' : ''}`}>
            <div className="max-w-3xl">
              {section.eyebrow && <p className="mb-3 text-xs font-semibold uppercase text-[#28583e]">{section.eyebrow}</p>}
              <h2 className="text-3xl font-semibold md:text-4xl">{section.title}</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-8 text-[#48534b]">{section.body}</p>
            </div>
            {section.imageUrl && (
              <div className="section-image-frame">
                <img src={imageSource(section.imageUrl, 1200)} alt="" className="h-full min-h-[18rem] max-h-[28rem] w-full rounded-[1.5rem] object-cover" />
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="bg-[#f4f0ea] py-16 text-[#1d1f20] lg:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#496b5b]">Our partnerships</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">Built around the way you operate.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Humanitarian & Government', 'Compliant procurement, documented distribution and field-ready logistics for agencies delivering at scale.'],
              ['Private Sector', 'Supply chain, recycling and digital infrastructure delivered on commercial timelines and clear service levels.'],
              ['Community & Local Partners', 'Local collection networks, skills training and shared-value programmes that keep benefit in the community.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[1.75rem] border border-[#d9d0c4] bg-white/50 p-6">
                <h3 className="mb-4 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
                <p className="text-base leading-7 text-[#555b5c]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f6f3] py-16 text-[#1d1f20] lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80"
              alt="Humanitarian supply distribution in the field"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#28583e]">How we work</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">From scoped assessment to documented delivery.</h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-[#48534b]">
              <p>
                Each engagement starts with a scoped assessment and ends with clear, auditable delivery.
              </p>
              <p>
                Our team brings together procurement, field logistics, digital infrastructure and recycling expertise to meet the requirements of each partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f0ea] py-16 text-[#1d1f20] lg:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#496b5b]">The Jama Tech approach</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">A more thoughtful way to grow.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ['Integrity & Transparency', 'Clear accountability, ethical standards and honest communication across every partnership.'],
              ['Environmental Stewardship', 'Circular economy and responsible resource management to protect local ecosystems.'],
              ['Community Empowerment', 'Local opportunity, technical capacity and support for humanitarian and development initiatives.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[2rem] border border-[#d9d0c4] bg-white/50 p-6 shadow-[0_14px_32px_rgba(0,0,0,0.03)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d1114] text-[#9ac8a7]">
                  {title === 'Integrity & Transparency' ? <ShieldCheck className="h-5 w-5" /> : title === 'Environmental Stewardship' ? <Cpu className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
                <p className="text-base leading-7 text-[#555b5c]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-[#28583e]">News &amp; insights</p>
              <h2 className="text-3xl text-[#172019] md:text-4xl">Stories from Jama Tech.</h2>
            </div>
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[#28583e] hover:underline">
              All stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.slug} href={`/news/${article.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-[#dfe5df] bg-white shadow-sm transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={article.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-xs font-medium text-[#56615a]">{article.date}</p>
                  <h3 className="mb-2 text-xl text-[#172019]">{article.title}</h3>
                  <p className="line-clamp-3 text-sm leading-6 text-[#56615a]">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container">
          <div className="rounded-[2.25rem] border border-[#28583e] bg-[#28583e] p-8 text-white md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-white/80">Let&apos;s start</p>
                <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">Build something that matters.</h2>
              </div>
              <Link href="/contact" className="btn rounded-full bg-white text-[#172019] hover:bg-[#eef3ee]">
                Let&apos;s Start <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
