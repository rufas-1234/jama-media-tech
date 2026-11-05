import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';
import { PageHero, EditableSections } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const articles = await getNewsCards();
  const { pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.news} />
      <EditableSections sections={pages.news.sections} />

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="group block overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white/80 shadow-[0_18px_35px_rgba(17,24,26,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,16,20,0.12)]">
              <div className="h-56 overflow-hidden">
                <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="mb-3 text-sm text-[#4f5557]">{article.date}</p>
                <h2 className="mb-3 text-2xl text-[#1d1f20]">{article.title}</h2>
                <p className="mb-5 text-base leading-7 text-[#4f5557]">{article.excerpt}</p>
                <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-emerald)]">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
