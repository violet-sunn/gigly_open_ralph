import { prisma } from '@/lib/prisma'
import { getNotificationDisplayText, getNotificationIcon } from '@/lib/notification-utils'
import { getPreferences, DEFAULT_PREFERENCES } from '@/lib/preferences'

/**
 * The read model behind the bell — moved out of `app/actions/notification.ts` so it can be called with an explicit
 * `userId` from BOTH the server action (session-bound) and the SSE stream (`app/api/live`, which computes counts for
 * the connected user on each bus event). A `'use server'` file cannot export a plain (non-action) helper, hence this
 * plain module. Behaviour is unchanged from the previous inline action body.
 */
export interface UnreadNotification {
  gigId: string
  gigTitle: string
  displayText: string
  icon: string
  timestamp: Date
  unreadCount: number
  type: string
  eventType: string | null
}

export async function listUnreadNotifications(userId: string): Promise<UnreadNotification[]> {
  // The user's notification preferences (settings → «Уведомления»). Gating is applied at DISPLAY time below (not at
  // creation), so toggling a type back on instantly restores it — no notification rows are ever dropped.
  const prefs = (await getPreferences(userId)) ?? DEFAULT_PREFERENCES

  // Gigs where the user is owner OR assigned specialist.
  const gigs = await prisma.gig.findMany({
    where: {
      OR: [{ clientId: userId }, { assignedSpecialistId: userId }],
      closedByAdmin: false,
    },
    include: {
      messages: { where: { senderId: { not: userId } }, orderBy: { createdAt: 'desc' } },
      notifications: { where: { userId }, orderBy: { createdAt: 'desc' } },
    },
  })

  const unreadNotifications: UnreadNotification[] = []

  for (const gig of gigs) {
    const notification = gig.notifications[0] // most recent notification for this user-gig pair

    let hasUnread = false
    let mostRecentTimestamp: Date | null = null
    let displayText = ''
    let icon = '💬'
    let unreadCount = 0
    let notificationType = 'MESSAGE'
    let eventType: string | null = null

    // Unread messages (from others).
    if (gig.messages.length > 0) {
      if (!notification || !notification.lastReadAt) {
        hasUnread = true
        unreadCount = gig.messages.length
        mostRecentTimestamp = gig.messages[0].createdAt
      } else {
        const unreadMessages = gig.messages.filter((msg) => msg.createdAt > notification.lastReadAt!)
        if (unreadMessages.length > 0) {
          hasUnread = true
          unreadCount = unreadMessages.length
          mostRecentTimestamp = unreadMessages[0].createdAt
        }
      }
      if (hasUnread) {
        displayText = 'Новое сообщение'
        icon = getNotificationIcon('MESSAGE')
        notificationType = 'MESSAGE'
      }
    }

    // Unread non-message notifications.
    if (notification && (!notification.lastReadAt || notification.createdAt > (notification.lastReadAt || new Date(0)))) {
      if (notification.type && notification.type !== 'MESSAGE') {
        const notificationIsUnread = !notification.lastReadAt || notification.createdAt > notification.lastReadAt
        if (notificationIsUnread) {
          displayText = getNotificationDisplayText({
            type: notification.type,
            eventType: notification.eventType,
            eventData: notification.eventData,
          })
          icon = getNotificationIcon(notification.type)
          notificationType = notification.type
          eventType = notification.eventType

          if (!mostRecentTimestamp || notification.createdAt > mostRecentTimestamp) {
            mostRecentTimestamp = notification.createdAt
            hasUnread = true
            // Count EVERY unread lifecycle event on this gig (not just 1), plus any unread messages. `unreadEvents`
            // accumulates one per event since the last read; a row created before this column existed defaults to 0,
            // so floor at 1 while it is unread rather than under-counting a real event to zero.
            const eventCount = Math.max(notification.unreadEvents ?? 0, 1)
            unreadCount = eventCount + (unreadCount || 0)
          }
        }
      }
    }

    if (hasUnread && mostRecentTimestamp) {
      unreadNotifications.push({
        gigId: gig.id,
        gigTitle: gig.title,
        displayText,
        icon,
        timestamp: mostRecentTimestamp,
        unreadCount,
        type: notificationType,
        eventType,
      })
    }
  }

  // Respect the user's notification preferences (in-app/bell gating). Types without a settings toggle (PAYMENT) and the
  // two with no event source yet (notifyPlatformNews/notifyNewGigs) fall through to `true`.
  const typeEnabled = (type: string): boolean => {
    switch (type) {
      case 'MESSAGE':
        return prefs.notifyMessages
      case 'APPLICATION':
        return prefs.notifyApplications
      case 'STATUS_CHANGE':
        return prefs.notifyStatusChanges
      case 'PAYMENT':
        return prefs.notifyPayments
      default:
        return true
    }
  }

  return unreadNotifications
    .filter((n) => typeEnabled(n.type))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

/** The bell badge number: total unread ITEMS (accumulated lifecycle events + unread messages), summed across gigs. */
export function unreadTotal(list: UnreadNotification[]): number {
  return list.reduce((sum, n) => sum + (n.unreadCount || 0), 0)
}
