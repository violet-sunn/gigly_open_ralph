'use server';

import { prisma } from '@/lib/prisma';

type NotificationType = 'MESSAGE' | 'APPLICATION' | 'STATUS_CHANGE' | 'PAYMENT';

interface NotificationData {
  userId: string;
  gigId: string;
  type: NotificationType;
  eventType: string | null;
  eventData: string | null;
}

/**
 * Record a notification event, fire-and-forget (errors are logged, never thrown, so they can't block the main action).
 *
 * The schema keeps ONE row per (userId, gigId) — `@@unique([userId, gigId])`, with `updatedAt`/`lastReadAt` — so a gig
 * carries a single "latest activity" notification per viewer. This is an UPSERT: the first event inserts, every later
 * event UPDATES that row in place (previously a plain `create()` threw a unique-constraint error on the 2nd event and
 * the notification was silently dropped). On update we bump `createdAt` to the new event time — that is the field the
 * bell reads as the notification's timestamp AND compares against `lastReadAt` to decide unread, so bumping it both
 * re-surfaces the gig and refreshes the shown time. We deliberately bump `createdAt` (not rely on `updatedAt`): unlike
 * `updatedAt`, it does NOT change when `markNotificationAsRead` writes `lastReadAt`, so there is no read/write
 * timestamp race. `lastReadAt` is left untouched here because it is shared with message read-tracking.
 */
export async function createNotification(
  userId: string,
  gigId: string,
  type: NotificationType,
  eventType: string | null,
  eventData: Record<string, any> | null
): Promise<void> {
  try {
    const fields = {
      type,
      eventType,
      eventData: eventData ? JSON.stringify(eventData) : null,
    };
    await prisma.notification.upsert({
      where: { userId_gigId: { userId, gigId } },
      create: { userId, gigId, ...fields },
      update: { ...fields, createdAt: new Date() },
    });
  } catch (error) {
    console.error('[createNotification] Failed to create notification:', {
      userId,
      gigId,
      type,
      eventType,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Record several notification events at once (e.g. auto-rejecting the other applicants when one is accepted).
 *
 * Same one-row-per-(userId, gigId) contract as `createNotification`, so this is a batch of UPSERTs in one transaction
 * — NOT `createMany`, which cannot upsert: it would throw (or, with skipDuplicates, silently drop) whenever a
 * recipient already had a notification for that gig. Each recipient is a distinct user here, but a recipient may
 * already hold a notification for the gig (e.g. an earlier message), so per-item upsert is required for correctness.
 */
export async function createNotificationsBulk(
  notifications: NotificationData[]
): Promise<void> {
  if (notifications.length === 0) return;
  try {
    await prisma.$transaction(
      notifications.map((n) => {
        const fields = { type: n.type, eventType: n.eventType, eventData: n.eventData };
        return prisma.notification.upsert({
          where: { userId_gigId: { userId: n.userId, gigId: n.gigId } },
          create: { userId: n.userId, gigId: n.gigId, ...fields },
          update: { ...fields, createdAt: new Date() },
        });
      })
    );
  } catch (error) {
    console.error('[createNotificationsBulk] Failed to create notifications:', {
      count: notifications.length,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
