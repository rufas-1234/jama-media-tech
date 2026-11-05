import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { imageSource } from '@/lib/content';
import { getSiteContent, type EditablePage, type HomeSection } from '@/lib/site-content';

export function PageHero({ page }: { page: EditablePage }) {
  return (
    <section className="relative overflow-hidden bg-[#17231d] py-16 text-white sm:py-20 lg:py-28">
      <div className={`container relative z-10 grid items-center gap-10 ${page.imageUrl ? 'lg:grid-cols-[1fr_0.8fr]' : ''}`}>
        <div className="max-w-4xl">
          {page.eyebrow && <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3e3ed]">{page.eyebrow}</p>}
          <h1 className="whitespace-pre-line text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">{page.title}</h1>
          {page.introduction && <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{page.introduction}</p>}
        </div>
        {page.imageUrl && <img src={imageSource(page.imageUrl, 1200)} alt="" className="max-h-[28rem] min-h-64 w-full rounded-[2rem] object-cover shadow-2xl" />}
      </div>
    </section>
  );
}

export function EditableSections({ sections }: { sections: HomeSection[] }) {
  return (
    <>
      {sections.filter((section) => section.enabled).map((section, index) => (
        <section key={section.id} className={`${index % 2 ? 'bg-[#f4f6f3]' : 'bg-white'} py-16 text-[#172019] lg:py-24`}>
          <div className={`container grid items-center gap-8 ${section.imageUrl ? 'lg:grid-cols-2' : ''}`}>
            <div className="max-w-3xl">
              {section.eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#28583e]">{section.eyebrow}</p>}
              <h2 className="whitespace-pre-line text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{section.title}</h2>
              {section.body && <div className="mt-4 space-y-4 whitespace-pre-line text-base leading-8 text-[#48534b]">{section.body.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>}
              {section.buttonText && section.buttonHref && <Link href={section.buttonHref} className="btn btn-primary mt-6 inline-flex">{section.buttonText}<ArrowUpRight className="h-4 w-4" /></Link>}
              {section.items && section.items.length > 0 && (
                <div className={`mt-8 grid gap-4 ${section.items.length > 2 ? 'sm:grid-cols-2' : ''}`}>
                  {section.items.map((item, itemIndex) => (
                    <article key={`${item.title}-${itemIndex}`} className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-sm">
                      {item.imageUrl && <img src={imageSource(item.imageUrl, 800)} alt="" className="mb-4 h-40 w-full rounded-xl object-cover" />}
                      <h3 className="text-lg font-semibold text-[#172019]">{item.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#56615a]">{item.body}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
            {section.imageUrl && <img src={imageSource(section.imageUrl, 1200)} alt="" className="max-h-[28rem] min-h-64 w-full rounded-[1.75rem] object-cover" />}
          </div>
        </section>
      ))}
    </>
  );
}

export async function EditablePageView({ slug }: { slug: string }) {
  const { pages } = await getSiteContent();
  const page = pages[slug];
  if (!page) return null;
  return <><PageHero page={page} /><EditableSections sections={page.sections} /></>;
}
