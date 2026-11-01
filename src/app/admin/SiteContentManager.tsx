'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { projectCategories } from '@/lib/content';
import type { HomeSection, Service, SiteContent, TeamMember } from '@/lib/site-content';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

type EditorArea = 'company' | 'services' | 'team';

const emptyService = (index: number): Service => ({
  slug: '', number: String(index + 1).padStart(2, '0'), short: '', title: '', description: '', introduction: '',
  image: 'photo-1522202176988-66273c2fd55f', alt: '', capabilities: [], audience: '',
});

const emptyTeamMember = (): TeamMember => ({ id: crypto.randomUUID(), name: '', role: '', biography: '', imageUrl: '' });
const emptyHomeSection = (): HomeSection => ({ id: crypto.randomUUID(), eyebrow: '', title: '', body: '', imageUrl: '', enabled: true });

function Field({ label, value, onChange, multiline = false, hint }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      {multiline ? <textarea rows={4} className="form-field" value={value} onChange={(event) => onChange(event.target.value)} /> : <input className="form-field" value={value} onChange={(event) => onChange(event.target.value)} />}
      {hint && <span className="mt-1 block text-xs text-[#56615a]">{hint}</span>}
    </label>
  );
}

export function SiteContentManager() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [storage, setStorage] = useState<'local' | 'wordpress' | null>(null);
  const [area, setArea] = useState<EditorArea>('company');
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

  function updateCompany(key: keyof SiteContent['company'], value: string) {
    setContent((current) => current ? { ...current, company: { ...current.company, [key]: value } } : current);
  }

  function updateHomepage(key: 'headline' | 'introduction', value: string) {
    setContent((current) => current ? { ...current, homepage: { ...current.homepage, [key]: value } } : current);
  }

  function updateSection(id: string, patch: Partial<HomeSection>) {
    setContent((current) => current ? { ...current, homepage: { ...current.homepage, sections: current.homepage.sections.map((section) => section.id === id ? { ...section, ...patch } : section) } } : current);
  }

  function addSection() {
    setContent((current) => current ? { ...current, homepage: { ...current.homepage, sections: [...current.homepage.sections, emptyHomeSection()] } } : current);
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

  return (
    <div>
      {storage && <p className="mb-5 rounded-xl border border-[#dfe5df] bg-white/80 px-4 py-3 text-sm text-[#48534b]">
        {storage === 'wordpress' ? 'Connected to WordPress site settings.' : 'Local preview storage. Configure WordPress before deploying these edits.'}
      </p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Site content areas" className="flex gap-1 rounded-xl bg-[#e9eee9] p-1">
          {([
            ['company', 'Company & Home'], ['services', 'Services'], ['team', 'Team'],
          ] as const).map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={area === key} className={`rounded-lg px-4 py-2 text-sm font-medium ${area === key ? 'bg-white text-[#28583e] shadow-sm' : 'text-[#56615a] hover:text-[#172019]'}`} onClick={() => setArea(key)}>{label}</button>
          ))}
        </div>
        <button type="button" disabled={saving} className="btn btn-primary" onClick={() => void saveContent()}>
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving' : 'Save site content'}
        </button>
      </div>

      {area === 'company' && <div className="space-y-8">
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <h2 className="mb-5 text-xl text-[#172019]">Company information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company name" value={content.company.name} onChange={(value) => updateCompany('name', value)} />
            <Field label="Location" value={content.company.location} onChange={(value) => updateCompany('location', value)} />
            <Field label="Email" value={content.company.email} onChange={(value) => updateCompany('email', value)} />
            <Field label="Phone" value={content.company.phone} onChange={(value) => updateCompany('phone', value)} />
            <div className="md:col-span-2"><Field label="Company description" value={content.company.description} onChange={(value) => updateCompany('description', value)} multiline /></div>
            <Field label="Vision" value={content.company.vision} onChange={(value) => updateCompany('vision', value)} multiline />
            <Field label="Mission" value={content.company.mission} onChange={(value) => updateCompany('mission', value)} multiline />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <h2 className="mb-5 text-xl text-[#172019]">Homepage hero</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Headline" value={content.homepage.headline} onChange={(value) => updateHomepage('headline', value)} multiline />
            <Field label="Introduction" value={content.homepage.introduction} onChange={(value) => updateHomepage('introduction', value)} multiline />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl text-[#172019]">Custom homepage sections</h2><p className="mt-1 text-sm text-[#56615a]">Add sections below the main service and partnership content.</p></div>
            <button type="button" className="btn btn-secondary" disabled={content.homepage.sections.length >= 12} onClick={addSection}><FilePlus2 className="h-4 w-4" /> Add section</button>
          </div>
          <div className="space-y-4">
            {content.homepage.sections.map((section, index) => (
              <div key={section.id} className="rounded-xl border border-[#e7ebe7] bg-[#f9faf8] p-4">
                <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-semibold text-[#172019]">Section {index + 1}</h3><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm text-[#48534b]"><input type="checkbox" checked={section.enabled} onChange={(event) => updateSection(section.id, { enabled: event.target.checked })} />Visible</label><button type="button" aria-label={`Remove section ${index + 1}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => setContent({ ...content, homepage: { ...content.homepage, sections: content.homepage.sections.filter((item) => item.id !== section.id) } })}><Trash2 className="h-4 w-4" /></button></div></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Section label" value={section.eyebrow} onChange={(value) => updateSection(section.id, { eyebrow: value })} />
                  <Field label="Heading" value={section.title} onChange={(value) => updateSection(section.id, { title: value })} />
                  <div className="md:col-span-2"><Field label="Text" value={section.body} onChange={(value) => updateSection(section.id, { body: value })} multiline /></div>
                  <div className="md:col-span-2"><ImageUploadField label="Section image (optional)" value={section.imageUrl} onChange={(value) => updateSection(section.id, { imageUrl: value })} /></div>
                </div>
              </div>
            ))}
            {content.homepage.sections.length === 0 && <p className="rounded-xl bg-[#f7f8f5] px-4 py-6 text-sm text-[#56615a]">No custom sections yet.</p>}
          </div>
        </section>
      </div>}

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
          </div>
        </section>}
      </div>}
    </div>
  );
}