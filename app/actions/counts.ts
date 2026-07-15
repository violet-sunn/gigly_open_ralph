'use server'

import { getSession } from '@/lib/session'
import { computeNavCounts } from '@/lib/counts'
import { getUnreadNotifications } from './notification'

/**
 * One round trip for every counter in the shell (bell + sidebar badges), so the live refresh is a single poll rather
 * than one per counter.
 *
 * Unlike the other notification actions this MUST NOT redirect on a missing session: it is polled from a persistent
 * client shell, and a tab that has just logged out would otherwise throw a redirect out of a background interval.
 * `authenticated: false` lets the caller quietly stand down instead.
 */
export interface LiveCounts {
  authenticated: boolean
  notifications: number
  gigs: number
  chats: number
}

const ZERO: LiveCounts = { authenticated: false, notifications: 0, gigs: 0, chats: 0 }

export async function getLiveCounts(): Promise<LiveCounts> {
  const session = await getSession()
  if (!session) return ZERO

  // ADMIN uses the admin shell, which renders no counts (layout passes `counts={{}}`) and has no bell surface of its
  // own — nothing to poll for.
  if (session.role === 'ADMIN') return { ...ZERO, authenticated: true }

  const viewer = { userId: session.userId, role: session.role }
  const [nav, notifications] = await Promise.all([
    computeNavCounts(viewer),
    getUnreadNotifications(),
  ])

  return {
    authenticated: true,
    notifications: notifications.length,
    gigs: nav.gigs,
    chats: nav.chats,
  }
}
