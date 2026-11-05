import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { company, homepage, pages, services } = await getSiteContent();
  const articles = (await getNewsCards()).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
        <div className={`container grid items-center gap-10 ${homepage.heroImage ? 'lg:grid-cols-[1fr_0.85fr]' : ''}`}>
          <div className="max-w-3xl">
            {homepage.eyebrow && <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3e3ed]">{homepage.eyebrow}</p>}
            <h1 className="whitespace-pre-line text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">{homepage.headline}</h1>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{homepage.introduction}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={homepage.primaryCtaHref} className="btn btn-primary">{homepage.primaryCtaLabel}<ArrowRight className="h-5 w-5" /></Link>
              <Link href={homepage.secondaryCtaHref} className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20">{homepage.secondaryCtaLabel}</Link>
            </div>
            <p className="mt-7 flex items-center gap-2 text-sm text-white/70"><MapPin className="h-4 w-4 text-[#69d6ec]" />{company.location}</p>
          </div>
          {homepage.heroImage && <img src={imageSource(homepage.heroImage, 1200)} alt="" className="max-h-[34rem] min-h-64 w-full rounded-[2rem] object-cover shadow-2xl" />}
        </div>
      </section>

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

      <section className="bg-white py-16 text-[#172019] lg:py-24">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{pages.news.eyebrow}</p><h2 className="text-3xl font-semibold md:text-4xl">{pages.news.title}</h2></div><Link href="/news" className="inline-flex items-center gap-2 font-semibold text-[#28583e]">All stories <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-5 md:grid-cols-3">{articles.map((article) => <Link key={article.slug} href={`/news/${article.slug}`} className="overflow-hidden rounded-2xl border border-[#dfe5df] bg-white"><img src={article.image} alt="" className="h-48 w-full object-cover" /><div className="p-5"><p className="text-xs text-[#56615a]">{article.date}</p><h3 className="mt-2 text-xl font-semibold">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#56615a]">{article.excerpt}</p></div></Link>)}</div>
        </div>
      </section>

    </>
  );
}
