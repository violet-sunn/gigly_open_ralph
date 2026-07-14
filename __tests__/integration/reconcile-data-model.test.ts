import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, getTestSessionToken } from '../helpers/auth'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { getGigDetail, gigDisplayStatus } from '@/lib/view-models'
import { getDisputeDetail } from '@/lib/disputes'
import { seedCategories } from '@/lib/categories'
import { getNotificationDisplayText, getNotificationIcon } from '@/lib/notification-utils'
import { openDispute, resolveDispute } from '@/app/actions/dispute'

const fd = (obj: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(obj)) f.set(k, v)
  return f
}

describe('reconcile-data-model — under_review derived display status', () => {
  it('gigDisplayStatus: OPEN+apps → review, OPEN+0 → open, others map straight', () => {
    expect(gigDisplayStatus('OPEN', 0)).toBe('open')
    expect(gigDisplayStatus('OPEN', 2)).toBe('review')
    expect(gigDisplayStatus('IN_PROGRESS', 5)).toBe('in-progress')
    expect(gigDisplayStatus('REVIEW', 0)).toBe('verification')
  })

  it('getGigDetail header reflects applications (OPEN+app → review) without changing the stored status', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Тест' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const open0 = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    const openWithApp = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' })
    await createTestApplication(prisma, { gigId: openWithApp.id, specialistId: spec.id })

    const d0 = await getGigDetail(open0.id, { userId: client.id, role: 'CLIENT' })
    const d1 = await getGigDetail(openWithApp.id, { userId: client.id, role: 'CLIENT' })
    expect(d0!.header.status).toBe('open')
    expect(d1!.header.status).toBe('review')
    // stored status unchanged
    expect((await prisma.gig.findUnique({ where: { id: openWithApp.id } }))!.status).toBe('OPEN')
  })
})

describe('reconcile-data-model — Category.color', () => {
  it('seedCategories writes the pinned design hues', async () => {
    const prisma = getTestPrismaClient()
    await seedCategories()
    const cats = await prisma.category.findMany()
    const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.color]))
    expect(bySlug.marketing).toBe('blue')
    expect(bySlug.design).toBe('rose')
    expect(bySlug.programming).toBe('green')
    expect(bySlug.development).toBe('teal')
    expect(bySlug.coding).toBe('orange')
  })
})

describe('reconcile-data-model — payment notification', () => {
  it('PAYMENT type resolves payment text + icon', () => {
    expect(getNotificationDisplayText({ type: 'PAYMENT', eventType: 'payment_marked', eventData: null })).toBe('Оплата отмечена')
    expect(getNotificationIcon('PAYMENT')).toBe('💰')
  })
})

describe('reconcile-data-model — enriched Dispute + resolve flow', () => {
  async function assignedGig() {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT', companyName: 'ООО Спор' })
    const spec = await createTestUser(prisma, { role: 'SPECIALIST' })
    const gig = await createTestGig(prisma, {
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: spec.id,
      budget: 20000000,
    })
    return { prisma, client, spec, gig }
  }

  it('openDispute persists openerRole + frozen amount + normalized reason + an opening timeline entry', async () => {
    const { prisma, client, gig } = await assignedGig()
    await withAuthContext(client, async () => {
      await expect(
        openDispute(null, fd({ gigId: gig.id, reason: 'Результат не соответствует ТЗ', evidence: 'ТЗ.pdf' })),
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const d = await prisma.dispute.findFirst({ where: { gigId: gig.id }, include: { timeline: true } })
    expect(d!.openerRole).toBe('company')
    expect(d!.amount).toBe(20000000)
    expect(d!.reason).toBe('Результат не соответствует ТЗ')
    expect(d!.evidence).toBe('ТЗ.pdf')
  })

  it('a free-text reason normalizes to «Другое» and becomes the opening entry (backward compatible)', async () => {
    const { prisma, spec, gig } = await assignedGig()
    await withAuthContext(spec, async () => {
      await expect(
        openDispute(null, fd({ gigId: gig.id, reason: 'клиент пропал и не платит' })),
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const d = await prisma.dispute.findFirst({ where: { gigId: gig.id }, include: { timeline: true } })
    expect(d!.openerRole).toBe('specialist')
    expect(d!.reason).toBe('Другое')
    expect(d!.timeline.some((e) => e.text.includes('клиент пропал'))).toBe(true)
  })

  it('resolveDispute records the verdict + a closing moderator timeline entry', async () => {
    const { prisma, client, gig } = await assignedGig()
    await withAuthContext(client, async () => {
      await expect(openDispute(null, fd({ gigId: gig.id, reason: 'Просрочен срок выполнения' }))).rejects.toThrow('NEXT_REDIRECT')
    })
    const opened = await prisma.dispute.findFirst({ where: { gigId: gig.id } })
    const admin = await createTestUser(prisma, { role: 'ADMIN' })
    await withAuthContext(admin, async () => {
      await expect(
        resolveDispute(null, fd({ disputeId: opened!.id, verdict: 'specialist', resolution: 'доказательства приняты' })),
      ).rejects.toThrow('NEXT_REDIRECT')
    })
    const d = await prisma.dispute.findUnique({ where: { id: opened!.id }, include: { timeline: true } })
    expect(d!.status).toBe('RESOLVED')
    expect(d!.resolution).toContain('В пользу специалиста')
    expect(d!.timeline.some((e) => e.authorRole === 'moderator')).toBe(true)

    // getDisputeDetail surfaces the enriched fields
    const vm = await getDisputeDetail(opened!.id)
    expect(vm!.openerRole).toBe('company')
    expect(vm!.amount).toMatch(/₽/)
    expect(vm!.timeline.length).toBeGreaterThanOrEqual(1)
  })
})
