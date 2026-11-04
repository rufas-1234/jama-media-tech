import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, ClipboardCheck, Cpu, MapPin, Recycle, SearchCheck, ShieldCheck, Sparkles, Truck, Wifi } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { company, homepage, services } = await getSiteContent();
  const articles = (await getNewsCards()).slice(0, 3);
  const serviceIcons = [Truck, Recycle, Cpu, Wifi];
  const processSteps = [
    { number: '01', title: 'Understand', description: 'Scope the need, operating context and outcomes with your team.', Icon: SearchCheck },
    { number: '02', title: 'Shape the solution', description: 'Bring the right supply, sustainability or technology capabilities together.', Icon: Sparkles },
    { number: '03', title: 'Deliver with clarity', description: 'Agree responsibilities and keep communication and delivery documented.', Icon: ClipboardCheck },
  ];
  return (
    <>
      <section className="home-hero relative overflow-hidden bg-white text-[#172019]">
        <div className="container relative z-10 grid items-center gap-12 py-16 sm:py-20 lg:min-h-[42rem] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          <div className="home-hero-copy max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfe5df] bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#28583e] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-[#28583e]" />
              South Sudanese social enterprise
            </div>
            <h1 className="max-w-3xl whitespace-pre-line text-[clamp(2.65rem,5.5vw,4.75rem)] font-semibold leading-[1.01] tracking-[-0.065em] text-[#172019]">{homepage.headline}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#48534b] sm:text-lg sm:leading-8">
              {homepage.introduction}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn btn-primary justify-center">
                Explore our services <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about" className="btn btn-secondary justify-center">
                Discover Jama Tech
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-[#48534b]">
              <MapPin className="h-4 w-4 shrink-0 text-[#28583e]" />
              <span>{company.location}</span>
            </div>
          </div>

          <div className="home-hero-visual relative mx-auto w-full max-w-[34rem] lg:ml-auto">
            <div className="home-hero-image overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_35px_90px_rgba(0,0,0,0.38)]">
              <img src={imageSource('photo-1593113630400-ea4288922497', 1200)} alt="A community team working together on a local project" className="h-[21rem] w-full object-cover sm:h-[28rem]" />
            </div>
            <div className="home-hero-float absolute -bottom-5 left-3 right-3 flex items-center gap-4 rounded-2xl border border-white/50 p-4 backdrop-blur-2xl backdrop-saturate-150 sm:-left-8 sm:right-8 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#101c65] text-white ring-4 ring-white/30">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#28583e]">Rooted in South Sudan</span>
                <span className="mt-1 block text-sm font-semibold text-[#172019] sm:text-base">{company.location}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-[#28583e]" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-pillars bg-[#f4f0ea] py-16 text-[#1d1f20] lg:py-24">
        <div className="container">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#28583e]">Local knowledge. Practical capability.</p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">One partner for essential operations.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[#555b5c]">From supply and sustainability to digital infrastructure, our teams bring complementary capabilities together.</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <Link key={service.slug} href={`/services/${service.slug}`} className="pillar-link group flex min-h-36 items-start gap-4 rounded-2xl border border-[#d9d0c4] bg-white/60 p-5 transition-transform hover:-translate-y-1">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17231d] text-[#69d6ec]"><Icon className="h-5 w-5" /></span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#647067]">{service.number}</span>
                    <span className="mt-1 block text-base font-semibold leading-snug text-[#172019]">{service.short}</span>
                    <ArrowUpRight className="mt-3 h-4 w-4 text-[#28583e] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              );
            })}
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
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group relative overflow-hidden rounded-[2rem] border border-[#dfe5df] bg-[#17231d]">
                <div className="relative h-72 overflow-hidden sm:h-80">
                  <img src={imageSource(service.image, 1000)} alt={service.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1114]/90 via-[#0d1114]/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-[#b3e3ed]"><span>{service.short}</span><span>{service.number}</span></div>
                  <h3 className="max-w-lg text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{service.title}</h3>
                  <p className="mt-3 max-w-md text-sm text-[#d7d5d2] md:text-base">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process bg-[#17231d] py-16 text-white lg:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#69d6ec]">How we work</p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl md:text-5xl">Clear steps. Accountable delivery.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">We start by understanding the context, shape the right response with our partners, and keep delivery clear from beginning to end.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {processSteps.map(({ number, title, description, Icon }) => (
              <div key={number} className="process-card rounded-2xl border border-white/10 bg-[#ffffff0f] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#69d6ec]">{number}</span>
                  <Icon className="h-5 w-5 text-[#a6d6b1]" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{description}</p>
              </div>
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
