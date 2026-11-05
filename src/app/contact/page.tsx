import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero } from '@/components/content/EditablePage';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { company, pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages.contact} />
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
            <form className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="form-label">Full name</span>
                  <input type="text" className="form-field" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="form-label">Organisation</span>
                  <input type="text" className="form-field" placeholder="Organisation" />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="form-label">Email</span>
                  <input type="email" className="form-field" placeholder="name@example.com" />
                </label>
                <label className="block">
                  <span className="form-label">Telephone</span>
                  <input type="tel" className="form-field" placeholder="Telephone number" />
                </label>
              </div>

              <label className="block">
                <span className="form-label">Subject</span>
                <input type="text" className="form-field" placeholder="Subject" />
              </label>

              <label className="block">
                <span className="form-label">Enquiry category</span>
                <select className="form-field">
                  <option>General enquiry</option>
                  <option>Supply and logistics</option>
                  <option>Plastic recycling</option>
                  <option>ICT consultancy</option>
                  <option>Internet infrastructure</option>
                  <option>Partnership</option>
                </select>
              </label>

              <label className="block">
                <span className="form-label">Message</span>
                <textarea rows={5} className="form-field" placeholder="Tell us about your requirements" />
              </label>

              <button type="submit" className="btn btn-primary inline-flex">
                Send enquiry <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
