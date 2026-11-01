import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';

type FooterProps = {
  company: SiteContent['company'];
  services: { name: string; href: string }[];
};

export function Footer({ company, services }: FooterProps) {
  return (
    <footer className="border-t border-[#dfe5df] bg-[#f0f3ef] text-[#1b211d]">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white">
                <Image
                  src="/images/jama-tech-logo.jpeg"
                  alt=""
                  width={104}
                  height={74}
                  className="absolute left-1/2 top-[-8px] max-w-none -translate-x-1/2"
                />
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#172019]">{company.name}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#56615a]">{company.location}</span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#48534b]">
              {company.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a href="mailto:jamatech.ltd@gmail.com" aria-label="Email Jama Tech" className="rounded-full border border-[#d5ddd5] p-2 text-[#354239] transition-colors hover:text-[#28583e]"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#48534b]">
              <li><Link href="/about" className="hover:text-[#28583e] transition-colors">About Us</Link></li>
              <li><Link href="/leadership" className="hover:text-[#28583e] transition-colors">Leadership &amp; Governance</Link></li>
              <li><Link href="/projects" className="hover:text-[#28583e] transition-colors">Projects &amp; Impact</Link></li>
              <li><Link href="/news" className="hover:text-[#28583e] transition-colors">News &amp; Insights</Link></li>
              <li><Link href="/contact" className="hover:text-[#28583e] transition-colors">Contact Us</Link></li>
              <li><Link href="/admin/login" className="hover:text-[#28583e] transition-colors">Editorial Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Services</h3>
            <ul className="space-y-2 text-sm text-[#48534b]">
              {services.map((service) => <li key={service.href}><Link href={service.href} className="hover:text-[#28583e] transition-colors">{service.name}</Link></li>)}
              <li><Link href="/services" className="hover:text-[#28583e] transition-colors">All Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#172019]">Contact</h3>
            <ul className="space-y-3 text-sm text-[#48534b]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <span>{company.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-[#9ac8a7]">{company.email}</a>
              </li>
              {company.phone && <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#28583e]" />
                <a href={`tel:${company.phone.replaceAll(' ', '')}`} className="transition-colors hover:text-[#28583e]">{company.phone}</a>
              </li>}
            </ul>
            <Link href="/request-quotation" className="btn btn-primary mt-6 inline-flex">Request a Quotation</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-[#56615a]">© 2026 Jama Tech LTD. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-[#56615a]">
            <Link href="/privacy-policy" className="hover:text-[#28583e] transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-[#28583e] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
