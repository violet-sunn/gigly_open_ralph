import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getTestPrismaClient } from '../helpers/db';
import { createTestUser, createTestGig } from '../helpers/seed';
import { withAuthContext } from '../helpers/auth';
import {
  createNotification,
  createNotificationsBulk,
} from '@/lib/notifications';
import {
  getNotificationDisplayText,
  getNotificationIcon,
} from '@/lib/notification-utils';

// Mock @/lib/prisma to use test database
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient();
  },
}));

describe('Notification Helpers', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>;

  beforeEach(() => {
    prisma = getTestPrismaClient();
  });

  describe('createNotification', () => {
    it('creates notification with all fields', async () => {
      const user = await createTestUser(prisma, { role: 'CLIENT' });
      const gig = await createTestGig(prisma, { clientId: user.id });

      await createNotification(
        user.id,
        gig.id,
        'APPLICATION',
        'application_submitted',
        { specialistId: 'spec-789', specialistName: 'John Doe' }
      );

      const notification = await prisma.notification.findFirst({
        where: { userId: user.id, gigId: gig.id },
      });

      expect(notification).toBeDefined();
      expect(notification!.type).toBe('APPLICATION');
      expect(notification!.eventType).toBe('application_submitted');
      expect(notification!.eventData).toContain('spec-789');
    });

    it('handles errors gracefully without throwing', async () => {
      // Invalid IDs should not throw
      await expect(
        createNotification('invalid-user', 'invalid-gig', 'MESSAGE', null, null)
      ).resolves.not.toThrow();
    });

    it('creates notification with null eventData', async () => {
      const user = await createTestUser(prisma, { role: 'CLIENT' });
      const gig = await createTestGig(prisma, { clientId: user.id });

      await createNotification(user.id, gig.id, 'MESSAGE', null, null);

      const notification = await prisma.notification.findFirst({
        where: { userId: user.id, gigId: gig.id },
      });

      expect(notification).toBeDefined();
      expect(notification!.type).toBe('MESSAGE');
      expect(notification!.eventType).toBeNull();
      expect(notification!.eventData).toBeNull();
    });
  });

  describe('createNotificationsBulk', () => {
    it('creates multiple notifications in one operation', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const specialist3 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id });

      const notifications = [
        {
          userId: specialist1.id,
          gigId: gig.id,
          type: 'APPLICATION' as const,
          eventType: 'application_rejected',
          eventData: null,
        },
        {
          userId: specialist2.id,
          gigId: gig.id,
          type: 'APPLICATION' as const,
          eventType: 'application_rejected',
          eventData: null,
        },
        {
          userId: specialist3.id,
          gigId: gig.id,
          type: 'APPLICATION' as const,
          eventType: 'application_rejected',
          eventData: null,
        },
      ];

      await createNotificationsBulk(notifications);

      const created = await prisma.notification.findMany({
        where: { gigId: gig.id },
      });

      expect(created).toHaveLength(3);
      expect(created.every((n) => n.eventType === 'application_rejected')).toBe(true);
    });

    it('handles errors gracefully without throwing', async () => {
      const invalidNotifications = [
        {
          userId: 'invalid',
          gigId: 'invalid',
          type: 'MESSAGE' as const,
          eventType: null,
          eventData: null,
        },
      ];

      await expect(createNotificationsBulk(invalidNotifications)).resolves.not.toThrow();
    });

    it('skips duplicates when specified', async () => {
      const user = await createTestUser(prisma, { role: 'CLIENT' });
      const gig = await createTestGig(prisma, { clientId: user.id });

      // Create first notification
      await createNotification(user.id, gig.id, 'MESSAGE', null, null);

      // Try to create duplicate via bulk
      const notifications = [
        {
          userId: user.id,
          gigId: gig.id,
          type: 'MESSAGE' as const,
          eventType: null,
          eventData: null,
        },
      ];

      await createNotificationsBulk(notifications);

      const created = await prisma.notification.findMany({
        where: { userId: user.id, gigId: gig.id },
      });

      // Should still be 1 due to unique constraint and skipDuplicates
      expect(created).toHaveLength(1);
    });
  });

  describe('getNotificationDisplayText', () => {
    it('returns correct text for application_submitted', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_submitted',
        eventData: JSON.stringify({ specialistName: 'John Doe' }),
      });
      expect(text).toContain('Новая заявка от John Doe');
    });

    it('returns correct text for application_accepted', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_accepted',
        eventData: null,
      });
      expect(text).toContain('Ваша заявка принята');
    });

    it('returns correct text for application_rejected', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_rejected',
        eventData: null,
      });
      expect(text).toContain('Ваша заявка отклонена');
    });

    it('returns correct text for application_withdrawn', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_withdrawn',
        eventData: JSON.stringify({ specialistName: 'Jane Smith' }),
      });
      expect(text).toContain('Jane Smith отозвал(а) заявку');
    });

    it('returns correct text for work_submitted', () => {
      const text = getNotificationDisplayText({
        type: 'STATUS_CHANGE',
        eventType: 'work_submitted',
        eventData: null,
      });
      expect(text).toContain('Работа отправлена на проверку');
    });

    it('returns correct text for work_approved', () => {
      const text = getNotificationDisplayText({
        type: 'STATUS_CHANGE',
        eventType: 'work_approved',
        eventData: null,
      });
      expect(text).toContain('Ваша работа принята');
    });

    it('returns correct text for payment_marked', () => {
      const text = getNotificationDisplayText({
        type: 'STATUS_CHANGE',
        eventType: 'payment_marked',
        eventData: null,
      });
      expect(text).toContain('Оплата отмечена');
    });

    it('handles MESSAGE type for backward compatibility', () => {
      const text = getNotificationDisplayText({
        type: 'MESSAGE',
        eventType: null,
        eventData: null,
      });
      expect(text).toContain('Новое сообщение');
    });

    it('handles missing type field (backward compatibility)', () => {
      const text = getNotificationDisplayText({
        type: '',
        eventType: null,
        eventData: null,
      });
      expect(text).toContain('Новое сообщение');
    });

    it('handles invalid JSON in eventData gracefully', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_submitted',
        eventData: 'invalid json {',
      });
      expect(text).toContain('Новая заявка от специалиста');
    });

    it('falls back to «Специалист отозвал(а) заявку» when specialistName is absent', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'application_withdrawn',
        eventData: null,
      });
      expect(text).toBe('Специалист отозвал(а) заявку');
    });

    it('returns «Обновление по заявке» for an unknown APPLICATION eventType', () => {
      const text = getNotificationDisplayText({
        type: 'APPLICATION',
        eventType: 'some_future_event',
        eventData: null,
      });
      expect(text).toBe('Обновление по заявке');
    });

    it('returns «Статус гига обновлён» for an unknown STATUS_CHANGE eventType', () => {
      const text = getNotificationDisplayText({
        type: 'STATUS_CHANGE',
        eventType: 'some_future_status',
        eventData: null,
      });
      expect(text).toBe('Статус гига обновлён');
    });

    it('keeps «Условия гига обновлены» for gig_updated (already Russian, unchanged)', () => {
      const text = getNotificationDisplayText({
        type: 'STATUS_CHANGE',
        eventType: 'gig_updated',
        eventData: null,
      });
      expect(text).toBe('Условия гига обновлены');
    });

    it('returns «Оплата отмечена» for PAYMENT type', () => {
      const text = getNotificationDisplayText({
        type: 'PAYMENT',
        eventType: 'payment_marked',
        eventData: null,
      });
      expect(text).toBe('Оплата отмечена');
    });
  });

  describe('getNotificationIcon', () => {
    it('returns correct icon for APPLICATION type', () => {
      expect(getNotificationIcon('APPLICATION')).toBe('📝');
    });

    it('returns correct icon for STATUS_CHANGE type', () => {
      expect(getNotificationIcon('STATUS_CHANGE')).toBe('🔄');
    });

    it('returns correct icon for MESSAGE type', () => {
      expect(getNotificationIcon('MESSAGE')).toBe('💬');
    });

    it('returns default icon for unknown type', () => {
      expect(getNotificationIcon('UNKNOWN')).toBe('💬');
    });
  });
});
