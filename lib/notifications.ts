'use server';

import { prisma } from '@/lib/prisma';

type NotificationType = 'MESSAGE' | 'APPLICATION' | 'STATUS_CHANGE';

interface NotificationData {
  userId: string;
  gigId: string;
  type: NotificationType;
  eventType: string | null;
  eventData: string | null;
}

/**
 * Create a single notification with fire-and-forget error handling.
 * Errors are logged but do not throw to prevent blocking main operations.
 */
export async function createNotification(
  userId: string,
  gigId: string,
  type: NotificationType,
  eventType: string | null,
  eventData: Record<string, any> | null
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        gigId,
        type,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
      },
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
 * Create multiple notifications in a single batch operation for performance.
 * Use this for bulk operations like auto-rejecting multiple applications.
 */
export async function createNotificationsBulk(
  notifications: NotificationData[]
): Promise<void> {
  try {
    await prisma.notification.createMany({
      data: notifications,
    });
  } catch (error) {
    console.error('[createNotificationsBulk] Failed to create notifications:', {
      count: notifications.length,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
