'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { listUnreadNotifications, unreadTotal } from '@/lib/notifications-read';
import { emitNotificationChange } from '@/lib/notification-bus';

export async function getUnreadNotifications() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return listUnreadNotifications(session.userId);
}

export async function getUnreadCount() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  // The bell badge counts unread EVENTS, not gigs: sum each gig's unreadCount (unread messages + accumulated lifecycle
  // events) so a second event on an already-unread gig still moves the number.
  return { count: unreadTotal(await listUnreadNotifications(session.userId)) };
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

  // Push the dropped count to this user's open tabs (the shell that isn't the one that read it) in real time.
  emitNotificationChange(userId);

  return {};
}
