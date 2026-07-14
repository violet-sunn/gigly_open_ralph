import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { getNotificationDisplayText } from '@/lib/notification-utils'
import { seedCategories } from '@/lib/categories'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Mock next/headers for session cookie management
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

// Mock next/navigation redirect (throws so we can assert the target)
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { updateGig } from '@/app/actions/gig'

type Prisma = ReturnType<typeof getTestPrismaClient>

/** Create an OPEN gig with fully-controlled, known field values (the helper doesn't expose deadline/stage/category). */
async function createEditableGig(prisma: Prisma, clientId: string, over: Record<string, any> = {}) {
  return prisma.gig.create({
    data: {
      title: over.title ?? 'Исходный заголовок',
      description: over.description ?? 'Исходное описание задачи для гига',
      acceptanceCriteria:
        over.acceptanceCriteria ?? 'Исходный критерий приёмки длиной больше пятидесяти символов ок',
      goal: over.goal ?? 'Цель',
      deliverables: over.deliverables ?? 'Результат',
      constraints: over.constraints ?? 'Ограничение',
      budget: over.budget ?? 15000000, // 150 000 ₽
      serviceFee: over.serviceFee ?? 1500000,
      totalAmount: over.totalAmount ?? 16500000,
      status: over.status ?? 'OPEN',
      tags: over.tags ?? 'React,TypeScript',
      deadlineDays: over.deadlineDays ?? 14,
      stageCount: over.stageCount ?? 1,
      categorySlug: over.categorySlug ?? null,
      clientId,
      isExample: over.isExample ?? false,
      closedByAdmin: over.closedByAdmin ?? false,
    },
  })
}

/** Build a valid edit FormData (override any field to trigger a validation path). */
function editForm(gigId: string, over: Record<string, string> = {}): FormData {
  const fd = new FormData()
  fd.append('gigId', gigId)
  fd.append('title', over.title ?? 'Обновлённый заголовок гига')
  fd.append('description', over.description ?? 'Обновлённое описание задачи для гига')
  fd.append(
    'acceptanceCriteria',
    over.acceptanceCriteria ?? 'Обновлённый критерий приёмки длиной больше пятидесяти символов ок',
  )
  fd.append('budget', over.budget ?? '200000')
  fd.append('tags', over.tags ?? 'React,Node.js')
  // goal + deliverables are now required (gig-validation-ssot) — default them so edits are valid unless overridden
  fd.append('goal', over.goal ?? 'Достичь конкретного бизнес-результата')
  fd.append('deliverables', over.deliverables ?? 'Рабочий код, документация и тесты')
  if (over.constraints !== undefined) fd.append('constraints', over.constraints)
  if (over.deadlineDays !== undefined) fd.append('deadlineDays', over.deadlineDays)
  if (over.stageCount !== undefined) fd.append('stageCount', over.stageCount)
  if (over.category !== undefined) fd.append('category', over.category)
  return fd
}

async function expectRedirect(fn: () => Promise<any>, target: string) {
  try {
    await fn()
    throw new Error('Expected a redirect but none was thrown')
  } catch (error: any) {
    expect(error.message).toContain(`NEXT_REDIRECT:${target}`)
  }
}

