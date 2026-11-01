'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Sign-in failed.');
      router.replace('/admin');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign-in failed.');
      setBusy(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <label className="block">
        <span className="form-label">Username</span>
        <input autoComplete="username" required className="form-field" value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label className="block">
        <span className="form-label">Password</span>
        <input autoComplete="current-password" required type="password" className="form-field" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-70">
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {busy ? 'Signing in' : 'Sign in'}
      </button>
    </form>
  );
}