import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { MainNav } from '@/app/components/MainNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-surface-level-0">
      <MainNav userEmail={session.email} userRole={session.role} />
      {children}
    </div>
  )
}
