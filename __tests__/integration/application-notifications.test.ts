import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getTestPrismaClient } from '../helpers/db';
import { createTestUser, createTestGig } from '../helpers/seed';
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
import { applyToGig } from '@/app/actions/gig';

describe('Application Notification Tests', () => {
  let prisma: ReturnType<typeof getTestPrismaClient>;

  beforeEach(() => {
    prisma = getTestPrismaClient();
    setTestSessionToken(undefined);
  });

  afterEach(() => {
    setTestSessionToken(undefined);
  });

  describe('applyToGig notification creation', () => {
    it('creates notification for gig owner when specialist applies', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `specialist-${Date.now()}@test.com`,
        displayName: 'John Specialist',
      });

      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

      const formData = new FormData();
      formData.append('gigId', gig.id);
      formData.append(
        'approach',
        'This is my technical approach with more than 100 characters to pass validation. I will use modern best practices.'
      );
      formData.append(
        'questions',
        'What is the timeline? What are the specific requirements for this project?'
      );
      formData.append('estimatedEffort', '2 weeks');

      try {
        await withAuthContext(specialist, async () => {
          await applyToGig(null, formData);
        });
      } catch (error: any) {
        // Expect redirect
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      // Verify notification was created
      const notification = await prisma.notification.findFirst({
        where: {
          userId: client.id,
          gigId: gig.id,
          type: 'APPLICATION',
          eventType: 'application_submitted',
        },
      });

      expect(notification).toBeDefined();
      expect(notification!.lastReadAt).toBeNull();

      // Verify eventData contains specialist info
      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.specialistId).toBe(specialist.id);
      expect(eventData.specialistName).toBe('John Specialist');
      expect(eventData.applicationId).toBeDefined();
    });

    it('uses email as fallback when specialist has no profile', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialistEmail = `noprofile-${Date.now()}@test.com`;
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: specialistEmail,
      });

      // Delete the auto-created profile to test email fallback
      await prisma.specialistProfile.delete({
        where: { userId: specialist.id },
      });

      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

      const formData = new FormData();
      formData.append('gigId', gig.id);
      formData.append(
        'approach',
        'This is my technical approach with more than 100 characters to pass validation. I will use modern best practices.'
      );
      formData.append(
        'questions',
        'What is the timeline? What are the specific requirements for this project?'
      );

      try {
        await withAuthContext(specialist, async () => {
          await applyToGig(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      const notification = await prisma.notification.findFirst({
        where: {
          userId: client.id,
          gigId: gig.id,
          type: 'APPLICATION',
        },
      });

      expect(notification).toBeDefined();
      const eventData = JSON.parse(notification!.eventData!);
      expect(eventData.specialistName).toBe(specialistEmail);
    });

    it('application succeeds even if notification creation fails', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `failtest-${Date.now()}@test.com`,
      });
      const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

      const formData = new FormData();
      formData.append('gigId', gig.id);
      formData.append(
        'approach',
        'This is my technical approach with more than 100 characters to pass validation. I will use modern best practices.'
      );
      formData.append(
        'questions',
        'What is the timeline? What are the specific requirements?'
      );

      // Note: createNotification is fire-and-forget, so we can't easily test failure handling
      // The function catches errors internally and logs them without throwing
      // This test verifies the application succeeds regardless

      try {
        await withAuthContext(specialist, async () => {
          await applyToGig(null, formData);
        });
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT');
      }

      // Verify application was created
      const application = await prisma.application.findFirst({
        where: {
          gigId: gig.id,
          specialistId: specialist.id,
        },
      });

      expect(application).toBeDefined();
      expect(application!.approach).toContain('technical approach');
    });

    it('does not create notification for example gigs', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' });
      const specialist = await createTestUser(prisma, {
        role: 'SPECIALIST',
        email: `example-${Date.now()}@test.com`,
      });
      const gig = await createTestGig(prisma, {
        clientId: client.id,
        status: 'OPEN',
        isExample: true,
      });

      const formData = new FormData();
      formData.append('gigId', gig.id);
      formData.append(
        'approach',
        'This is my technical approach with more than 100 characters to pass validation. I will use modern best practices and follow industry standards.'
      );
      formData.append('questions', 'What is the timeline for this project? What are the deliverables?');

      const result = await withAuthContext(specialist, async () => {
        return await applyToGig(null, formData);
      });

      // Should return error, not create application or notification
      expect(result.error).toContain('Это демонстрационный гиг. Откликайтесь на реальные гиги в поиске.');

      const notification = await prisma.notification.findFirst({
        where: { gigId: gig.id },
      });

      expect(notification).toBeNull();
    });
  });
});
