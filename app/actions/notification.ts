'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getNotificationDisplayText, getNotificationIcon } from '@/lib/notification-utils';
import { getPreferences, DEFAULT_PREFERENCES } from '@/lib/preferences';

export async function getUnreadNotifications() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const userId = session.userId;

  // The user's notification preferences (settings → «Уведомления»). Gating is applied at DISPLAY time below (not at
  // creation), so toggling a type back on instantly restores it — no notification rows are ever dropped.
  const prefs = (await getPreferences(userId)) ?? DEFAULT_PREFERENCES;

  // Get all gigs where user is owner OR assigned specialist
  const gigs = await prisma.gig.findMany({
    where: {
      OR: [
        { clientId: userId },
        { assignedSpecialistId: userId },
      ],
      closedByAdmin: false,
    },
    include: {
      messages: {
        where: { senderId: { not: userId } },
        orderBy: { createdAt: 'desc' },
      },
      notifications: {
        where: { userId },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const unreadNotifications: any[] = [];

  for (const gig of gigs) {
    const notification = gig.notifications[0]; // Most recent notification for this user-gig pair

    // Determine if there's anything unread for this gig
    let hasUnread = false;
    let mostRecentTimestamp: Date | null = null;
    let displayText = '';
    let icon = '💬';
    let unreadCount = 0;
    let notificationType = 'MESSAGE';
    let eventType: string | null = null;

    // Check for unread messages (backward compatibility)
    if (gig.messages.length > 0) {
      const hasMessagesFromOthers = gig.messages.length > 0;

      if (hasMessagesFromOthers) {
        if (!notification || !notification.lastReadAt) {
          // Never read or no notification record
          hasUnread = true;
          unreadCount = gig.messages.length;
          mostRecentTimestamp = gig.messages[0].createdAt;
        } else {
          // Check if there are messages after lastReadAt
          const unreadMessages = gig.messages.filter(
            (msg) => msg.createdAt > notification.lastReadAt!
          );
          if (unreadMessages.length > 0) {
            hasUnread = true;
            unreadCount = unreadMessages.length;
            mostRecentTimestamp = unreadMessages[0].createdAt;
          }
        }

        if (hasUnread) {
          displayText = 'Новое сообщение';
          icon = getNotificationIcon('MESSAGE');
          notificationType = 'MESSAGE';
        }
      }
    }

    // Check for unread non-message notifications
    if (notification && (!notification.lastReadAt || notification.createdAt > (notification.lastReadAt || new Date(0)))) {
      // If notification type is not MESSAGE, or if it's more recent than messages
      if (notification.type && notification.type !== 'MESSAGE') {
        // Unread when never read, OR when a newer event has bumped `createdAt` past the last read (createNotification
        // upserts one row per gig and bumps createdAt per event). Without the second clause a new lifecycle event on an
        // already-opened gig would never re-surface in the bell.
        const notificationIsUnread =
          !notification.lastReadAt || notification.createdAt > notification.lastReadAt;

        if (notificationIsUnread) {
          // Use this notification's display info
          displayText = getNotificationDisplayText({
            type: notification.type,
            eventType: notification.eventType,
            eventData: notification.eventData,
          });
          icon = getNotificationIcon(notification.type);
          notificationType = notification.type;
          eventType = notification.eventType;

          if (!mostRecentTimestamp || notification.createdAt > mostRecentTimestamp) {
            mostRecentTimestamp = notification.createdAt;
            hasUnread = true;
            // Count EVERY unread lifecycle event on this gig (not just 1), plus any unread messages. `unreadEvents`
            // accumulates one per event since the last read; a row created before this column existed defaults to 0,
            // so floor at 1 while it is unread rather than under-counting a real event to zero.
            const eventCount = Math.max(notification.unreadEvents ?? 0, 1);
            unreadCount = eventCount + (unreadCount || 0);
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
      });
    }
  }

  // Respect the user's notification preferences (in-app/bell gating). Types without a settings toggle (PAYMENT) and the
  // two with no event source yet (notifyPlatformNews/notifyNewGigs) are unaffected — they fall through to `true`.
  const typeEnabled = (type: string): boolean => {
    switch (type) {
      case 'MESSAGE': return prefs.notifyMessages;
      case 'APPLICATION': return prefs.notifyApplications;
      case 'STATUS_CHANGE': return prefs.notifyStatusChanges;
      case 'PAYMENT': return prefs.notifyPayments;
      default: return true;
    }
  };

  // Sort by most recent
  return unreadNotifications
    .filter((n) => typeEnabled(n.type))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getUnreadCount() {
  const notifications = await getUnreadNotifications();
  // The bell badge counts unread EVENTS, not gigs: sum each gig's unreadCount (unread messages + accumulated lifecycle
  // events) so a second event on an already-unread gig still moves the number. Counting gigs (`.length`) was the root
  // of «второе событие по гигу не меняет счётчик → кажется, что не пришло».
  return { count: notifications.reduce((sum, n) => sum + (n.unreadCount || 0), 0) };
}

export async function markNotificationAsRead(gigId: string) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const userId = session.userId;

  // Verify gig exists and user is authorized
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: {
      clientId: true,
      assignedSpecialistId: true,
    },
  });

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' };
  }

  // Check authorization: user must be gig owner OR assigned specialist
  const isAuthorized =
    gig.clientId === userId || gig.assignedSpecialistId === userId;

  if (!isAuthorized) {
    return { error: 'Недостаточно прав, чтобы отметить это уведомление прочитанным.' };
  }

  // Upsert notification record. Reading the gig clears the unread-event count so the bell badge drops accordingly.
  await prisma.notification.upsert({
    where: {
      userId_gigId: {
        userId,
        gigId,
      },
    },
    create: {
      userId,
      gigId,
      lastReadAt: new Date(),
      unreadEvents: 0,
    },
    update: {
      lastReadAt: new Date(),
      unreadEvents: 0,
    },
  });

  return {};
}
