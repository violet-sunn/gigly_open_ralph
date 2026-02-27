import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getTestPrismaClient } from '../helpers/db';
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed';
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth';

// Mock @/lib/prisma to use test database
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient();
  },
}));

// Mock next/headers for session cookie management
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken();
        return token ? { value: token } : undefined;
      }
      return undefined;
    },
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

// Import after mocks
import { acceptApplication, rejectApplication } from '@/app/actions/gig';

describe('Application Status Notification Tests', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>;

  beforeEach(() => {
    prisma = getTestPrismaClient();
    setTestSessionToken(undefined);
  });

  afterEach(() => {
    setTestSessionToken(undefined);
  });

  describe('acceptApplication notification creation', () => {
    it('creates notification for accepted specialist', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
      });

      const formData = new FormData();
      formData.append('applicationId', application.id);

      try {
        await withAuthContext(client, async () => {
          await acceptApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: specialist.id,
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_accepted',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.applicationId).toBe(application.id);
    });

    it('creates notifications for all auto-rejected specialists', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const specialist3 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

      const app1 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist1.id,
      });
      const app2 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist2.id,
      });
      const app3 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist3.id,
      });

      const formData = new FormData();
      formData.append('applicationId', app1.id);

      try {
        await withAuthContext(client, async () => {
          await acceptApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      // Check accepted notification
      const acceptedNotification = await prisma.notification.findFirst({
        where: {
          userId: specialist1.id,
          gigId: gig.id,
          eventType: 'application_accepted',
        },
      });
      expect(acceptedNotification).toBeDefined();

      // Check rejected notifications
      const rejectedNotifications = await prisma.notification.findMany({
        where: {
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_rejected',
        },
      });

      expect(rejectedNotifications).toHaveLength(2);
      const rejectedUserIds = rejectedNotifications.map((n) => n.userId);
      expect(rejectedUserIds).toContain(specialist2.id);
      expect(rejectedUserIds).toContain(specialist3.id);
      expect(rejectedUserIds).not.toContain(specialist1.id);
    });

    it('does not create rejected notifications when no other pending applications', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
      });

      const formData = new FormData();
      formData.append('applicationId', application.id);

      try {
        await withAuthContext(client, async () => {
          await acceptApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const rejectedNotifications = await prisma.notification.findMany({
        where: {
          gigId: gig.id,
          eventType: 'application_rejected',
        },
      });

      expect(rejectedNotifications).toHaveLength(0);
    });
  });

  describe('rejectApplication notification creation', () => {
    it('creates notification for rejected specialist', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
      });

      const formData = new FormData();
      formData.append('applicationId', application.id);

      try {
        await withAuthContext(client, async () => {
          await rejectApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: specialist.id,
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_rejected',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.applicationId).toBe(application.id);
    });

    it('only creates notification for the rejected specialist', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

      const app1 = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist1.id,
      });
      await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist2.id,
      });

      const formData = new FormData();
      formData.append('applicationId', app1.id);

      try {
        await withAuthContext(client, async () => {
          await rejectApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notifications = await prisma.notification.findMany({
        where: {
          gigId: gig.id,
          eventType: 'application_rejected',
        },
      });

      expect(notifications).toHaveLength(1);
      expect(notifications[0].userId).toBe(specialist1.id);
    });
  });
});
