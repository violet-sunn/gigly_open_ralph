import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getAdminDashboard } from '@/lib/view-models'
import { AdminDashboard } from './AdminDashboard'

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const data = await getAdminDashboard()

  return <AdminDashboard {...data} />
}
