import { redirect } from 'next/navigation';
import { AdminDashboard } from './AdminDashboard';
import { adminAuthConfigured, getAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!adminAuthConfigured() || !session) redirect('/admin/login');
  return <AdminDashboard role={session.role} username={session.username} />;
}