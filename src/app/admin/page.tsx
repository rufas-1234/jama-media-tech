import { redirect } from 'next/navigation';
import { AdminDashboard } from './AdminDashboard';
import { adminAuthConfigured, hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!adminAuthConfigured() || !(await hasAdminSession())) redirect('/admin/login');
  return <AdminDashboard />;
}