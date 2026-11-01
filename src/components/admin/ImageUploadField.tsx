'use client';

import { useState } from 'react';
import { LoaderCircle, Trash2, Upload } from 'lucide-react';
import { imageSource } from '@/lib/content';

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
};

export function ImageUploadField({ label, value, onChange, hint }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/media', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Image could not be uploaded.');
      onChange(result.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Image could not be uploaded.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <span className="form-label">{label}</span>
        <label className="btn btn-secondary mt-1 inline-flex cursor-pointer">
          {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading image' : 'Choose image'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label={`Upload ${label}`} className="sr-only" disabled={uploading} onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ''; }} />
        </label>
        <p className="mt-2 text-xs text-[#56615a]">{hint || 'JPEG, PNG, WebP or GIF; maximum 5 MB. You can also enter a URL below.'}</p>
      </div>
      <label className="block">
        <span className="form-label">Image URL or photo ID</span>
        <input type="text" className="form-field" value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://… or photo-…" />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {value && <div className="flex items-center gap-4 rounded-xl border border-[#dfe5df] bg-[#f7f8f5] p-3">
        <img src={imageSource(value, 600)} alt={`${label} preview`} className="h-20 w-28 rounded-lg object-cover" />
        <p className="min-w-0 flex-1 truncate text-xs text-[#56615a]">{value}</p>
        <button type="button" aria-label={`Remove ${label}`} title={`Remove ${label}`} className="rounded-lg p-2 text-[#56615a] hover:bg-white" onClick={() => onChange('')}><Trash2 className="h-4 w-4" /></button>
      </div>}
    </div>
  );
}