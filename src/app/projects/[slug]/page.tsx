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
      <section className="bg-[#17231d] py-10 sm:py-14 lg:py-16">
        <div className="container grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-12">
          <div className="text-white">
            <Link href="/projects" className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5e8ed]">{project.category}</p>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{project.description}</p>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/80"><MapPin className="h-4 w-4 text-[#b3e3ed]" />{project.location}</p>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[38rem] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#101812]/70 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:rounded-[2rem]">
            <img src={imageSource(project.image, 1400)} alt={project.title} className="h-full w-full object-contain" />
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-[#dfe5df] bg-white p-6 shadow-[0_24px_70px_rgba(24,43,31,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#28583e]">Project overview</p>
          <div className="mt-5 whitespace-pre-line text-base leading-8 text-[#48534b] sm:text-lg">{project.content}</div>
        </div>
      </section>
      {project.images.length > 1 && <section className="container mt-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-5 text-2xl font-semibold text-[#172019]">Project gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.images.slice(1).map((image, index) => <img key={`${image}-${index}`} src={imageSource(image, 1200)} alt={`${project.title} — image ${index + 2}`} className="aspect-[4/3] w-full rounded-2xl object-cover" />)}
          </div>
        </div>
      </section>}
    </article>
  );
}
