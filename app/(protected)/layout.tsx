import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { MainNav } from '@/app/components/MainNav'
import { SkipToMainContent } from '@/app/components/SkipToMainContent'
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
      <SkipToMainContent />
      <Suspense fallback={<div className="h-16 bg-surface-level-1 border-b border-neutral-weak" />}>
        <MainNav userEmail={session.email} userRole={session.role} />
      </Suspense>
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </div>
  )
}
