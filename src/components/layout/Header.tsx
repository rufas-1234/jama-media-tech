'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLockup } from '@/components/layout/BrandLockup';
import type { SiteNavigation } from '@/lib/site-content';

type HeaderProps = {
  companyName: string;
  location: string;
  navigation: SiteNavigation;
};

export function Header({ companyName, location, navigation }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const navClass = (href: string) => `whitespace-nowrap rounded-full px-3 py-2 transition-colors ${isActive(href) ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#39423c] hover:bg-[#f1f4f0] hover:text-[#28583e]'}`;
  const links = navigation.items.filter((item) => item.enabled);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[#dfe5df] bg-[#fbfcfa]/92 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="container flex min-h-[4.75rem] items-center justify-between gap-5 py-2">
        <Link href="/" aria-label={`${companyName}, ${location}`} className="min-w-0 shrink-0"><BrandLockup companyName={companyName} location={location} /></Link>
        <div className="hidden items-center gap-1 text-[13px] xl:flex">
          {links.map((item) => <Link key={item.id} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={navClass(item.href)}>{item.label}</Link>)}
        </div>
        <div className="hidden items-center xl:flex"><Link href={navigation.ctaHref} className="btn btn-primary whitespace-nowrap px-5 py-3 text-sm">{navigation.ctaLabel}</Link></div>
        <button className="rounded-full border border-[#dfe5df] p-2 text-[#1b211d] xl:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {mobileOpen && <div className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-[#dfe5df] bg-[#fbfcfa] xl:hidden">
        <div className="container flex flex-col gap-2 py-4">
          {links.map((item) => <Link key={item.id} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={navClass(item.href)} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
          <Link href={navigation.ctaHref} className="btn btn-primary mt-2 w-fit" onClick={() => setMobileOpen(false)}>{navigation.ctaLabel}</Link>
        </div>
      </div>}
    </header>
  );
}
