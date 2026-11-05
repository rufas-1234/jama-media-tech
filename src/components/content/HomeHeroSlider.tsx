'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { heroImageSource } from '@/lib/content';
import type { HomeHeroSlide } from '@/lib/site-content';

export function HomeHeroSlider({ slides, location, serviceLabels }: { slides: HomeHeroSlide[]; location: string; serviceLabels: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const isPaused = hovered || focused || pausedByUser;

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(motionPreference.matches);
    updatePreference();
    motionPreference.addEventListener('change', updatePreference);
    return () => motionPreference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || isPaused || reducedMotion) return;
    const timeout = window.setTimeout(() => setActiveIndex((index) => (index + 1) % slides.length), 7000);
    return () => window.clearTimeout(timeout);
  }, [activeIndex, isPaused, reducedMotion, slides.length]);

  if (!activeSlide) return null;

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % slides.length);
  }

  return (
    <section
      className="home-hero-slider relative isolate overflow-hidden bg-[#17231d] py-12 text-white sm:py-16 lg:py-20"
      role="region"
      aria-roledescription="carousel"
      aria-label="Homepage highlights"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        const nextFocusedElement = event.relatedTarget;
        if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) setFocused(false);
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_50%,rgba(54,200,235,0.12),transparent_44%),linear-gradient(125deg,#101812_0%,#17231d_58%,#1d3528_100%)]" />
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div key={activeSlide.id} className="home-hero-content max-w-3xl">
            {activeSlide.eyebrow && <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d3edf1] backdrop-blur">{activeSlide.eyebrow}</p>}
            <h1 className="whitespace-pre-line text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-white">{activeSlide.headline}</h1>
            {activeSlide.introduction && <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{activeSlide.introduction}</p>}
            {(activeSlide.primaryCtaLabel && activeSlide.primaryCtaHref || activeSlide.secondaryCtaLabel && activeSlide.secondaryCtaHref) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {activeSlide.primaryCtaLabel && activeSlide.primaryCtaHref && <Link href={activeSlide.primaryCtaHref} className="btn btn-primary">{activeSlide.primaryCtaLabel}<ArrowRight className="h-5 w-5" /></Link>}
                {activeSlide.secondaryCtaLabel && activeSlide.secondaryCtaHref && <Link href={activeSlide.secondaryCtaHref} className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">{activeSlide.secondaryCtaLabel}<ArrowUpRight className="h-4 w-4" /></Link>}
              </div>
            )}
            <p className="mt-7 flex items-center gap-2 text-sm text-white/80"><MapPin className="h-4 w-4 shrink-0 text-[#b3e3ed]" />{location}</p>
            {!!serviceLabels.length && <div className="mt-8 flex flex-wrap gap-2">
              {serviceLabels.map((label) => <span key={label} className="rounded-full border border-white/25 bg-[#101812]/35 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">{label}</span>)}
            </div>}
          </div>

          <div className="home-hero-image-frame relative h-[17rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111b15] shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:h-[24rem] lg:h-[32rem]">
            {activeSlide.imageUrl && <Image
              key={activeSlide.id}
              src={heroImageSource(activeSlide.imageUrl)}
              alt={activeSlide.imageAlt}
              fill
              preload={activeIndex === 0}
              quality={90}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="home-hero-image object-contain p-2 sm:p-4"
            />}
            {!activeSlide.imageUrl && <div className="grid h-full place-items-center px-6 text-center text-sm text-white/55">Add a hero image in the admin dashboard.</div>}
            {slides.length > 1 && <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12">
              <span className="text-xs font-medium tabular-nums text-white/90">{String(activeIndex + 1).padStart(2, '0')} <span className="text-white/50">/</span> {String(slides.length).padStart(2, '0')}</span>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous slide" onClick={showPrevious} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" aria-label={pausedByUser ? 'Play automatic slideshow' : 'Pause automatic slideshow'} onClick={() => setPausedByUser((paused) => !paused)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur transition-colors hover:bg-white/20">{pausedByUser ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
                <button type="button" aria-label="Next slide" onClick={showNext} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>}
          </div>
        </div>

        {slides.length > 1 && <div className="mt-6 flex justify-center gap-2" role="group" aria-label="Choose a homepage slide">
          {slides.map((slide, index) => <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.headline}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[#b3e3ed]' : 'w-2.5 bg-white/45 hover:bg-white/75'}`}
          />)}
        </div>}
      </div>
    </section>
  );
}
