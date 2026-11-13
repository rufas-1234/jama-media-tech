import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, TeamMembersSection } from '@/components/content/EditablePage';
import { HomeHeroSlider } from '@/components/content/HomeHeroSlider';
import { HomeServicesSection } from '@/components/content/HomeServicesSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { company, homepage, pages, services, teamMembers } = await getSiteContent();
  const articles = (await getNewsCards()).slice(0, 3);

  return (
    <>
      <HomeHeroSlider slides={homepage.heroSlides} location={company.location} services={services.map(({ slug, short }) => ({ slug, short }))} />

      <HomeServicesSection
        services={services}
        eyebrow={pages.services.eyebrow}
        title={pages.services.title}
        introduction={pages.services.introduction}
      />

      <EditableSections sections={homepage.sections} />

      <TeamMembersSection teamMembers={teamMembers} eyebrow="Our people" title="The team delivering practical change." />

      <section className="bg-white py-16 text-[#172019] lg:py-24">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{pages.news.eyebrow}</p><h2 className="text-3xl font-semibold md:text-4xl">{pages.news.title}</h2></div><Link href="/news" className="inline-flex items-center gap-2 font-semibold text-[#28583e]">All stories <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-5 md:grid-cols-3">{articles.map((article) => <Link key={article.slug} href={`/news/${article.slug}`} className="overflow-hidden rounded-2xl border border-[#dfe5df] bg-white"><img src={article.image} alt="" className="aspect-video w-full object-cover" /><div className="p-5"><p className="text-xs text-[#56615a]">{article.date}</p><h3 className="mt-2 text-xl font-semibold">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#56615a]">{article.excerpt}</p></div></Link>)}</div>
        </div>
      </section>

    </>
  );
}
