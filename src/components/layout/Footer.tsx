import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { BrandLockup } from '@/components/layout/BrandLockup';

type FooterProps = {
  company: SiteContent['company'];
  services: { name: string; href: string }[];
  navigation: SiteContent['navigation'];
};

export function Footer({ company, services, navigation }: FooterProps) {
  return (
    <footer className="border-t border-[#dfe5df] bg-[#f0f3ef] text-[#1b211d]">
      <div className="container py-12">
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-8 md:gap-x-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <BrandLockup companyName={company.name} location={company.location} footer />
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#48534b]">
              {company.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a href="mailto:jamatech.ltd@gmail.com" aria-label="Email Jama Tech" className="rounded-full border border-[#d5ddd5] p-2 text-[#354239] transition-colors hover:text-[#28583e]"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#48534b]">
              {navigation.items.filter((item) => item.enabled).map((item) => <li key={item.id}><Link href={item.href} className="hover:text-[#28583e] transition-colors">{item.label}</Link></li>)}
              <li><Link href="/admin/login" className="hover:text-[#28583e] transition-colors">Editorial Login</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Services</h3>
            <ul className="space-y-2 text-sm text-[#48534b]">
              {services.map((service) => <li key={service.href}><Link href={service.href} className="hover:text-[#28583e] transition-colors">{service.name}</Link></li>)}
              <li><Link href="/services" className="hover:text-[#28583e] transition-colors">All Services</Link></li>
            </ul>
          </div>

          <div className="col-span-2 min-w-0 md:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Contact</h3>
            <ul className="space-y-3 text-sm text-[#48534b]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <span className="min-w-0 break-words">{company.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <a href={`mailto:${company.email}`} className="min-w-0 break-all transition-colors hover:text-[#9ac8a7]">{company.email}</a>
              </li>
              {company.phone && <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <a href={`tel:${company.phone.replaceAll(' ', '')}`} className="min-w-0 break-words transition-colors hover:text-[#28583e]">{company.phone}</a>
              </li>}
            </ul>
            <Link href={navigation.ctaHref} className="btn btn-primary mt-6 inline-flex max-w-full">{navigation.ctaLabel}</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-[#56615a]">© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#56615a] md:justify-end">
            <Link href="/privacy-policy" className="hover:text-[#28583e] transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-[#28583e] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
