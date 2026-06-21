import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getNewDisputeContext } from '@/lib/disputes'
import { NewDisputeDesign } from './NewDisputeDesign'

/**
 * «Открыть спор» (reconcile-disputes-flow) — the dedicated open-dispute screen, gig-scoped via `?gig=<id>`.
 * Participant-gated: `getNewDisputeContext` returns null for non-participants → redirect to the disputes list.
 */
export default async function NewDisputePage({ searchParams }: { searchParams: Promise<{ gig?: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { gig } = await searchParams
  const ctx = gig ? await getNewDisputeContext(gig, { userId: session.userId, role: session.role }) : null
  if (!ctx) redirect('/disputes')

  return <NewDisputeDesign gigId={ctx.gigId} gigTitle={ctx.gigTitle} />
}
