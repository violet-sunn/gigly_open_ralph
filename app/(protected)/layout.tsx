import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { MainNav } from '@/app/components/MainNav'
import { Suspense } from 'react'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-surface-level-0)' }}>
      <Suspense fallback={<div className="h-16 bg-surface-level-1 border-b border-neutral-weak" />}>
        <MainNav userEmail={session.email} userRole={session.role} />
      </Suspense>
      {children}
    </div>
  )
}
