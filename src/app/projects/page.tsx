import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projectCategories } from '@/lib/content';
import { getProjectCards } from '@/lib/project-content';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjectCards();
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <p className="page-kicker">Projects & impact</p>
          <h1 className="page-title">Practical work that creates measurable value.</h1>
          <p className="page-intro max-w-3xl">Our projects span digital systems, sustainable logistics, recycling initiatives and community-facing solutions across South Sudan.</p>
        </div>
      </section>

      <section className="bg-[#f4f0ea] py-10">
        <div className="container flex flex-wrap gap-3">
          {projectCategories.map((category) => (
            <span key={category} className="rounded-full border border-[#d9d0c4] bg-white/75 px-4 py-2 text-sm font-medium text-[#1d1f20]">{category}</span>
          ))}
        </div>
      </section>

      <section className="section-surface py-16 lg:py-20">
        <div className="container grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group block overflow-hidden rounded-[2rem] border border-[#d9d0c4] bg-white/80 shadow-[0_18px_35px_rgba(17,24,26,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,16,20,0.12)]">
              <div className="h-72 overflow-hidden">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-emerald)]">{project.category}</div>
                <h2 className="mb-3 text-2xl text-[#1d1f20]">{project.title}</h2>
                <p className="mb-4 text-base leading-7 text-[#4f5557]">{project.description}</p>
                <div className="flex items-center justify-between text-sm text-[#4f5557]">
                  <span>{project.location}</span>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-emerald)]">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
