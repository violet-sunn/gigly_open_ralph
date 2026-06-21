import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { GigDetail } from './GigDetail'
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
        <h2 className="text-2xl font-bold text-white">Гиг не найден</h2>
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

  // The gig-detail screen is rebuilt directly on the gigly_full_design prototype's own markup (GigDetail.tsx) — it
  // ships its own «← Назад к гигам» link, so no breadcrumb / back-button chrome is layered on here.
  return <GigDetail data={data} />
}
