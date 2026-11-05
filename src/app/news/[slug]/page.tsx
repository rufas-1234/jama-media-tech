import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { notFound } from 'next/navigation';
import { imageSource } from '@/lib/content';
import { getArticleBySlug } from '@/lib/cms-content';
import { fallbackArticles } from '@/lib/news-content';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmsArticle = await getArticleBySlug(slug);
  const fallbackArticle = fallbackArticles.find((item) => item.slug === slug);

  if (!cmsArticle && !fallbackArticle) notFound();

  const article = cmsArticle ?? {
    title: fallbackArticle!.title,
    excerpt: fallbackArticle!.excerpt,
    content: fallbackArticle!.content,
    date: fallbackArticle!.date,
    imageUrl: fallbackArticle!.image,
    imageUrls: fallbackArticle!.images,
    category: 'News & insights',
  };
  const date = cmsArticle?.date
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(cmsArticle.date))
    : fallbackArticle?.date;

  return (
    <article className="min-h-screen bg-[#f7f8f5] pb-16 lg:pb-24">
      <section className="relative isolate min-h-[26rem] overflow-hidden bg-[#17231d] sm:min-h-[34rem]">
        <img src={imageSource(article.imageUrl, 1800)} alt={article.title} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101812]/95 via-[#101812]/45 to-[#101812]/15" />
        <div className="container flex min-h-[26rem] flex-col justify-end py-12 text-white sm:min-h-[34rem] lg:py-16">
          <Link href="/news" className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-[#101812]/25 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" /> All news
          </Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5e8ed]">{article.category || 'News & insights'}</p>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{article.title}</h1>
          {article.excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{article.excerpt}</p>}
          {date && <p className="mt-5 flex items-center gap-2 text-sm text-white/80"><CalendarDays className="h-4 w-4 text-[#b3e3ed]" />{date}</p>}
        </div>
      </section>

      <section className="container relative z-10 -mt-8">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-[#dfe5df] bg-white p-6 shadow-[0_24px_70px_rgba(24,43,31,0.12)] sm:p-10">
          <div className="whitespace-pre-line text-base leading-8 text-[#48534b] sm:text-lg">{article.content}</div>
        </div>
      </section>
      {article.imageUrls.length > 1 && <section className="container mt-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-5 text-2xl font-semibold text-[#172019]">Story gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {article.imageUrls.slice(1).map((image, index) => <img key={`${image}-${index}`} src={imageSource(image, 1200)} alt={`${article.title} — image ${index + 2}`} className="aspect-[4/3] w-full rounded-2xl object-cover" />)}
          </div>
        </div>
      </section>}
    </article>
  );
}
