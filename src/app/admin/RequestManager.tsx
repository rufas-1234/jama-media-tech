'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, LoaderCircle, Mail, RefreshCw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { BusinessRequest } from '@/lib/business-requests';

type RequestStatus = BusinessRequest['status'];
type RequestFilter = 'all' | 'enquiry' | 'quotation';

const statuses: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'quoted', label: 'Quoted / responded' },
  { value: 'closed', label: 'Closed' },
];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function RequestManager() {
  const router = useRouter();
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [selected, setSelected] = useState<BusinessRequest | null>(null);
  const [filter, setFilter] = useState<RequestFilter>('all');
  const [status, setStatus] = useState<RequestStatus>('new');
  const [internalNotes, setInternalNotes] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [storage, setStorage] = useState<'local' | 'tidb' | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const visibleRequests = useMemo(
    () => requests.filter((request) => filter === 'all' || request.type === filter),
    [filter, requests],
  );

  async function loadRequests() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/requests', { cache: 'no-store' });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Requests could not be loaded.');
      const items = result.requests as BusinessRequest[];
      setRequests(items);
      setStorage(result.storage);
      setSelected((current) => items.find((item) => item.id === current?.id) ?? items[0] ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Requests could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  function chooseRequest(request: BusinessRequest) {
    setSelected(request);
    setStatus(request.status);
    setInternalNotes(request.internalNotes);
    setResponseMessage(request.responseMessage);
    setQuoteAmount(request.quoteAmount === null ? '' : String(request.quoteAmount));
    setQuoteCurrency(request.quoteCurrency || 'USD');
    setNotice('');
    setError('');
  }

  useEffect(() => {
    if (selected) chooseRequest(selected);
  }, [selected?.id]);

  async function saveRequest(openEmail = false) {
    if (!selected) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/requests/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          internalNotes,
          responseMessage,
          quoteAmount: quoteAmount.trim() || null,
          quoteCurrency,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request could not be updated.');
      const updated = result.request as BusinessRequest;
      setSelected(updated);
      setRequests((current) => current.map((request) => request.id === updated.id ? updated : request));
      setStatus(updated.status);
      setNotice('Request updated.');
      if (openEmail) {
        const quoteLine = updated.quoteAmount === null ? '' : `\n\nQuoted amount: ${updated.quoteCurrency} ${updated.quoteAmount.toFixed(2)}`;
        const body = `${updated.responseMessage}${quoteLine}\n\nReference: #${updated.id}`;
        window.location.href = `mailto:${updated.email}?subject=${encodeURIComponent(`Re: ${updated.subject}`)}&body=${encodeURIComponent(body)}`;
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Request could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-5" aria-labelledby="requests-heading">
      {storage && <p className="rounded-xl border border-[#dfe5df] bg-white/80 px-4 py-3 text-sm text-[#48534b]">
        {storage === 'tidb' ? 'Connected to TiDB Cloud. Requests are stored in the business request inbox.' : 'Local preview storage. Requests are saved in this development workspace and are not persistent on Vercel.'}
      </p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm" aria-label="Request inbox">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="requests-heading" className="text-xl text-[#172019]">Customer requests</h2>
              <p className="mt-1 text-sm text-[#56615a]">{visibleRequests.length} {visibleRequests.length === 1 ? 'request' : 'requests'}</p>
            </div>
            <button type="button" className="rounded-lg p-2 text-[#354239] hover:bg-[#f1f4f0]" aria-label="Refresh requests" title="Refresh requests" disabled={loading} onClick={() => void loadRequests()}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          </div>
          <label className="mb-4 block">
            <span className="form-label">Show</span>
            <select className="form-field" value={filter} onChange={(event) => setFilter(event.target.value as RequestFilter)}>
              <option value="all">All requests</option>
              <option value="enquiry">Enquiries</option>
              <option value="quotation">Quotation requests</option>
            </select>
          </label>
          {loading ? <p className="py-8 text-sm text-[#56615a]">Loading requests…</p> : visibleRequests.length === 0 ? <p className="py-8 text-sm text-[#56615a]">No requests yet. New website enquiries and quotation requests will appear here.</p> : (
            <ul className="max-h-[42rem] divide-y divide-[#e7ebe7] overflow-y-auto">
              {visibleRequests.map((request) => (
                <li key={request.id}>
                  <button type="button" aria-current={selected?.id === request.id ? 'true' : undefined} onClick={() => chooseRequest(request)} className={`w-full rounded-xl px-3 py-3 text-left ${selected?.id === request.id ? 'bg-[#edf2ed]' : 'hover:bg-[#f7f8f5]'}`}>
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-[#1b211d]">{request.subject}</span>
                        <span className="mt-1 block truncate text-sm text-[#56615a]">{request.fullName} · {request.category}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${request.status === 'new' ? 'bg-amber-100 text-amber-900' : 'bg-[#eef1ed] text-[#48534b]'}`}>{request.status}</span>
                    </span>
                    <span className="mt-2 flex justify-between text-xs text-[#647067]">
                      <span>{request.type === 'quotation' ? 'Quote request' : 'Enquiry'} · #{request.id}</span>
                      <span>{formatDate(request.submittedAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="min-w-0 rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6" aria-label="Request details">
          {!selected ? <p className="py-12 text-center text-sm text-[#56615a]">{loading ? 'Loading request details…' : 'Select a request to review it.'}</p> : <>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#e7ebe7] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#28583e]">{selected.type === 'quotation' ? 'Quotation request' : 'Enquiry'} · #{selected.id}</p>
                <h2 className="mt-1 break-words text-2xl text-[#172019]">{selected.subject}</h2>
                <p className="mt-2 text-sm text-[#647067]">Received {formatDate(selected.submittedAt)} · Updated {formatDate(selected.updatedAt)}</p>
              </div>
              <a className="btn btn-secondary !px-4 !py-2 text-sm" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}><Mail className="h-4 w-4" /> Email requester</a>
            </div>

            <dl className="grid gap-4 rounded-2xl bg-[#f7f8f5] p-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-semibold uppercase text-[#647067]">Contact</dt><dd className="mt-1 font-medium text-[#1b211d]">{selected.fullName}</dd>{selected.organization && <dd className="text-[#56615a]">{selected.organization}</dd>}</div>
              <div><dt className="text-xs font-semibold uppercase text-[#647067]">Email / telephone</dt><dd className="mt-1"><a className="font-medium text-[#28583e] underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd>{selected.phone && <dd className="text-[#56615a]">{selected.phone}</dd>}</div>
              <div><dt className="text-xs font-semibold uppercase text-[#647067]">Category</dt><dd className="mt-1 text-[#1b211d]">{selected.category}</dd></div>
              {selected.country && <div><dt className="text-xs font-semibold uppercase text-[#647067]">Country</dt><dd className="mt-1 text-[#1b211d]">{selected.country}</dd></div>}
              {selected.scope && <div><dt className="text-xs font-semibold uppercase text-[#647067]">Quantity / scope</dt><dd className="mt-1 whitespace-pre-wrap text-[#1b211d]">{selected.scope}</dd></div>}
              {selected.deliveryLocation && <div><dt className="text-xs font-semibold uppercase text-[#647067]">Delivery / project location</dt><dd className="mt-1 text-[#1b211d]">{selected.deliveryLocation}</dd></div>}
            </dl>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-[#172019]">Requirements</h3>
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#e7ebe7] p-4 text-sm leading-6 text-[#48534b]">{selected.requirements}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="form-label">Request status</span>
                <select className="form-field" value={status} onChange={(event) => setStatus(event.target.value as RequestStatus)}>
                  {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              {selected.type === 'quotation' && <div className="grid grid-cols-[1fr_6rem] gap-3">
                <label className="block">
                  <span className="form-label">Quote amount (optional)</span>
                  <input type="number" min="0" max="1000000000" step="0.01" className="form-field" placeholder="0.00" value={quoteAmount} onChange={(event) => setQuoteAmount(event.target.value)} />
                </label>
                <label className="block">
                  <span className="form-label">Currency</span>
                  <input maxLength={3} className="form-field uppercase" placeholder="USD" value={quoteCurrency} onChange={(event) => setQuoteCurrency(event.target.value.toUpperCase())} />
                </label>
              </div>}
              <label className="block sm:col-span-2">
                <span className="form-label">Response to requester</span>
                <textarea rows={4} maxLength={5000} className="form-field" placeholder="Draft the response or quote details for the requester." value={responseMessage} onChange={(event) => setResponseMessage(event.target.value)} />
                <span className="mt-1 block text-xs text-[#647067]">Saved with the request. Use “Save &amp; open email” to open your email app with this response drafted.</span>
              </label>
              <label className="block sm:col-span-2">
                <span className="form-label">Internal notes (not sent to requester)</span>
                <textarea rows={3} maxLength={5000} className="form-field" placeholder="Follow-up, assignment or review notes" value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#e7ebe7] pt-5">
              {selected.type === 'quotation' && <button type="button" disabled={busy} className="btn btn-secondary disabled:opacity-60" onClick={() => void saveRequest(true)}>
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />} Save &amp; open email
              </button>}
              <button type="button" disabled={busy} className="btn btn-primary disabled:opacity-60" onClick={() => void saveRequest()}>
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save request
              </button>
            </div>
          </>}
        </section>
      </div>
    </section>
  );
}