describe('Gig Editing (updateGig)', () => {
  let prisma: Prisma

  beforeEach(async () => {
    prisma = getTestPrismaClient()
    setTestSessionToken(undefined)
    // Categories are a seeded enum-as-table; a gig's categorySlug FKs to them. Seed idempotently so category edits
    // don't trip the FK.
    await seedCategories()
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  describe('Successful edit + validation parity with createGig', () => {
    it('owner edits an OPEN gig → fields updated, fee recomputed, redirects to gig detail', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)

      const fd = editForm(gig.id, {
        title: 'Точно исправленный заголовок',
        deliverables: 'Исправленные результаты — PR в репозиторий',
        budget: '200000',
        deadlineDays: '30',
        category: 'programming',
      })

      await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

      const updated = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(updated!.title).toBe('Точно исправленный заголовок')
      expect(updated!.deliverables).toBe('Исправленные результаты — PR в репозиторий')
      // Budget 200 000 ₽ → kopecks, 10% fee, total
      expect(updated!.budget).toBe(20000000)
      expect(updated!.serviceFee).toBe(2000000)
      expect(updated!.totalAmount).toBe(22000000)
      expect(updated!.deadlineDays).toBe(30)
      expect(updated!.categorySlug).toBe('programming')
      // Lifecycle / ownership untouched
      expect(updated!.status).toBe('OPEN')
      expect(updated!.clientId).toBe(client.id)
    })

    it('rejects a non-CLIENT editor', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
      const gig = await createEditableGig(prisma, client.id)

      const res = await withAuthContext(specialist, () => updateGig(null, editForm(gig.id)))
      expect(res).toEqual({ error: 'Редактировать гиги могут только заказчики.' })

      const unchanged = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(unchanged!.title).toBe('Исходный заголовок')
    })

    it('rejects a non-owner CLIENT', async () => {
      const owner = await createTestUser(prisma, { role: 'CLIENT' })
      const other = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, owner.id)

      const res = await withAuthContext(other, () => updateGig(null, editForm(gig.id)))
      expect(res).toEqual({ error: 'Редактировать гиг может только заказчик, опубликовавший его.' })
    })

    it('redirects an unauthenticated user to /login', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      // No session token set → getSession() is null
      await expectRedirect(() => updateGig(null, editForm(gig.id)), '/login')
    })

    it('rejects editing a gig that is not OPEN', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id, { status: 'IN_PROGRESS' })

      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id)))
      expect(res).toEqual({
        error: 'Редактировать гиг можно только пока он открыт и специалист не назначен.',
      })
    })

    it('rejects editing an admin-closed gig', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id, { closedByAdmin: true })

      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id)))
      expect(res).toEqual({ error: 'Этот гиг закрыт администрацией и больше недоступен.' })
    })

    it('rejects editing an example gig', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id, { isExample: true })

      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id)))
      expect(res).toEqual({ error: 'Демонстрационный гиг нельзя редактировать.' })
    })

    it('returns not-found for a missing gig', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const res = await withAuthContext(client, () => updateGig(null, editForm('nonexistent-gig-id')))
      expect(res).toEqual({ error: 'Этот гиг больше не существует или был удалён.' })
    })

    it('rejects missing required fields (empty title)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id, { title: '   ' })))
      expect(res).toEqual({
        error: 'Заполните обязательные поля: название, описание и критерии приёмки.',
      })
    })

    it('rejects acceptance criteria shorter than 50 characters', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () =>
        updateGig(null, editForm(gig.id, { acceptanceCriteria: 'слишком коротко' })),
      )
      expect(res).toEqual({
        error:
          'Критерии приёмки должны быть не короче 50 символов. Опишите подробнее, что считается результатом.',
      })
    })

    it('rejects a non-positive budget', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id, { budget: '0' })))
      expect(res.error).toContain('Бюджет должен быть положительным числом')
    })

    // gig-validation-ssot: the edit path must NOT be able to bypass the create-time minimums.
    it('rejects a description shorter than 20 characters (no edit bypass)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id, { description: 'мало' })))
      expect(res.error).toContain('Описание должно быть не короче 20 символов')
    })

    it('rejects an empty goal (required field, no edit bypass)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id, { goal: '   ' })))
      expect(res).toEqual({ error: 'Укажите цель гига — зачем это нужно, какой результат для бизнеса.' })
    })

    it('rejects empty deliverables (required field, no edit bypass)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () => updateGig(null, editForm(gig.id, { deliverables: '   ' })))
      expect(res).toEqual({ error: 'Опишите ожидаемый результат — что заказчик получит на выходе (PR, демо, инструкция).' })
    })

    it('rejects a deadline outside 1–365', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () =>
        updateGig(null, editForm(gig.id, { deadlineDays: '400' })),
      )
      expect(res).toEqual({ error: 'Срок выполнения должен быть целым числом дней от 1 до 365.' })
    })

    it('rejects a stage count outside 1–50', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () =>
        updateGig(null, editForm(gig.id, { stageCount: '99' })),
      )
      expect(res).toEqual({ error: 'Количество этапов должно быть целым числом от 1 до 50.' })
    })

    it('rejects an invalid category', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const res = await withAuthContext(client, () =>
        updateGig(null, editForm(gig.id, { category: 'not-a-real-category' })),
      )
      expect(res).toEqual({ error: 'Выберите корректную категорию.' })
    })

    it('cannot alter status/ownership via extra formData fields (whitelist)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const attacker = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)

      const fd = editForm(gig.id)
      fd.append('status', 'COMPLETED')
      fd.append('clientId', attacker.id)
      fd.append('isExample', 'true')
      fd.append('closedByAdmin', 'true')

      await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

      const after = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(after!.status).toBe('OPEN')
      expect(after!.clientId).toBe(client.id)
      expect(after!.isExample).toBe(false)
      expect(after!.closedByAdmin).toBe(false)
    })

    it('a no-op save succeeds and leaves stored values unchanged', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id, { categorySlug: null })

      // Submit the exact current values (budget in roubles = kopecks / 100).
      const fd = editForm(gig.id, {
        title: gig.title,
        description: gig.description,
        acceptanceCriteria: gig.acceptanceCriteria!,
        goal: gig.goal,
        deliverables: gig.deliverables,
        constraints: gig.constraints,
        budget: String(gig.budget / 100),
        tags: gig.tags,
        deadlineDays: String(gig.deadlineDays),
        stageCount: String(gig.stageCount),
      })

      await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

      const after = await prisma.gig.findUnique({ where: { id: gig.id } })
      expect(after!.title).toBe(gig.title)
      expect(after!.budget).toBe(gig.budget)
      expect(after!.serviceFee).toBe(gig.serviceFee)
      expect(after!.deadlineDays).toBe(gig.deadlineDays)
      expect(after!.stageCount).toBe(gig.stageCount)
    })
  })

  describe('Applicant notification fan-out on material change', () => {
    it('notifies every PENDING applicant, excluding withdrawn/rejected/owner', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)

      const s1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const s2 = await createTestUser(prisma, { role: 'SPECIALIST' })
      const sWithdrawn = await createTestUser(prisma, { role: 'SPECIALIST' })
      const sFinal = await createTestUser(prisma, { role: 'SPECIALIST' })
      const sRejected = await createTestUser(prisma, { role: 'SPECIALIST' })

      await createTestApplication(prisma, { gigId: gig.id, specialistId: s1.id, status: 'PENDING' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: s2.id, status: 'PENDING' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: sWithdrawn.id, status: 'WITHDRAWN' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: sFinal.id, status: 'WITHDRAWN_FINAL' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: sRejected.id, status: 'REJECTED' })

      // Material change: budget + a scope field
      const fd = editForm(gig.id, { budget: '250000', deliverables: 'Исправленные результаты' })
      await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

      const notifs = await prisma.notification.findMany({
        where: { gigId: gig.id, eventType: 'gig_updated' },
      })
      const notifiedUserIds = notifs.map((n) => n.userId).sort()
      expect(notifiedUserIds).toEqual([s1.id, s2.id].sort())
      // Never the withdrawn/final/rejected applicants, never the owner
      expect(notifiedUserIds).not.toContain(sWithdrawn.id)
      expect(notifiedUserIds).not.toContain(sFinal.id)
      expect(notifiedUserIds).not.toContain(sRejected.id)
      expect(notifiedUserIds).not.toContain(client.id)

      // Type/eventType + legible display text
      expect(notifs[0].type).toBe('STATUS_CHANGE')
      expect(getNotificationDisplayText(notifs[0])).toBe('Условия гига обновлены')
    })

    it('a notification fan-out failure does not fail the edit (still persists + redirects)', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id)
      const s1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: s1.id, status: 'PENDING' })

      // Force the fan-out to throw synchronously; updateGig must swallow it, persist the edit, and still redirect.
      const notifications = await import('@/lib/notifications')
      const spy = vi.spyOn(notifications, 'createNotificationsBulk').mockImplementation(() => {
        throw new Error('boom: notification backend down')
      })

      try {
        const fd = editForm(gig.id, { title: 'Заголовок после сбоя уведомлений', budget: '300000' })
        await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

        const after = await prisma.gig.findUnique({ where: { id: gig.id } })
        expect(after!.title).toBe('Заголовок после сбоя уведомлений')
        expect(after!.budget).toBe(30000000)
      } finally {
        spy.mockRestore()
      }
    })

    it('a no-op save creates no notifications', async () => {
      const client = await createTestUser(prisma, { role: 'CLIENT' })
      const gig = await createEditableGig(prisma, client.id, { categorySlug: null })
      const s1 = await createTestUser(prisma, { role: 'SPECIALIST' })
      await createTestApplication(prisma, { gigId: gig.id, specialistId: s1.id, status: 'PENDING' })

      const fd = editForm(gig.id, {
        title: gig.title,
        description: gig.description,
        acceptanceCriteria: gig.acceptanceCriteria!,
        goal: gig.goal,
        deliverables: gig.deliverables,
        constraints: gig.constraints,
        budget: String(gig.budget / 100),
        tags: gig.tags,
        deadlineDays: String(gig.deadlineDays),
        stageCount: String(gig.stageCount),
      })

      await expectRedirect(() => withAuthContext(client, () => updateGig(null, fd)), `/gigs/${gig.id}`)

      const count = await prisma.notification.count({
        where: { gigId: gig.id, eventType: 'gig_updated' },
      })
      expect(count).toBe(0)
    })
  })
})
