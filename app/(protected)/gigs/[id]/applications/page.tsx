import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getGigApplications } from '@/lib/view-models'
import { Applications } from './Applications'

/**
 * Company «Отклики» screen (build-applications-screen) — the gig-scoped applicants list. Owner-gated:
 * `getGigApplications` returns null for non-owners, and we redirect them to the gig detail.
 */
export default async function GigApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params
  const data = await getGigApplications(id, { userId: session.userId, role: session.role })
  if (!data) redirect(`/gigs/${id}`)

  return <Applications data={data} />
}
