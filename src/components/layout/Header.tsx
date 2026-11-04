'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BrandLockup } from '@/components/layout/BrandLockup';

type HeaderProps = {
  companyName: string;
  location: string;
  services: { name: string; href: string }[];
};

export function Header({ companyName, location, services }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const navLinkClass = (href: string) => `whitespace-nowrap rounded-full px-3 py-2 transition-colors ${isActive(href) ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#39423c] hover:bg-[#f1f4f0] hover:text-[#28583e]'}`;

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[#dfe5df] bg-[#fbfcfa]/92 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="container flex h-[4.75rem] items-center justify-between gap-5">
        <Link href="/" aria-label={`${companyName}, ${location}`} className="min-w-0 shrink-0">
          <BrandLockup companyName={companyName} location={location} />
        </Link>

        <div className="liquid-nav hidden items-center gap-1 text-[13px] backdrop-blur-2xl backdrop-saturate-150 xl:flex">
          <Link href="/" aria-current={isActive('/') ? 'page' : undefined} className={navLinkClass('/')}>Home</Link>
          <Link href="/about" aria-current={isActive('/about') ? 'page' : undefined} className={navLinkClass('/about')}>About</Link>
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setServicesOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setServicesOpen(false);
            }}
          >
            <button
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition-colors ${isActive('/services') ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#39423c] hover:bg-[#f1f4f0] hover:text-[#28583e]'}`}
              aria-expanded={servicesOpen}
              aria-controls="desktop-services-menu"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Services <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div id="desktop-services-menu" className={`${servicesOpen ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-1 opacity-0'} absolute left-0 top-full z-50 mt-3 w-80 rounded-2xl border border-[#dfe5df] bg-white p-2 shadow-xl transition-all`}>
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`block rounded-xl px-4 py-3 text-sm transition-colors hover:bg-[#f1f4f0] hover:text-[#28583e] ${isActive(service.href) ? 'bg-[#f1f4f0] text-[#28583e]' : 'text-[#26312a]'}`}
                  onClick={() => setServicesOpen(false)}
                >
                  {service.name}
                </Link>
              ))}
              <Link href="/services" className="mt-2 block rounded-xl px-4 py-3 text-sm font-medium text-[#28583e] transition-colors hover:bg-[#f1f4f0]" onClick={() => setServicesOpen(false)}>
                View All Services
              </Link>
            </div>
          </div>
          <Link href="/sustainability" aria-current={isActive('/sustainability') ? 'page' : undefined} className={navLinkClass('/sustainability')}>Sustainability</Link>
          <Link href="/projects" aria-current={isActive('/projects') ? 'page' : undefined} className={navLinkClass('/projects')}>Projects</Link>
          <Link href="/news" aria-current={isActive('/news') ? 'page' : undefined} className={navLinkClass('/news')}>Insights</Link>
          <Link href="/contact" aria-current={isActive('/contact') ? 'page' : undefined} className={navLinkClass('/contact')}>Contact</Link>
        </div>

        <div className="hidden items-center xl:flex">
          <Link href="/request-quotation" className="btn btn-primary whitespace-nowrap px-5 py-3 text-sm">Request a Quote</Link>
        </div>

        <button className="rounded-full border border-[#dfe5df] p-2 text-[#1b211d] xl:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-[#dfe5df] bg-[#fbfcfa] xl:hidden">
          <div className="container flex flex-col gap-4 py-4 text-[#26312a]">
            <Link href="/" aria-current={isActive('/') ? 'page' : undefined} className={navLinkClass('/')} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/about" aria-current={isActive('/about') ? 'page' : undefined} className={navLinkClass('/about')} onClick={() => setMobileOpen(false)}>About</Link>
            <div>
              <Link href="/services" aria-current={isActive('/services') ? 'page' : undefined} className={`mb-2 inline-flex rounded-full px-3 py-2 font-medium ${isActive('/services') ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#28583e]'}`} onClick={() => setMobileOpen(false)}>Services</Link>
              <div className="flex flex-col gap-2 pl-3 text-sm text-[#56615a]">
                {services.map((service) => (
                  <Link key={service.href} href={service.href} aria-current={isActive(service.href) ? 'page' : undefined} className={isActive(service.href) ? 'text-[#28583e]' : undefined} onClick={() => setMobileOpen(false)}>
                    {service.name}
                  </Link>
                ))}
                <Link href="/services" onClick={() => setMobileOpen(false)} className="text-[#28583e]">View All Services</Link>
              </div>
            </div>
            <Link href="/sustainability" aria-current={isActive('/sustainability') ? 'page' : undefined} className={navLinkClass('/sustainability')} onClick={() => setMobileOpen(false)}>Sustainability</Link>
            <Link href="/projects" aria-current={isActive('/projects') ? 'page' : undefined} className={navLinkClass('/projects')} onClick={() => setMobileOpen(false)}>Projects &amp; Impact</Link>
            <Link href="/news" aria-current={isActive('/news') ? 'page' : undefined} className={navLinkClass('/news')} onClick={() => setMobileOpen(false)}>News &amp; Insights</Link>
            <Link href="/contact" aria-current={isActive('/contact') ? 'page' : undefined} className={navLinkClass('/contact')} onClick={() => setMobileOpen(false)}>Contact Us</Link>
            <Link href="/request-quotation" className="btn btn-primary w-fit" onClick={() => setMobileOpen(false)}>Request a Quote</Link>
          </div>
        </div>
      )}
    </header>
  );
}
