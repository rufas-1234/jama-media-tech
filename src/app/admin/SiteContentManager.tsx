'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { projectCategories } from '@/lib/content';
import type { EditablePage, HomeSection, Service, SiteContent, SiteNavigationItem, TeamMember } from '@/lib/site-content';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export type EditorArea = 'home' | 'pages' | 'services' | 'team' | 'company' | 'navigation';

const emptyService = (index: number): Service => ({
  slug: '', number: String(index + 1).padStart(2, '0'), short: '', title: '', description: '', introduction: '',
  image: 'photo-1522202176988-66273c2fd55f', alt: '', capabilities: [], audience: '',
});

const emptyTeamMember = (): TeamMember => ({ id: crypto.randomUUID(), name: '', role: '', biography: '', imageUrl: '', linkedin: '', facebook: '', instagram: '', x: '' });
const emptyHomeSection = (): HomeSection => ({ id: crypto.randomUUID(), eyebrow: '', title: '', body: '', imageUrl: '', enabled: true, items: [] });

function Field({ label, value, onChange, multiline = false, hint, onBlur }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; hint?: string; onBlur?: () => void }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      {multiline ? <textarea rows={4} className="form-field" value={value} onChange={(event) => onChange(event.target.value)} /> : <input className="form-field" value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} />}
      {hint && <span className="mt-1 block text-xs text-[#56615a]">{hint}</span>}
    </label>
  );
}

