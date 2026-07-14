/**
 * Utility functions for notification formatting and display.
 * These are pure functions that can be used on both client and server.
 */

/**
 * Get formatted display text for a notification based on its type and event.
 */
export function getNotificationDisplayText(notification: {
  type: string;
  eventType: string | null;
  eventData: string | null;
}): string {
  const type = notification.type || 'MESSAGE';
  const eventType = notification.eventType;

  // Parse eventData if present
  let data: Record<string, any> = {};
  if (notification.eventData) {
    try {
      data = JSON.parse(notification.eventData);
    } catch {
      // Ignore parse errors
    }
  }

  // APPLICATION notifications
  if (type === 'APPLICATION') {
    switch (eventType) {
      case 'application_submitted':
        return `New application from ${data.specialistName || 'a specialist'}`;
      case 'application_accepted':
        return 'Your application was accepted';
      case 'application_rejected':
        return 'Your application was not accepted';
      case 'application_withdrawn':
        return `${data.specialistName || 'A specialist'} withdrew their application`;
      default:
        return 'New application update';
    }
  }

  // PAYMENT notifications (DATA-MODEL payment type)
  if (type === 'PAYMENT') {
    return 'Payment has been marked as paid';
  }

  // STATUS_CHANGE notifications
  if (type === 'STATUS_CHANGE') {
    switch (eventType) {
      case 'work_submitted':
        return 'Work submitted for review';
      case 'work_approved':
        return 'Your work was approved';
      case 'payment_marked':
        return 'Payment has been marked as paid';
      case 'gig_updated':
        // gig-editing-with-notification: the owner edited an OPEN gig's terms; applicants who applied under the old
        // terms are told so they can re-evaluate. Russian to match the shipped app surface.
        return 'Условия гига обновлены';
      default:
        return 'Gig status updated';
    }
  }

  // MESSAGE notifications (default/backward compatibility)
  return 'New message';
}

/**
 * Get appropriate icon/emoji for a notification type.
 */
export function getNotificationIcon(type: string): string {
  switch (type) {
    case 'APPLICATION':
      return '📝';
    case 'STATUS_CHANGE':
      return '🔄';
    case 'PAYMENT':
      return '💰';
    case 'MESSAGE':
    default:
      return '💬';
  }
}
