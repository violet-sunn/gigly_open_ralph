import { prisma } from '@/lib/prisma'
import { getUnreadChatCount } from '@/lib/view-models'

/**
 * The single derivation for the sidebar nav counts, shared by the SSR seed (app/(protected)/layout.tsx) and the live
 * refresh action (app/actions/counts.ts). Both MUST go through here — the counters bug was a freshness problem, and
 * forking the count logic to fix it would trade a stale number for a wrong one.
 */
export interface NavCountsData {
  /** «Мои гиги» — posted gigs (CLIENT) or assigned gigs (SPECIALIST). */
  gigs: number
  /** «Чаты» — unread conversations (gigs with unread messages), matching the inbox badges. */
  chats: number
}

export async function computeNavCounts(viewer: { userId: string; role: string }): Promise<NavCountsData> {
  const [gigs, chats] = await Promise.all([
    prisma.gig.count({
      where:
        viewer.role === 'SPECIALIST'
          ? { assignedSpecialistId: viewer.userId }
          : { clientId: viewer.userId },
    }),
    getUnreadChatCount(viewer),
  ])
  return { gigs, chats }
}
