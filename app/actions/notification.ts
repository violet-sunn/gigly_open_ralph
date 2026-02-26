'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

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
      assignedSpecialistId: { not: null }, // Must have assigned specialist for messages
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            include: {
              clientProfile: true,
              specialistProfile: true,
            },
          },
        },
      },
      notifications: {
        where: { userId },
      },
      client: {
        include: {
          clientProfile: true,
        },
      },
      assignedSpecialist: {
        include: {
          specialistProfile: true,
        },
      },
    },
  });

  // Filter gigs with unread messages
  const unreadNotifications = gigs
    .filter((gig) => {
      // Must have at least one message
      if (gig.messages.length === 0) return false;

      const lastMessage = gig.messages[0];

      // Exclude if all messages are from current user (no messages from others)
      const hasMessagesFromOthers = gig.messages.some(
        (msg) => msg.senderId !== userId
      );
      if (!hasMessagesFromOthers) return false;

      // Check if there are unread messages
      const notification = gig.notifications[0];
      if (!notification || !notification.lastReadAt) {
        // No notification record or never read = unread
        return true;
      }

      // Check if last message is after lastReadAt
      return lastMessage.createdAt > notification.lastReadAt;
    })
    .map((gig) => {
      const lastMessage = gig.messages[0];
      const senderName =
        lastMessage.sender.role === 'CLIENT'
          ? lastMessage.sender.clientProfile?.companyName ||
            lastMessage.sender.email
          : lastMessage.sender.specialistProfile?.displayName ||
            lastMessage.sender.email;

      // Count unread messages
      const notification = gig.notifications[0];
      const unreadCount = gig.messages.filter((msg) => {
        if (msg.senderId === userId) return false; // Don't count own messages
        if (!notification || !notification.lastReadAt) return true;
        return msg.createdAt > notification.lastReadAt;
      }).length;

      return {
        gigId: gig.id,
        gigTitle: gig.title,
        lastMessageSender: senderName,
        lastMessageTime: lastMessage.createdAt,
        unreadCount,
      };
    })
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

  return unreadNotifications;
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
