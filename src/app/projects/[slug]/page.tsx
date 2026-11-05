import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { imageSource } from '@/lib/content';
import { getProjectCardBySlug } from '@/lib/project-content';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectCardBySlug(slug);

  if (!project) notFound();

  return (
    <article className="min-h-screen bg-[#f7f8f5] pb-16 lg:pb-24">
      <section className="relative isolate min-h-[26rem] overflow-hidden bg-[#17231d] sm:min-h-[34rem]">
        <img src={imageSource(project.image, 1800)} alt={project.title} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101812]/95 via-[#101812]/45 to-[#101812]/15" />
        <div className="container flex min-h-[26rem] flex-col justify-end py-12 text-white sm:min-h-[34rem] lg:py-16">
          <Link href="/projects" className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-[#101812]/25 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5e8ed]">{project.category}</p>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{project.description}</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-white/80"><MapPin className="h-4 w-4 text-[#b3e3ed]" />{project.location}</p>
        </div>
      </section>

      <section className="container -mt-8 relative z-10">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-[#dfe5df] bg-white p-6 shadow-[0_24px_70px_rgba(24,43,31,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#28583e]">Project overview</p>
          <div className="mt-5 whitespace-pre-line text-base leading-8 text-[#48534b] sm:text-lg">{project.content}</div>
        </div>
      </section>
    </article>
  );
}
