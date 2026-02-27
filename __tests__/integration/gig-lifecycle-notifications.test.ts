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
import { withdrawApplication, submitWork, approveWork, markAsPaid } from '@/app/actions/gig';

describe('Gig Lifecycle Notification Tests', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>;

  beforeEach(() => {
    prisma = getTestPrismaClient();
    setTestSessionToken(undefined);
  });

  afterEach(() => {
    setTestSessionToken(undefined);
  });

  describe('withdrawApplication notification creation', () => {
    it('creates notification for gig owner when specialist withdraws', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        displayName: 'Jane Specialist',
      });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
      const application = await createTestApplication(prisma, {
        gigId: gig.id,
        specialistId: specialist.id,
        status: 'PENDING',
      });

      const formData = new FormData();
      formData.append('applicationId', application.id);

      try {
        await withAuthContext(specialist, async () => {
          await withdrawApplication(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: client.id,
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_withdrawn',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.specialistId).toBe(specialist.id);
      expect(eventData.specialistName).toBe('Jane Specialist');
      expect(eventData.applicationId).toBe(application.id);
    });
  });

  describe('submitWork notification creation', () => {
    it('creates notification for gig owner when work is submitted', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS',
      });

      const formData = new FormData();
      formData.append('gigId', gig.id);

      try {
        await withAuthContext(specialist, async () => {
          await submitWork(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: client.id,
          gigId: gig.id,
          type: 'STATUS_CHANGE',
          eventType: 'work_submitted',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.specialistId).toBe(specialist.id);
    });
  });

  describe('approveWork notification creation', () => {
    it('creates notification for specialist when work is approved', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'REVIEW',
      });

      const formData = new FormData();
      formData.append('gigId', gig.id);

      try {
        await withAuthContext(client, async () => {
          await approveWork(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: specialist.id,
          gigId: gig.id,
          type: 'STATUS_CHANGE',
          eventType: 'work_approved',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.clientId).toBe(client.id);
    });
  });

  describe('markAsPaid notification creation', () => {
    it('creates notification for specialist when payment is marked', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'COMPLETED',
      });

      const formData = new FormData();
      formData.append('gigId', gig.id);

      try {
        await withAuthContext(client, async () => {
          await markAsPaid(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: specialist.id,
          gigId: gig.id,
          type: 'STATUS_CHANGE',
          eventType: 'payment_marked',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.clientId).toBe(client.id);
      expect(eventData.paidAt).toBeDefined();
    });
  });
});
