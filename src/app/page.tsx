import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, TeamMembersSection } from '@/components/content/EditablePage';
import { HomeHeroSlider } from '@/components/content/HomeHeroSlider';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { company, homepage, pages, services, teamMembers } = await getSiteContent();
  const articles = (await getNewsCards()).slice(0, 3);

  return (
    <>
      <HomeHeroSlider slides={homepage.heroSlides} location={company.location} serviceLabels={services.map((service) => service.short)} />

      <section className="bg-[#f4f6f3] py-16 text-[#172019] lg:py-24">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{pages.services.eyebrow}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{pages.services.title}</h2><p className="mt-4 text-base leading-7 text-[#56615a]">{pages.services.introduction}</p></div>
            <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-[#28583e]">All services <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="group relative min-h-72 overflow-hidden rounded-[1.75rem] bg-[#17231d]">
              <img src={imageSource(service.image, 1000)} alt={service.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101812]/95 via-[#101812]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b3e3ed]">{service.number} · {service.short}</p><h3 className="mt-2 text-2xl font-semibold">{service.title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">{service.description}</p></div>
            </Link>)}
          </div>
        </div>
      </section>

      <EditableSections sections={homepage.sections} />

      <TeamMembersSection teamMembers={teamMembers} eyebrow="Our people" title="The team delivering practical change." />

      <section className="bg-white py-16 text-[#172019] lg:py-24">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{pages.news.eyebrow}</p><h2 className="text-3xl font-semibold md:text-4xl">{pages.news.title}</h2></div><Link href="/news" className="inline-flex items-center gap-2 font-semibold text-[#28583e]">All stories <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-5 md:grid-cols-3">{articles.map((article) => <Link key={article.slug} href={`/news/${article.slug}`} className="overflow-hidden rounded-2xl border border-[#dfe5df] bg-white"><img src={article.image} alt="" className="h-48 w-full object-cover" /><div className="p-5"><p className="text-xs text-[#56615a]">{article.date}</p><h3 className="mt-2 text-xl font-semibold">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#56615a]">{article.excerpt}</p></div></Link>)}</div>
        </div>
      </section>

    </>
  );
}
