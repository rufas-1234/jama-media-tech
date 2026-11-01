'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, LoaderCircle, LogOut, Pencil, Send, Trash2 } from 'lucide-react';
import { projectCategories } from '@/lib/content';
import { SiteContentManager } from './SiteContentManager';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

type ContentKind = 'news' | 'project';

type Post = {
  id: number;
  contentType: ContentKind;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'publish';
  category: string;
  location: string;
  imageUrl: string;
  date: string;
  modified: string;
};

type Draft = Pick<Post, 'contentType' | 'title' | 'slug' | 'excerpt' | 'content' | 'status' | 'category' | 'location' | 'imageUrl'>;
const emptyDraft = (contentType: ContentKind): Draft => ({ contentType, title: '', slug: '', excerpt: '', content: '', status: 'draft', category: '', location: '', imageUrl: '' });

export function AdminDashboard() {
  const router = useRouter();
  const [adminView, setAdminView] = useState<'publishing' | 'site'>('publishing');
  const [posts, setPosts] = useState<Post[]>([]);
  const [contentType, setContentType] = useState<ContentKind>('news');
  const [draft, setDraft] = useState<Draft>(emptyDraft('news'));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [storage, setStorage] = useState<'local' | 'wordpress' | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadPosts(type: ContentKind) {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/posts?type=${type}`, { cache: 'no-store' });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || `${type === 'project' ? 'Projects' : 'Posts'} could not be loaded.`);
      setPosts(result.posts);
      setStorage(result.storage);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Posts could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts(contentType);
  }, [contentType]);

  function startNew(type: ContentKind = contentType) {
    setEditingId(null);
    setContentType(type);
    setDraft(emptyDraft(type));
    setNotice('');
    setError('');
  }

  function editPost(post: Post) {
    setContentType(post.contentType);
    setEditingId(post.id);
    setDraft({ contentType: post.contentType, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, status: post.status, category: post.category, location: post.location, imageUrl: post.imageUrl });
    setNotice('');
    setError('');
    document.getElementById('post-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const endpoint = editingId ? `/api/admin/posts/${editingId}?type=${draft.contentType}` : '/api/admin/posts';
      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Post could not be saved.');
      setNotice(draft.status === 'publish' ? 'Post published.' : 'Draft saved.');
      setEditingId(result.post.id);
      setDraft({ contentType: result.post.contentType, title: result.post.title, slug: result.post.slug, excerpt: result.post.excerpt, content: result.post.content, status: result.post.status, category: result.post.category, location: result.post.location, imageUrl: result.post.imageUrl });
      await loadPosts(draft.contentType);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Post could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  async function deletePost(post: Post) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/posts/${post.id}?type=${post.contentType}`, { method: 'DELETE' });
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Post could not be deleted.');
      }
      if (editingId === post.id) startNew();
      setNotice('Post deleted.');
      await loadPosts(post.contentType);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Post could not be deleted.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <section className="section-surface min-h-screen py-10 lg:py-14">
      <div className="container">
        <div className="admin-hero mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#c5e1cb]">Jama Tech LTD · Editorial workspace</p>
            <h1 className="mt-2 text-3xl text-white md:text-4xl">Content studio</h1>
            <p className="mt-2 text-sm text-white/80">Manage news, insights, and project stories.</p>
          </div>
          <div className="flex items-center gap-3">
            {adminView === 'publishing' && <>
              <button type="button" className="btn btn-secondary" onClick={() => startNew('news')}><FilePlus2 className="h-4 w-4" /> New story</button>
              <button type="button" className="btn btn-primary" onClick={() => startNew('project')}><FilePlus2 className="h-4 w-4" /> New project</button>
            </>}
            <button type="button" className="btn btn-secondary" onClick={() => setAdminView(adminView === 'site' ? 'publishing' : 'site')}>{adminView === 'site' ? 'News & projects' : 'Site content'}</button>
            <button type="button" aria-label="Sign out" title="Sign out" className="rounded-full border border-[#dfe5df] bg-white p-3 text-[#354239] hover:bg-[#f1f4f0]" onClick={logout}><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {storage && <p className="mb-6 rounded-xl border border-[#dfe5df] bg-white/80 px-4 py-3 text-sm text-[#48534b]">
          {storage === 'wordpress' ? 'Connected to WordPress. Published posts appear on the site.' : 'Local preview storage. Posts are saved to this development workspace; connect WordPress before deployment.'}
        </p>}
        {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        {adminView === 'site' ? <SiteContentManager /> : <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section aria-labelledby="posts-heading" className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6">
            <div role="tablist" aria-label="Content type" className="mb-5 flex gap-2 rounded-xl bg-[#f1f4f0] p-1">
              {(['news', 'project'] as const).map((type) => (
                <button key={type} type="button" role="tab" aria-selected={contentType === type} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${contentType === type ? 'bg-white text-[#28583e] shadow-sm' : 'text-[#56615a] hover:text-[#172019]'}`} onClick={() => startNew(type)}>
                  {type === 'news' ? 'News & insights' : 'Projects'}
                </button>
              ))}
            </div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="posts-heading" className="text-xl text-[#172019]">{contentType === 'project' ? 'Projects' : 'Posts'}</h2>
              <span className="text-sm text-[#56615a]">{posts.length}</span>
            </div>
            {loading ? <p className="py-8 text-sm text-[#56615a]">Loading posts…</p> : posts.length === 0 ? <p className="py-8 text-sm text-[#56615a]">{contentType === 'project' ? 'No projects yet. Create your first project.' : 'No posts yet. Create your first story.'}</p> : (
              <ul className="divide-y divide-[#e7ebe7]">
                {posts.map((post) => (
                  <li key={post.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#1b211d]">{post.title}</p>
                      <p className="mt-1 text-xs text-[#56615a]">{post.status === 'publish' ? 'Published' : 'Draft'} · {post.contentType === 'project' ? `${post.category} · ${post.location} · /projects/${post.slug}` : `/news/${post.slug}`}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" aria-label={`Edit ${post.title}`} title="Edit post" className="rounded-lg p-2 text-[#354239] hover:bg-[#f1f4f0]" onClick={() => editPost(post)}><Pencil className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Delete ${post.title}`} title="Delete post" className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => void deletePost(post)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="post-editor" aria-labelledby="editor-heading" className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-[#28583e]">{editingId ? (contentType === 'project' ? 'Edit project' : 'Edit story') : (contentType === 'project' ? 'New project' : 'New story')}</p>
              <h2 id="editor-heading" className="mt-1 text-xl text-[#172019]">{editingId ? 'Update this item' : contentType === 'project' ? 'Add a project' : 'Write a story'}</h2>
            </div>
            <form className="space-y-4" onSubmit={savePost}>
              <label className="block">
                <span className="form-label">Title</span>
                <input required minLength={3} maxLength={180} className="form-field" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              </label>
              <label className="block">
                <span className="form-label">URL slug</span>
                <input className="form-field" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="generated-from-title" />
              </label>
              <label className="block">
                <span className="form-label">Summary</span>
                <textarea rows={3} maxLength={500} className="form-field" value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} />
              </label>
              {contentType === 'project' && <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Project category</span>
                  <select required className="form-field" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                    <option value="">Choose a category</option>
                    {projectCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="form-label">Location</span>
                  <input required maxLength={160} className="form-field" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="Juba, South Sudan" />
                </label>
              </div>}
              <ImageUploadField label="Cover image (optional)" value={draft.imageUrl} onChange={(imageUrl) => setDraft({ ...draft, imageUrl })} />
              <label className="block">
                <span className="form-label">{contentType === 'project' ? 'Project details' : 'Article body'}</span>
                <textarea required rows={10} maxLength={50000} className="form-field" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={contentType === 'project' ? 'Describe the work and outcomes. Separate paragraphs with a blank line.' : 'Write your article. Separate paragraphs with a blank line.'} />
                <span className="mt-1 block text-xs text-[#56615a]">Plain text; blank lines become new paragraphs.</span>
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ebe7] pt-4">
                <label className="flex items-center gap-2 text-sm font-medium text-[#354239]">
                  <span>Status</span>
                  <select className="form-field w-auto min-w-32" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Draft['status'] })}>
                    <option value="draft">Draft</option>
                    <option value="publish">Published</option>
                  </select>
                </label>
                <div className="flex gap-2">
                  {editingId !== null && <button type="button" className="btn btn-secondary" onClick={() => startNew()}>Cancel edit</button>}
                  <button type="submit" disabled={busy} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
                    {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {busy ? 'Saving' : draft.status === 'publish' ? 'Publish' : 'Save draft'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>}
      </div>
    </section>
  );
}