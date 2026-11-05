'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { LoaderCircle, Trash2, UserPlus } from 'lucide-react';

type Publisher = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'disabled';
  createdAt: string;
};

const blankPublisher = { name: '', email: '', password: '', confirmPassword: '' };

export function PublisherManager() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [form, setForm] = useState(blankPublisher);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadPublishers() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/publishers', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Publisher accounts could not be loaded.');
      setPublishers(result.publishers);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Publisher accounts could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPublishers();
  }, []);

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setNotice('');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/publishers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Publisher account could not be created.');
      setForm(blankPublisher);
      setNotice(`Publisher account created for ${result.publisher.email}. Share the sign-in details securely.`);
      await loadPublishers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Publisher account could not be created.');
    } finally {
      setBusy(false);
    }
  }

  async function removeAccount(publisher: Publisher) {
    if (!window.confirm(`Remove ${publisher.email}'s publisher access? This will sign them out and prevent future access.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/publishers?id=${publisher.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Publisher account could not be removed.');
      setNotice(`Access removed for ${publisher.email}.`);
      await loadPublishers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Publisher account could not be removed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-semibold uppercase text-[#28583e]">Full content access</p>
        <h2 className="mt-1 text-xl text-[#172019]">Create a publisher</h2>
        <p className="mb-5 mt-2 text-sm leading-6 text-[#56615a]">Publishers can manage all site content, upload images, and publish news and projects. They cannot manage publisher accounts.</p>
        <form className="space-y-4" onSubmit={createAccount}>
          <label className="block">
            <span className="form-label">Publisher name</span>
            <input required minLength={2} maxLength={120} className="form-field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="block">
            <span className="form-label">Email (sign-in username)</span>
            <input required type="email" autoComplete="email" maxLength={254} className="form-field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="block">
            <span className="form-label">Temporary password</span>
            <input required type="password" autoComplete="new-password" minLength={6} maxLength={256} className="form-field" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <span className="mt-1 block text-xs text-[#56615a]">Use at least 6 characters and share it with the publisher securely.</span>
          </label>
          <label className="block">
            <span className="form-label">Confirm password</span>
            <input required type="password" autoComplete="new-password" minLength={6} maxLength={256} className="form-field" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {busy ? 'Saving' : 'Create publisher'}
          </button>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl text-[#172019]">Publisher accounts</h2>
          <span className="text-sm text-[#56615a]">{publishers.length}</span>
        </div>
        {loading ? <p className="py-8 text-sm text-[#56615a]">Loading publisher accounts…</p> : publishers.length === 0 ? <p className="py-8 text-sm text-[#56615a]">No publisher accounts yet.</p> : (
          <ul className="divide-y divide-[#e7ebe7]">
            {publishers.map((publisher) => (
              <li key={publisher.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#1b211d]">{publisher.name}</p>
                  <p className="mt-1 truncate text-sm text-[#56615a]">{publisher.email}</p>
                  <p className="mt-1 text-xs text-[#647067]">Full content access · {publisher.status}</p>
                </div>
                <button type="button" disabled={busy} aria-label={`Remove ${publisher.email}`} title="Remove publisher access" className="rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:opacity-50" onClick={() => void removeAccount(publisher)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
