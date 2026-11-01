import { ArrowRight } from 'lucide-react';

export default function RequestQuotationPage() {
  return (
    <>
      <section className="page-hero py-20 lg:py-28">
        <div className="container">
          <p className="page-kicker">Request a quotation</p>
          <h1 className="page-title">Tell us what you need.</h1>
          <p className="page-intro max-w-2xl">
            Share a brief overview of your requirements and we will respond with a suitable scope, service recommendation and next steps.
          </p>
        </div>
      </section>

      <section className="section-surface py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/85 p-8 shadow-[0_18px_50px_rgba(17,24,26,0.06)]">
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

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="form-label">Country</span>
                  <input type="text" className="form-field" placeholder="Country" />
                </label>
                <label className="block">
                  <span className="form-label">Service category</span>
                  <select className="form-field">
                    <option>Food and NFIs</option>
                    <option>Plastic Recycling</option>
                    <option>ICT Consultancy</option>
                    <option>Internet Infrastructure</option>
                    <option>Web Development</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="form-label">Description of requirements</span>
                <textarea rows={5} className="form-field" placeholder="Describe the scope, quantity or project requirements" />
              </label>

              <label className="block">
                <span className="form-label">Estimated quantity or project scope</span>
                <input type="text" className="form-field" placeholder="Estimated quantity or project scope" />
              </label>

              <label className="block">
                <span className="form-label">Delivery location</span>
                <input type="text" className="form-field" placeholder="Delivery or project location" />
              </label>

              <label className="block">
                <span className="form-label">Supporting document upload</span>
                <input type="file" className="form-field" />
              </label>

              <label className="flex items-start gap-3 text-sm text-[#4f5557]">
                <input type="checkbox" className="mt-1" />
                <span>I consent to the processing of my information for quotation and enquiry purposes.</span>
              </label>

              <button type="submit" className="btn btn-primary inline-flex">
                Submit request <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
