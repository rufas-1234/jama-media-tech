import { getSiteContent } from '@/lib/site-content';
import { EditableSections, PageHero } from '@/components/content/EditablePage';
import { BusinessRequestForm } from '@/components/content/BusinessRequestForm';

export const dynamic = 'force-dynamic';

export default async function RequestQuotationPage() {
  const { pages } = await getSiteContent();
  return (
    <>
      <PageHero page={pages['request-quotation']} slug="request-quotation" />
      <EditableSections sections={pages['request-quotation'].sections} />

      <section className="section-surface py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="rounded-[2rem] border border-[#d9d0c4] bg-white/85 p-8 shadow-[0_18px_50px_rgba(17,24,26,0.06)]">
            <BusinessRequestForm type="quotation" />
          </div>
        </div>
      </section>
    </>
  );
}
