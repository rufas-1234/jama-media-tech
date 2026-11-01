import { notFound } from 'next/navigation';
import { getProjectCardBySlug } from '@/lib/project-content';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectCardBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="page-hero min-h-screen py-20 lg:py-28">
      <div className="container">
        <div className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-8 md:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)]">{project.category}</p>
          <h1 className="mb-6 text-4xl text-[#1d1f20] md:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="mb-8 text-lg leading-8 text-[#4f5557]">{project.description}</p>
          <div className="glass-panel rounded-[1.75rem] p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)]">Project overview</p>
            <p className="mb-2 text-base text-[#4f5557]">Location: {project.location}</p>
            <p className="whitespace-pre-line text-base leading-8 text-[#4f5557]">{project.content}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
