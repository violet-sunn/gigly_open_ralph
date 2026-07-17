import { prisma } from '@/lib/prisma'
import { getUnreadChatCount } from '@/lib/view-models'
import { listUnreadNotifications, unreadTotal } from '@/lib/notifications-read'

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

/**
 * All three shell counters for one viewer — the bell (unread items) plus the sidebar badges — in one place, so the
 * `getLiveCounts` action and the SSE stream (`app/api/live`) return identical numbers. Viewer-parameterized (no
 * session read) so the long-lived SSE stream can recompute for its connected user on each bus event.
 */
export async function computeLiveCountsFor(viewer: {
  userId: string
  role: string
}): Promise<{ notifications: number; gigs: number; chats: number }> {
  const [nav, unread] = await Promise.all([computeNavCounts(viewer), listUnreadNotifications(viewer.userId)])
  return { notifications: unreadTotal(unread), gigs: nav.gigs, chats: nav.chats }
}