function SectionListEditor({ sections, onChange }: { sections: HomeSection[]; onChange: (sections: HomeSection[]) => void }) {
  function updateSection(id: string, patch: Partial<HomeSection>) {
    onChange(sections.map((section) => section.id === id ? { ...section, ...patch } : section));
  }

  function updateCard(section: HomeSection, cardIndex: number, patch: Partial<NonNullable<HomeSection['items']>[number]>) {
    updateSection(section.id, { items: (section.items ?? []).map((card, index) => index === cardIndex ? { ...card, ...patch } : card) });
  }

  return (
    <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl text-[#172019]">Page sections</h2><p className="mt-1 text-sm text-[#56615a]">Build sections from headings, text, images, optional links and image cards.</p></div>
        <button type="button" className="btn btn-secondary" disabled={sections.length >= 24} onClick={() => onChange([...sections, emptyHomeSection()])}><FilePlus2 className="h-4 w-4" /> Add section</button>
      </div>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-xl border border-[#e7ebe7] bg-[#f9faf8] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[#172019]">Section {index + 1}</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-[#48534b]"><input type="checkbox" checked={section.enabled} onChange={(event) => updateSection(section.id, { enabled: event.target.checked })} />Visible</label>
                <button type="button" aria-label={`Remove section ${index + 1}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => onChange(sections.filter((item) => item.id !== section.id))}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Section label" value={section.eyebrow} onChange={(value) => updateSection(section.id, { eyebrow: value })} />
              <Field label="Section heading" value={section.title} onChange={(value) => updateSection(section.id, { title: value })} />
              <div className="md:col-span-2"><Field label="Section text" value={section.body} onChange={(value) => updateSection(section.id, { body: value })} multiline /></div>
              <div className="md:col-span-2"><ImageUploadField label="Section image (optional)" value={section.imageUrl} onChange={(value) => updateSection(section.id, { imageUrl: value })} /></div>
              <Field label="Button label (optional)" value={section.buttonText ?? ''} onChange={(value) => updateSection(section.id, { buttonText: value })} />
              <Field label="Button link (optional)" value={section.buttonHref ?? ''} onChange={(value) => updateSection(section.id, { buttonHref: value })} />
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-[#354239]">Image cards</h4>
                <button type="button" className="btn btn-secondary" disabled={(section.items?.length ?? 0) >= 12} onClick={() => updateSection(section.id, { items: [...(section.items ?? []), { title: '', body: '', imageUrl: '' }] })}><FilePlus2 className="h-4 w-4" /> Add card</button>
              </div>
              {(section.items ?? []).map((item, itemIndex) => (
                <div key={`${section.id}-${itemIndex}`} className="rounded-lg border border-[#e7ebe7] bg-white p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h5 className="text-sm font-medium text-[#354239]">Card {itemIndex + 1}</h5>
                    <button type="button" aria-label={`Remove card ${itemIndex + 1} from section ${index + 1}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => updateSection(section.id, { items: (section.items ?? []).filter((_, cardIndex) => cardIndex !== itemIndex) })}><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Card heading" value={item.title} onChange={(value) => updateCard(section, itemIndex, { title: value })} />
                    <Field label="Card text" value={item.body} onChange={(value) => updateCard(section, itemIndex, { body: value })} multiline />
                    <div className="md:col-span-2"><ImageUploadField label="Card image (optional)" value={item.imageUrl ?? ''} onChange={(value) => updateCard(section, itemIndex, { imageUrl: value })} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {sections.length === 0 && <p className="rounded-xl bg-[#f7f8f5] px-4 py-6 text-sm text-[#56615a]">No sections yet. Add a section to build this page.</p>}
      </div>
    </section>
  );
}

export function SiteContentManager({ area }: { area: EditorArea }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [storage, setStorage] = useState<'local' | 'tidb' | null>(null);
  const [selectedPage, setSelectedPage] = useState('about');
  const [pageSlugDraft, setPageSlugDraft] = useState('about');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadContent() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/site-content', { cache: 'no-store' });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Site content could not be loaded.');
      setContent(result.content);
      setStorage(result.storage);
      setServiceIndex(0);
      setTeamId(result.content.teamMembers[0]?.id ?? null);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Site content could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadContent(); }, []);
  useEffect(() => { setPageSlugDraft(selectedPage); }, [selectedPage]);

  function updateCompany(key: keyof SiteContent['company'], value: string) {
    setContent((current) => current ? { ...current, company: { ...current.company, [key]: value } } : current);
  }

  function updateHomepage(key: keyof SiteContent['homepage'], value: string) {
    setContent((current) => current ? { ...current, homepage: { ...current.homepage, [key]: value } } : current);
  }

  function updatePage(slug: string, patch: Partial<EditablePage>) {
    setContent((current) => current?.pages[slug] ? { ...current, pages: { ...current.pages, [slug]: { ...current.pages[slug], ...patch } } } : current);
  }

  function addPage() {
    if (!content) return;
    const slug = `new-page-${Object.keys(content.pages).length}`;
    setContent({ ...content, pages: { ...content.pages, [slug]: { label: 'New page', eyebrow: '', title: 'New page', introduction: '', imageUrl: '', sections: [] } } });
    setSelectedPage(slug);
  }

  function updateNavigationItem(id: string, patch: Partial<SiteNavigationItem>) {
    setContent((current) => current ? { ...current, navigation: { ...current.navigation, items: current.navigation.items.map((item) => item.id === id ? { ...item, ...patch } : item) } } : current);
  }

  function updateHomepageSections(sections: HomeSection[]) {
    setContent((current) => current ? { ...current, homepage: { ...current.homepage, sections } } : current);
  }

  function updatePageSections(slug: string, sections: HomeSection[]) {
    updatePage(slug, { sections });
  }

  function updateService(index: number, patch: Partial<Service>) {
    setContent((current) => current ? { ...current, services: current.services.map((service, itemIndex) => itemIndex === index ? { ...service, ...patch } : service) } : current);
  }

  function addService() {
    if (!content) return;
    const services = [...content.services, emptyService(content.services.length)];
    setContent({ ...content, services });
    setServiceIndex(services.length - 1);
  }

  function updateTeamMember(id: string, patch: Partial<TeamMember>) {
    setContent((current) => current ? { ...current, teamMembers: current.teamMembers.map((member) => member.id === id ? { ...member, ...patch } : member) } : current);
  }

  function addTeamMember() {
    const member = emptyTeamMember();
    setContent((current) => current ? { ...current, teamMembers: [...current.teamMembers, member] } : current);
    setTeamId(member.id);
  }

  async function saveContent() {
    if (!content) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Site content could not be saved.');
      setContent(result.content);
      setNotice('Site content saved.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Site content could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="py-10 text-sm text-[#56615a]">Loading site content…</p>;
  if (!content) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error || 'Site content is unavailable.'}</p>;

  const selectedService = content.services[serviceIndex];
  const selectedTeamMember = content.teamMembers.find((member) => member.id === teamId);
  const pageSlugs = Object.keys(content.pages);
  const activePageSlug = content.pages[selectedPage] ? selectedPage : pageSlugs[0];
  const activePage = content.pages[activePageSlug];

  return (
    <div>
      {storage && <p className="mb-5 rounded-xl border border-[#dfe5df] bg-white/80 px-4 py-3 text-sm text-[#48534b]">
        {storage === 'tidb' ? 'Connected to TiDB Cloud.' : 'Local preview storage. Configure TiDB Cloud before deploying these edits.'}
      </p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="mb-6 flex justify-end">
        <button type="button" disabled={saving} className="btn btn-primary" onClick={() => void saveContent()}>
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving' : 'Save site content'}
        </button>
      </div>

      {(area === 'company' || area === 'home') && <div className="space-y-8">
        {area === 'company' && <>
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <h2 className="mb-5 text-xl text-[#172019]">Company information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company name" value={content.company.name} onChange={(value) => updateCompany('name', value)} />
            <Field label="Location" value={content.company.location} onChange={(value) => updateCompany('location', value)} />
            <Field label="Email" value={content.company.email} onChange={(value) => updateCompany('email', value)} />
            <Field label="Phone" value={content.company.phone} onChange={(value) => updateCompany('phone', value)} />
            <div className="md:col-span-2"><Field label="Company description" value={content.company.description} onChange={(value) => updateCompany('description', value)} multiline /></div>
          </div>
        </section>
        </>}

        {area === 'home' && <>
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <h2 className="mb-5 text-xl text-[#172019]">Homepage hero</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Hero eyebrow" value={content.homepage.eyebrow} onChange={(value) => updateHomepage('eyebrow', value)} />
            <Field label="Headline" value={content.homepage.headline} onChange={(value) => updateHomepage('headline', value)} multiline />
            <Field label="Introduction" value={content.homepage.introduction} onChange={(value) => updateHomepage('introduction', value)} multiline />
            <Field label="Primary button label" value={content.homepage.primaryCtaLabel} onChange={(value) => updateHomepage('primaryCtaLabel', value)} />
            <Field label="Primary button link" value={content.homepage.primaryCtaHref} onChange={(value) => updateHomepage('primaryCtaHref', value)} />
            <Field label="Secondary button label" value={content.homepage.secondaryCtaLabel} onChange={(value) => updateHomepage('secondaryCtaLabel', value)} />
            <Field label="Secondary button link" value={content.homepage.secondaryCtaHref} onChange={(value) => updateHomepage('secondaryCtaHref', value)} />
            <ImageUploadField label="Hero image" value={content.homepage.heroImage} onChange={(value) => updateHomepage('heroImage', value)} />
          </div>
        </section>

        <SectionListEditor sections={content.homepage.sections} onChange={updateHomepageSections} />
        </>}
      </div>}

      {area === 'pages' && activePage && <div className="grid items-start gap-6 xl:grid-cols-[minmax(200px,0.65fr)_minmax(0,1.35fr)]">
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg text-[#172019]">Pages</h2><button type="button" className="rounded-lg p-2 text-[#28583e] hover:bg-[#f1f4f0]" onClick={addPage} aria-label="Add page"><FilePlus2 className="h-4 w-4" /></button></div>
          <ul className="space-y-1">{pageSlugs.map((slug) => <li key={slug}><button type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm ${slug === activePageSlug ? 'bg-[#edf2ed] font-semibold text-[#28583e]' : 'text-[#354239] hover:bg-[#f7f8f5]'}`} onClick={() => setSelectedPage(slug)}>{content.pages[slug].label} <span className="text-xs text-[#788179]">/{slug}</span></button></li>)}</ul>
        </section>
        <section className="space-y-5 rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Page name" value={activePage.label} onChange={(value) => updatePage(activePageSlug, { label: value })} />
            <Field label="Page URL slug" value={pageSlugDraft} onChange={setPageSlugDraft} onBlur={() => {
              const slug = pageSlugDraft.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
              if (!slug || slug === activePageSlug || content.pages[slug]) {
                setPageSlugDraft(activePageSlug);
                return;
              }
              const pages = { ...content.pages, [slug]: content.pages[activePageSlug] };
              delete pages[activePageSlug];
              const oldPath = `/${activePageSlug}`;
              const newPath = `/${slug}`;
              setContent({
                ...content,
                homepage: {
                  ...content.homepage,
                  primaryCtaHref: content.homepage.primaryCtaHref === oldPath ? newPath : content.homepage.primaryCtaHref,
                  secondaryCtaHref: content.homepage.secondaryCtaHref === oldPath ? newPath : content.homepage.secondaryCtaHref,
                  sections: content.homepage.sections.map((section) => section.buttonHref === oldPath ? { ...section, buttonHref: newPath } : section),
                },
                pages: Object.fromEntries(Object.entries(pages).map(([pageSlug, page]) => [pageSlug, {
                  ...page,
                  sections: page.sections.map((section) => section.buttonHref === oldPath ? { ...section, buttonHref: newPath } : section),
                }])),
                navigation: {
                  ...content.navigation,
                  ctaHref: content.navigation.ctaHref === oldPath ? newPath : content.navigation.ctaHref,
                  items: content.navigation.items.map((item) => item.href === oldPath ? { ...item, href: newPath } : item),
                },
              });
              setSelectedPage(slug);
            }} hint="Changing the URL slug also changes this page's site path." />
            <Field label="Eyebrow" value={activePage.eyebrow} onChange={(value) => updatePage(activePageSlug, { eyebrow: value })} />
            <Field label="Heading" value={activePage.title} onChange={(value) => updatePage(activePageSlug, { title: value })} />
            <div className="md:col-span-2"><Field label="Introduction" value={activePage.introduction} onChange={(value) => updatePage(activePageSlug, { introduction: value })} multiline /></div>
            <div className="md:col-span-2"><ImageUploadField label="Hero image" value={activePage.imageUrl} onChange={(value) => updatePage(activePageSlug, { imageUrl: value })} /></div>
          </div>
          <SectionListEditor sections={activePage.sections} onChange={(sections) => updatePageSections(activePageSlug, sections)} />
          {activePageSlug.startsWith('new-page-') && <p className="text-sm text-[#56615a]">Save this page, then add a navigation link using its URL path. Standard pages retain their existing interactive forms and content.</p>}
        </section>
      </div>}

      {area === 'navigation' && <section className="space-y-5 rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
        <div><h2 className="text-xl text-[#172019]">Site navigation</h2><p className="mt-1 text-sm text-[#56615a]">Control the links shown in the public header and the primary call-to-action.</p></div>
        <div className="space-y-3">{content.navigation.items.map((item, index) => <div key={item.id} className="grid items-end gap-3 rounded-xl border border-[#e7ebe7] bg-[#f9faf8] p-4 md:grid-cols-[1fr_1.2fr_auto_auto]">
          <Field label={`Link ${index + 1} label`} value={item.label} onChange={(value) => updateNavigationItem(item.id, { label: value })} />
          <Field label="URL" value={item.href} onChange={(value) => updateNavigationItem(item.id, { href: value })} />
          <label className="flex items-center gap-2 pb-3 text-sm text-[#48534b]"><input type="checkbox" checked={item.enabled} onChange={(event) => updateNavigationItem(item.id, { enabled: event.target.checked })} />Visible</label>
          <button type="button" className="mb-2 rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label={`Remove navigation link ${index + 1}`} onClick={() => setContent({ ...content, navigation: { ...content.navigation, items: content.navigation.items.filter((link) => link.id !== item.id) } })}><Trash2 className="h-4 w-4" /></button>
        </div>)}</div>
        <button type="button" className="btn btn-secondary" disabled={content.navigation.items.length >= 20} onClick={() => setContent({ ...content, navigation: { ...content.navigation, items: [...content.navigation.items, { id: crypto.randomUUID(), label: '', href: '/', enabled: true }] } })}><FilePlus2 className="h-4 w-4" /> Add navigation link</button>
        <div className="grid gap-4 border-t border-[#e7ebe7] pt-5 md:grid-cols-2"><Field label="Header button label" value={content.navigation.ctaLabel} onChange={(value) => setContent({ ...content, navigation: { ...content.navigation, ctaLabel: value } })} /><Field label="Header button URL" value={content.navigation.ctaHref} onChange={(value) => setContent({ ...content, navigation: { ...content.navigation, ctaHref: value } })} /></div>
      </section>}

      {area === 'services' && <div className="grid items-start gap-6 xl:grid-cols-[minmax(220px,0.65fr)_minmax(0,1.35fr)]">
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg text-[#172019]">Services</h2><button type="button" aria-label="Add service" title="Add service" className="rounded-lg p-2 text-[#28583e] hover:bg-[#f1f4f0]" onClick={addService}><FilePlus2 className="h-4 w-4" /></button></div>
          <ul className="space-y-1">
            {content.services.map((service, index) => <li key={`${service.slug}-${index}`}><button type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm ${index === serviceIndex ? 'bg-[#edf2ed] font-semibold text-[#28583e]' : 'text-[#354239] hover:bg-[#f7f8f5]'}`} onClick={() => setServiceIndex(index)}>{service.title || 'New service'}</button></li>)}
          </ul>
        </section>
        {selectedService && <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase text-[#28583e]">Service details</p><h2 className="mt-1 text-xl text-[#172019]">{selectedService.title || 'New service'}</h2></div><button type="button" aria-label="Delete service" disabled={content.services.length <= 1} className="rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => { const services = content.services.filter((_, index) => index !== serviceIndex); setContent({ ...content, services }); setServiceIndex(Math.max(0, serviceIndex - 1)); }}><Trash2 className="h-4 w-4" /></button></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" value={selectedService.title} onChange={(value) => updateService(serviceIndex, { title: value })} />
            <Field label="URL slug" value={selectedService.slug} onChange={(value) => updateService(serviceIndex, { slug: value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })} />
            <Field label="Navigation label" value={selectedService.short} onChange={(value) => updateService(serviceIndex, { short: value })} />
            <Field label="Service number" value={selectedService.number} onChange={(value) => updateService(serviceIndex, { number: value })} />
            <div className="md:col-span-2"><Field label="Card description" value={selectedService.description} onChange={(value) => updateService(serviceIndex, { description: value })} multiline /></div>
            <div className="md:col-span-2"><Field label="Full introduction" value={selectedService.introduction} onChange={(value) => updateService(serviceIndex, { introduction: value })} multiline /></div>
            <ImageUploadField label="Service image" value={selectedService.image} onChange={(value) => updateService(serviceIndex, { image: value })} hint="Upload a file, paste a URL, or use an Unsplash photo ID." />
            <Field label="Image description" value={selectedService.alt} onChange={(value) => updateService(serviceIndex, { alt: value })} />
            <div className="md:col-span-2"><Field label="Capabilities (one per line)" value={selectedService.capabilities.join('\n')} onChange={(value) => updateService(serviceIndex, { capabilities: value.split('\n').map((item) => item.trim()).filter(Boolean) })} multiline /></div>
            <div className="md:col-span-2"><Field label="Target audience" value={selectedService.audience} onChange={(value) => updateService(serviceIndex, { audience: value })} multiline /></div>
          </div>
        </section>}
      </div>}

      {area === 'team' && <div className="grid items-start gap-6 xl:grid-cols-[minmax(220px,0.65fr)_minmax(0,1.35fr)]">
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg text-[#172019]">Team members</h2><button type="button" aria-label="Add team member" title="Add team member" className="rounded-lg p-2 text-[#28583e] hover:bg-[#f1f4f0]" onClick={addTeamMember}><FilePlus2 className="h-4 w-4" /></button></div>
          {content.teamMembers.length ? <ul className="space-y-1">{content.teamMembers.map((member) => <li key={member.id}><button type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm ${teamId === member.id ? 'bg-[#edf2ed] font-semibold text-[#28583e]' : 'text-[#354239] hover:bg-[#f7f8f5]'}`} onClick={() => setTeamId(member.id)}>{member.name || 'New team member'}</button></li>)}</ul> : <p className="px-3 py-4 text-sm text-[#56615a]">No profiles yet.</p>}
        </section>
        {selectedTeamMember && <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase text-[#28583e]">About page profile</p><h2 className="mt-1 text-xl text-[#172019]">{selectedTeamMember.name || 'New team member'}</h2></div><button type="button" aria-label="Delete team member" className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => { const teamMembers = content.teamMembers.filter((member) => member.id !== selectedTeamMember.id); setContent({ ...content, teamMembers }); setTeamId(teamMembers[0]?.id ?? null); }}><Trash2 className="h-4 w-4" /></button></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={selectedTeamMember.name} onChange={(value) => updateTeamMember(selectedTeamMember.id, { name: value })} />
            <Field label="Role" value={selectedTeamMember.role} onChange={(value) => updateTeamMember(selectedTeamMember.id, { role: value })} />
            <div className="md:col-span-2"><Field label="Biography" value={selectedTeamMember.biography} onChange={(value) => updateTeamMember(selectedTeamMember.id, { biography: value })} multiline /></div>
            <div className="md:col-span-2"><ImageUploadField label="Team photo (optional)" value={selectedTeamMember.imageUrl} onChange={(value) => updateTeamMember(selectedTeamMember.id, { imageUrl: value })} /></div>
            <Field label="LinkedIn profile URL" value={selectedTeamMember.linkedin ?? ''} onChange={(value) => updateTeamMember(selectedTeamMember.id, { linkedin: value })} hint="Optional. Use the full HTTPS profile URL." />
            <Field label="Facebook profile URL" value={selectedTeamMember.facebook ?? ''} onChange={(value) => updateTeamMember(selectedTeamMember.id, { facebook: value })} hint="Optional. Use the full HTTPS profile URL." />
            <Field label="Instagram profile URL" value={selectedTeamMember.instagram ?? ''} onChange={(value) => updateTeamMember(selectedTeamMember.id, { instagram: value })} hint="Optional. Use the full HTTPS profile URL." />
            <Field label="X profile URL" value={selectedTeamMember.x ?? ''} onChange={(value) => updateTeamMember(selectedTeamMember.id, { x: value })} hint="Optional. Use the full HTTPS profile URL." />
          </div>
        </section>}
      </div>}
    </div>
  );
}