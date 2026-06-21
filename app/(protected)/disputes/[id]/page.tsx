import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDispute } from '@/lib/view-models'
import { DisputeDetailDesign } from '../DisputeDetailDesign'

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  const dispute = await getDispute(id, { userId: session.userId, role: session.role })

  // Not found OR the viewer is neither an admin nor a participant (getDispute enforces authorization → null).
  if (!dispute) {
    notFound()
  }

  return <DisputeDetailDesign dispute={dispute} isAdmin={session.role === 'ADMIN'} />
}
