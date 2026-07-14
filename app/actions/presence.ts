'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

/**
 * Lightweight presence heartbeat (profile-experience-fixes — real online indicator).
 *
 * Called ~1/min by the shell-mounted <Heartbeat/> while a user has an authenticated tab open. Touches
 * `User.lastSeenAt`; `getProfile` derives `online = showOnlineStatus && lastSeenAt within ONLINE_WINDOW`.
 *
 * Fire-and-forget by contract: unauthenticated → no-op (never redirects/throws), and any write error is
 * swallowed so a failed ping can never surface to the user. Self-hosted; no third-party dependency.
 */
export async function heartbeat(): Promise<void> {
  const session = await getSession()
  if (!session) return // unauthenticated → no-op (no write, no redirect)

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastSeenAt: new Date() },
    })
  } catch {
    // swallow — presence is best-effort; a failed heartbeat must not disrupt the user
  }
}
