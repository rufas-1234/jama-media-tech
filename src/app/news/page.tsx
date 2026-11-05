import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNewsCards } from '@/lib/news-content';
import { getSiteContent } from '@/lib/site-content';
import { PageHero, EditableSections } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const articles = await getNewsCards();
  const { pages } = await getSiteContent();
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <>
      <PageHero page={pages.news} />
      <EditableSections sections={pages.news.sections} />

      <section className="section-surface py-12 lg:py-20">
        <div className="container">
          {featuredArticle && <Link href={`/news/${featuredArticle.slug}`} className="news-feature group grid overflow-hidden rounded-[2rem] border border-[#dfe5df] bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-[26rem]">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="news-cover-image absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#28583e]">Featured story</span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{featuredArticle.category}{featuredArticle.date && ` · ${featuredArticle.date}`}</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#172019] sm:text-4xl">{featuredArticle.title}</h2>
              <p className="mt-4 text-base leading-7 text-[#56615a]">{featuredArticle.excerpt}</p>
              <span className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-[#28583e]">Read the story <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>}

          <div className="mb-6 mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">From Jama Tech</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#172019] sm:text-3xl">Latest news &amp; insights</h2>
            </div>
            <span className="text-sm text-[#647067]">{articles.length} stories</span>
          </div>

          {otherArticles.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((article) => (
              <Link key={article.slug} href={`/news/${article.slug}`} className="news-card group block overflow-hidden rounded-[1.5rem] border border-[#dfe5df] bg-white shadow-sm">
                <div className="h-56 overflow-hidden">
                  <img src={article.image} alt={article.title} className="news-cover-image h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#28583e]">{article.category}{article.date && ` · ${article.date}`}</p>
                  <h3 className="mt-3 text-xl font-semibold text-[#172019]">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#56615a]">{article.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#28583e]">Read article <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div> : <p className="rounded-2xl border border-[#dfe5df] bg-white p-6 text-[#56615a]">More stories are on the way.</p>}
        </div>
      </section>
    </>
  );
}
