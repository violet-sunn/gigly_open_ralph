import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/app/components/DashboardNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userEmail={session.email} userRole={session.role} />
      {children}
    </div>
  )
}
