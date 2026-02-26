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
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
        <MainNav userEmail={session.email} userRole={session.role} />
      </Suspense>
      {children}
    </div>
  )
}
