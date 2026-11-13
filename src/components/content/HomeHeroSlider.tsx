'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { heroImageSource } from '@/lib/content';
import type { HomeHeroSlide } from '@/lib/site-content';

export function HomeHeroSlider({ slides, location, services }: { slides: HomeHeroSlide[]; location: string; services: { slug: string; short: string }[] }) {
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
      className="home-hero-slider relative isolate flex min-h-[min(88svh,780px)] flex-col justify-end overflow-hidden bg-[#17231d] text-white"
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
      {activeSlide.imageUrl && <img
        key={activeSlide.id}
        src={heroImageSource(activeSlide.imageUrl)}
        alt={activeSlide.imageAlt}
        fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
        className="home-hero-image absolute inset-0 -z-20 h-full w-full object-cover"
      />}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,24,18,0.94)_0%,rgba(16,24,18,0.8)_46%,rgba(16,24,18,0.32)_100%),linear-gradient(0deg,rgba(16,24,18,0.68)_0%,transparent_45%),radial-gradient(ellipse_at_78%_22%,rgba(40,88,62,0.18),transparent_46%)]" />
      <div className="container relative z-10 flex min-h-[min(88svh,780px)] flex-col justify-end py-10 sm:py-14 lg:justify-center lg:py-16">
        <div key={activeSlide.id} className="home-hero-content max-w-5xl" aria-live="polite">
          {activeSlide.eyebrow && <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d3edf1] backdrop-blur">{activeSlide.eyebrow}</p>}
          <h1 className="max-w-5xl whitespace-pre-line text-[clamp(2.75rem,6.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-white">{activeSlide.headline}</h1>
          {activeSlide.introduction && <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{activeSlide.introduction}</p>}
          {(activeSlide.primaryCtaLabel && activeSlide.primaryCtaHref || activeSlide.secondaryCtaLabel && activeSlide.secondaryCtaHref) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {activeSlide.primaryCtaLabel && activeSlide.primaryCtaHref && <Link href={activeSlide.primaryCtaHref} className="btn btn-primary">{activeSlide.primaryCtaLabel}<ArrowRight className="h-5 w-5" /></Link>}
              {activeSlide.secondaryCtaLabel && activeSlide.secondaryCtaHref && <Link href={activeSlide.secondaryCtaHref} className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">{activeSlide.secondaryCtaLabel}<ArrowUpRight className="h-4 w-4" /></Link>}
            </div>
          )}
          <p className="mt-7 flex items-center gap-2 text-sm text-white/80"><MapPin className="h-4 w-4 shrink-0 text-[#b3e3ed]" />{location}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5">
          {!!services.length && <div className="min-w-0 flex-1">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">What we do</p>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-full border border-white/25 bg-black/15 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur transition-colors hover:border-white/55 hover:bg-white/15">{service.short}<ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>)}
            </div>
          </div>}
          {slides.length > 1 && <div className="flex items-center gap-3" role="group" aria-label="Homepage slide controls">
            <span className="text-xs font-medium tabular-nums text-white/75">{String(activeIndex + 1).padStart(2, '0')} <span className="text-white/45">/</span> {String(slides.length).padStart(2, '0')}</span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous slide" onClick={showPrevious} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label={pausedByUser ? 'Play automatic slideshow' : 'Pause automatic slideshow'} onClick={() => setPausedByUser((paused) => !paused)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur transition-colors hover:bg-white/20">{pausedByUser ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
              <button type="button" aria-label="Next slide" onClick={showNext} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur transition-colors hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>}
        </div>
        {slides.length > 1 && <div className="mt-5 flex gap-2" role="group" aria-label="Choose a homepage slide">
          {slides.map((slide, index) => <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.headline}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-10 bg-[#b3e3ed]' : 'w-5 bg-white/35 hover:bg-white/70'}`}
          />)}
        </div>}
      </div>
    </section>
  );
}
