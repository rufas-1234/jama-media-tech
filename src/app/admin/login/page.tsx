import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './AdminLoginForm';
import { adminAuthConfigured, hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect('/admin');

  return (
    <section className="page-hero min-h-[70vh] py-16 lg:py-24">
      <div className="container flex justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2rem] p-8 md:p-10">
          <Link href="/" className="text-sm font-semibold text-[#28583e] hover:underline">Jama Tech LTD</Link>
          <p className="mt-8 text-xs font-semibold uppercase text-[#28583e]">Editorial workspace</p>
          <h1 className="mt-2 text-3xl text-[#172019] md:text-4xl">Sign in</h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-[#56615a]">Manage news, blog posts, and insights published on the site.</p>
          {adminAuthConfigured() ? (
            <AdminLoginForm />
          ) : (
            <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET on the server.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}