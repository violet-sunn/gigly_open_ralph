import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { GigDetail } from './GigDetail'
import { Breadcrumb } from '@/app/components/Breadcrumb'
import { BackButton } from '@/app/components/BackButton'
import { markNotificationAsRead } from '@/app/actions/notification'
import { getGigDetail } from '@/lib/view-models'

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params
  const data = await getGigDetail(id, { userId: session.userId, role: session.role })

  if (!data) {
    return (
      <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 text-center shadow-md">
        <h2 className="text-2xl font-bold text-white">Gig not found</h2>
      </div>
    )
  }

  // Mark notification as read for authorized viewers (preserve the existing side-effect).
  if (data.isOwner || data.isAssignedSpecialist) {
    try {
      await markNotificationAsRead(id)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const breadcrumbItems =
    session.role === 'SPECIALIST'
      ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Browse Gigs', href: '/gigs' },
          { label: data.header.title, current: true },
        ]
      : [
          { label: 'Dashboard', href: '/dashboard' },
          { label: data.header.title, current: true },
        ]

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-6">
        <Suspense fallback={<div className="h-8" />}>
          <BackButton />
        </Suspense>
      </div>
      <GigDetail data={data} />
    </>
  )
}
