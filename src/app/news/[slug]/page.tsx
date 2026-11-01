import { notFound } from 'next/navigation';
import { getArticleBySlug, plainText } from '@/lib/wordpress';
import { fallbackArticles } from '@/lib/news-content';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmsArticle = await getArticleBySlug(slug);
  const fallbackArticle = fallbackArticles.find((item) => item.slug === slug);

  if (!cmsArticle && !fallbackArticle) {
    notFound();
  }

  const title = cmsArticle ? plainText(cmsArticle.title.rendered) : fallbackArticle!.title;
  const content = cmsArticle ? plainText(cmsArticle.content.rendered) : fallbackArticle!.content;

  return (
    <main className="page-hero min-h-screen py-20 lg:py-28">
      <div className="container">
        <article className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-8 md:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)]">News & insights</p>
          <h1 className="mb-6 text-4xl text-[#1d1f20] md:text-5xl lg:text-6xl">{title}</h1>
          <div className="whitespace-pre-line text-lg leading-8 text-[#4f5557]">{content}</div>
        </article>
      </div>
    </main>
  );
}
