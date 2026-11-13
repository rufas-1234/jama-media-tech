'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import type { BusinessRequestType } from '@/lib/business-request-validation';

const enquiryCategories = ['General enquiry', 'Supply and logistics', 'Plastic recycling', 'ICT consultancy', 'Internet infrastructure', 'Web development', 'Partnership', 'Other'];
const quotationCategories = ['Food and NFIs', 'Plastic Recycling', 'ICT Consultancy', 'Internet Infrastructure', 'Web Development', 'Other'];

type FormFields = {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  category: string;
  requirements: string;
  scope: string;
  deliveryLocation: string;
  consent: boolean;
  website: string;
};

const initialFields: FormFields = {
  fullName: '',
  organization: '',
  email: '',
  phone: '',
  country: '',
  subject: '',
  category: '',
  requirements: '',
  scope: '',
  deliveryLocation: '',
  consent: false,
  website: '',
};

export function BusinessRequestForm({ type }: { type: BusinessRequestType }) {
  const isQuote = type === 'quotation';
  const [fields, setFields] = useState(initialFields);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState<number | null>(null);

  function update<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setReference(null);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your request could not be submitted.');
      setReference(result.requestId);
      setFields(initialFields);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your request could not be submitted. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      {reference !== null && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Thank you. Your {isQuote ? 'quotation request' : 'enquiry'} has been received. Reference #{reference}.
      </p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Leave this field empty
        <input tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => update('website', event.target.value)} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="form-label">Full name *</span>
          <input required minLength={2} maxLength={120} autoComplete="name" className="form-field" placeholder="Your name" value={fields.fullName} onChange={(event) => update('fullName', event.target.value)} />
        </label>
        <label className="block">
          <span className="form-label">Organisation</span>
          <input maxLength={160} autoComplete="organization" className="form-field" placeholder="Organisation" value={fields.organization} onChange={(event) => update('organization', event.target.value)} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="form-label">Email *</span>
          <input required type="email" maxLength={254} autoComplete="email" className="form-field" placeholder="name@example.com" value={fields.email} onChange={(event) => update('email', event.target.value)} />
        </label>
        <label className="block">
          <span className="form-label">Telephone</span>
          <input type="tel" maxLength={60} autoComplete="tel" className="form-field" placeholder="Telephone number" value={fields.phone} onChange={(event) => update('phone', event.target.value)} />
        </label>
      </div>

      {isQuote && <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="form-label">Country</span>
          <input maxLength={120} autoComplete="country-name" className="form-field" placeholder="Country" value={fields.country} onChange={(event) => update('country', event.target.value)} />
        </label>
        <label className="block">
          <span className="form-label">Service category *</span>
          <select required className="form-field" value={fields.category} onChange={(event) => update('category', event.target.value)}>
            <option value="">Choose a service</option>
            {quotationCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>}

      <label className="block">
        <span className="form-label">{isQuote ? 'Project or supply title *' : 'Subject *'}</span>
        <input required minLength={3} maxLength={180} className="form-field" placeholder={isQuote ? 'What do you need a quote for?' : 'Subject'} value={fields.subject} onChange={(event) => update('subject', event.target.value)} />
      </label>

      {!isQuote && <label className="block">
        <span className="form-label">Enquiry category *</span>
        <select required className="form-field" value={fields.category} onChange={(event) => update('category', event.target.value)}>
          <option value="">Choose a category</option>
          {enquiryCategories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>}

      <label className="block">
        <span className="form-label">{isQuote ? 'Description of requirements *' : 'Message *'}</span>
        <textarea required minLength={10} maxLength={5000} rows={5} className="form-field" placeholder={isQuote ? 'Describe the items, services or project requirements' : 'Tell us about your enquiry'} value={fields.requirements} onChange={(event) => update('requirements', event.target.value)} />
      </label>

      {isQuote && <>
        <label className="block">
          <span className="form-label">Estimated quantity or project scope</span>
          <input maxLength={500} className="form-field" placeholder="Estimated quantity or project scope" value={fields.scope} onChange={(event) => update('scope', event.target.value)} />
        </label>
        <label className="block">
          <span className="form-label">Delivery or project location</span>
          <input maxLength={160} autoComplete="shipping address-level2" className="form-field" placeholder="Delivery or project location" value={fields.deliveryLocation} onChange={(event) => update('deliveryLocation', event.target.value)} />
        </label>
      </>}

      <label className="flex items-start gap-3 text-sm text-[#4f5557]">
        <input required type="checkbox" className="mt-1" checked={fields.consent} onChange={(event) => update('consent', event.target.checked)} />
        <span>I consent to Jama Tech using my information to respond to this {isQuote ? 'quotation request' : 'enquiry'}. See our <Link className="font-semibold text-[#28583e] underline" href="/privacy-policy">Privacy Policy</Link>.</span>
      </label>

      <button type="submit" disabled={busy} className="btn btn-primary inline-flex disabled:cursor-wait disabled:opacity-70">
        {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        {busy ? 'Submitting…' : isQuote ? 'Submit request' : 'Send enquiry'}
      </button>
    </form>
  );
}
