'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getNotificationDisplayText, getNotificationIcon } from '@/lib/notification-utils';

export async function getUnreadNotifications() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const userId = session.userId;

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
          displayText = 'New message';
          icon = getNotificationIcon('MESSAGE');
          notificationType = 'MESSAGE';
        }
      }
    }

    // Check for unread non-message notifications
    if (notification && (!notification.lastReadAt || notification.createdAt > (notification.lastReadAt || new Date(0)))) {
      // If notification type is not MESSAGE, or if it's more recent than messages
      if (notification.type && notification.type !== 'MESSAGE') {
        const notificationIsUnread = !notification.lastReadAt;

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
            // Count this notification plus any unread messages
            unreadCount = 1 + (unreadCount || 0);
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

  // Sort by most recent
  return unreadNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getUnreadCount() {
  const notifications = await getUnreadNotifications();
  return { count: notifications.length };
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
    return { error: 'Gig not found.' };
  }

  // Check authorization: user must be gig owner OR assigned specialist
  const isAuthorized =
    gig.clientId === userId || gig.assignedSpecialistId === userId;

  if (!isAuthorized) {
    return { error: 'You are not authorized to mark this notification as read.' };
  }

  // Upsert notification record
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
    },
    update: {
      lastReadAt: new Date(),
    },
  });

  return {};
}
