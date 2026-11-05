'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, LoaderCircle, LogOut, Pencil, Send, Trash2 } from 'lucide-react';
import { projectCategories } from '@/lib/content';
import { SiteContentManager, type EditorArea } from './SiteContentManager';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { PublisherManager } from './PublisherManager';

type ContentKind = 'news' | 'project';
type DashboardSection = EditorArea | 'news' | 'projects' | 'publishers';

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
  imageUrls: string[];
  date: string;
  modified: string;
};

type Draft = Pick<Post, 'contentType' | 'title' | 'slug' | 'excerpt' | 'content' | 'status' | 'category' | 'location' | 'imageUrl' | 'imageUrls'>;
const emptyDraft = (contentType: ContentKind): Draft => ({ contentType, title: '', slug: '', excerpt: '', content: '', status: 'draft', category: '', location: '', imageUrl: '', imageUrls: [] });

function ImageGalleryField({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-sm font-semibold text-[#172019]">Post images</h3><p className="mt-1 text-xs text-[#56615a]">The first image is used as the cover. Add up to 12 images.</p></div>
        <button type="button" className="btn btn-secondary" disabled={images.length >= 12} onClick={() => onChange([...images, ''])}><FilePlus2 className="h-4 w-4" /> Add image</button>
      </div>
      {images.map((image, index) => <div key={`post-image-${index}`} className="rounded-xl border border-[#e7ebe7] bg-[#f9faf8] p-3">
        <ImageUploadField
          label={`${index === 0 ? 'Cover image' : `Gallery image ${index + 1}`}${index === 0 ? ' (optional)' : ''}`}
          value={image}
          hint="Upload an image or paste its URL. JPEG, PNG, WebP or GIF; maximum 5 MB."
          onChange={(value) => onChange(images.map((item, itemIndex) => itemIndex === index ? value : item))}
        />
        {images.length > 1 && <button type="button" className="mt-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-3.5 w-3.5" /> Remove image</button>}
      </div>)}
      {!images.length && <p className="rounded-xl border border-dashed border-[#d5ddd5] px-4 py-5 text-sm text-[#647067]">No images added yet.</p>}
    </div>
  );
}

export function AdminDashboard({ role, username }: { role: 'admin' | 'publisher'; username: string }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DashboardSection>('news');
  const [posts, setPosts] = useState<Post[]>([]);
  const [importableProjectCount, setImportableProjectCount] = useState(0);
  const [contentType, setContentType] = useState<ContentKind>('news');
  const [draft, setDraft] = useState<Draft>(emptyDraft('news'));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [storage, setStorage] = useState<'local' | 'tidb' | null>(null);
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
      setImportableProjectCount(result.importableProjectCount ?? 0);
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
    const imageUrls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
    setDraft({ contentType: post.contentType, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, status: post.status, category: post.category, location: post.location, imageUrl: imageUrls[0] ?? '', imageUrls });
    setNotice('');
    setError('');
    document.getElementById('post-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function importSiteProjects() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/posts/import-site-projects', { method: 'POST' });
      const result = await response.json();
      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Site projects could not be imported.');
      setNotice(result.imported ? `${result.imported} existing site projects are now editable here.` : 'All existing site projects are already editable here.');
      await loadPosts('project');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Site projects could not be imported.');
    } finally {
      setBusy(false);
    }
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
      setDraft({ contentType: result.post.contentType, title: result.post.title, slug: result.post.slug, excerpt: result.post.excerpt, content: result.post.content, status: result.post.status, category: result.post.category, location: result.post.location, imageUrl: result.post.imageUrl, imageUrls: result.post.imageUrls ?? (result.post.imageUrl ? [result.post.imageUrl] : []) });
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
            <p className="mt-2 text-sm text-white/80">Signed in as {username} · {role === 'admin' ? 'Admin' : 'Publisher'}</p>
          </div>
          <div className="flex items-center gap-3">
            {activeSection === 'news' && <button type="button" className="btn btn-primary" onClick={() => startNew('news')}><FilePlus2 className="h-4 w-4" /> New story</button>}
            {activeSection === 'projects' && <button type="button" className="btn btn-primary" onClick={() => startNew('project')}><FilePlus2 className="h-4 w-4" /> New project</button>}
            <button type="button" aria-label="Sign out" title="Sign out" className="rounded-full border border-[#dfe5df] bg-white p-3 text-[#354239] hover:bg-[#f1f4f0]" onClick={logout}><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {storage && <p className="mb-6 rounded-xl border border-[#dfe5df] bg-white/80 px-4 py-3 text-sm text-[#48534b]">
          {storage === 'tidb' ? 'Connected to TiDB Cloud. Published posts appear on the site.' : 'Local preview storage. Posts are saved to this development workspace; configure TiDB Cloud before deployment.'}
        </p>}
        {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-3 lg:sticky lg:top-24">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#647067]">Manage content</p>
            <nav aria-label="Admin content sections" className="space-y-1">
              {([
                ['home', 'Home page'], ['pages', 'Pages'], ['services', 'Services'], ['team', 'Team'], ['news', 'News & insights'], ['projects', 'Projects'], ['company', 'Company details'], ['navigation', 'Navigation'],
              ] as const).map(([key, label]) => (
                <button key={key} type="button" aria-current={activeSection === key ? 'page' : undefined} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium ${activeSection === key ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#48534b] hover:bg-[#f7f8f5]'}`} onClick={() => {
                  setActiveSection(key);
                  if (key === 'news') startNew('news');
                  if (key === 'projects') startNew('project');
                }}>{label}</button>
              ))}
              {role === 'admin' && <button type="button" aria-current={activeSection === 'publishers' ? 'page' : undefined} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium ${activeSection === 'publishers' ? 'bg-[#edf2ed] text-[#28583e]' : 'text-[#48534b] hover:bg-[#f7f8f5]'}`} onClick={() => setActiveSection('publishers')}>Publishers</button>}
            </nav>
          </aside>
          <div className="min-w-0">
        {activeSection === 'publishers' ? <PublisherManager /> : activeSection !== 'news' && activeSection !== 'projects' ? <SiteContentManager area={activeSection} /> : <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section aria-labelledby="posts-heading" className="rounded-[1.5rem] border border-[#dfe5df] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="posts-heading" className="text-xl text-[#172019]">{contentType === 'project' ? 'Projects' : 'Posts'}</h2>
              <div className="flex items-center gap-3"><span className="text-sm text-[#56615a]">{posts.length}</span>{contentType === 'project' && importableProjectCount > 0 && <button type="button" disabled={busy} className="btn btn-secondary !px-3 !py-2 text-xs" onClick={() => void importSiteProjects()}>Import {importableProjectCount} site projects</button>}</div>
            </div>
            {contentType === 'project' && importableProjectCount > 0 && <p className="mb-4 rounded-lg bg-[#f7f8f5] p-3 text-xs leading-5 text-[#56615a]">These visible sample projects are not saved as editable records yet. Import them to manage, update or delete them here.</p>}
            {loading ? <p className="py-8 text-sm text-[#56615a]">Loading posts…</p> : posts.length === 0 ? <p className="py-8 text-sm text-[#56615a]">{contentType === 'project' ? 'No projects yet. Create your first project.' : 'No posts yet. Create your first story.'}</p> : (
              <ul className="divide-y divide-[#e7ebe7]">
                {posts.map((post) => (
                  <li key={post.id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#1b211d]">{post.title}</p>
                      <p className="mt-1 text-xs text-[#56615a]">{post.status === 'publish' ? 'Published' : 'Draft'} · {post.contentType === 'project' ? `${post.category} · ${post.location} · /projects/${post.slug}` : `${post.category || 'News & insights'} · /news/${post.slug}`}</p>
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
              {contentType === 'news' && <label className="block">
                <span className="form-label">Category (optional)</span>
                <input maxLength={100} className="form-field" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="News, Community, Technology…" />
              </label>}
              <ImageGalleryField images={draft.imageUrls} onChange={(imageUrls) => setDraft({ ...draft, imageUrls, imageUrl: imageUrls.find(Boolean) ?? '' })} />
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
        </div>
      </div>
    </section>
  );
}