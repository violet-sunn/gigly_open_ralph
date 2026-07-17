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
        return `Новая заявка от ${data.specialistName || 'специалиста'}`;
      case 'application_accepted':
        return 'Ваша заявка принята';
      case 'application_rejected':
        return 'Ваша заявка отклонена';
      case 'application_withdrawn':
        return `${data.specialistName || 'Специалист'} отозвал(а) заявку`;
      default:
        return 'Обновление по заявке';
    }
  }

  // PAYMENT notifications (DATA-MODEL payment type)
  if (type === 'PAYMENT') {
    return 'Оплата отмечена';
  }

  // STATUS_CHANGE notifications
  if (type === 'STATUS_CHANGE') {
    switch (eventType) {
      case 'work_submitted':
        return 'Работа отправлена на проверку';
      case 'work_approved':
        return 'Ваша работа принята';
      case 'work_returned':
        // requestRevision: the client sent the work back. Without this case it fell through to the generic default
        // and the specialist saw «Статус гига обновлён» with no hint they must redo something.
        return 'Работа возвращена на доработку';
      case 'payment_marked':
        return 'Оплата отмечена';
      case 'gig_updated':
        // gig-editing-with-notification: the owner edited an OPEN gig's terms; applicants who applied under the old
        // terms are told so they can re-evaluate. Russian to match the shipped app surface.
        return 'Условия гига обновлены';
      case 'dispute_opened':
        // The other party is told a dispute was raised. Previously generic → «никаких указаний на спор» (tester).
        return 'По гигу открыт спор';
      case 'dispute_resolved':
        return 'Спор по гигу разрешён';
      default:
        return 'Статус гига обновлён';
    }
  }

  // MESSAGE notifications (default/backward compatibility)
  return 'Новое сообщение';
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
