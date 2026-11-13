import { Mail, MapPin, Phone } from 'lucide-react';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero } from '@/components/content/EditablePage';
import { BusinessRequestForm } from '@/components/content/BusinessRequestForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { company, pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.contact} slug="contact" />
      <EditableSections sections={pages.contact.sections} />

      <section className="section-surface py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-[var(--color-navy)] p-8 text-white shadow-[0_18px_50px_rgba(11,16,20,0.18)]">
              <h2 className="mb-6 text-2xl text-white">Company information</h2>
              <div className="space-y-5 text-gray-200">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[var(--color-emerald)]" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-[var(--color-emerald)]" />
                  <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-[var(--color-emerald)]" />
                  <a href={`tel:${company.phone.replaceAll(' ', '')}`} className="hover:text-white">{company.phone}</a>
                </div>
              </div>
            </div>

          </div>

          <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/85 p-8 shadow-[0_18px_50px_rgba(17,24,26,0.06)]">
            <h2 className="mb-6 text-2xl text-[#1d1f20]">Send an enquiry</h2>
            <BusinessRequestForm type="enquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
