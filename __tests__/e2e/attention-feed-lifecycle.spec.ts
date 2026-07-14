import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * attention-feed-lifecycle (Гигли баги #9) — the «Требует внимания» strip must drop a notification
 * once its deal is resolved, instead of showing a stale «заявка принята» card forever.
 *
 * Seeds a SPECIALIST with two UNREAD `application_accepted` notifications on two live (IN_PROGRESS)
 * gigs — both cards appear. Completing one gig (→ COMPLETED, as a client approval does) must remove
 * that gig's card from the strip and drop the count, while the other still-actionable card remains.
 * Each attention card carries a unique CTA `<a href="/gigs/{id}">Открыть</a>`, so we scope every
 * assertion to the strip and count/inspect those CTAs.
 */
let specId: string
let specEmail: string
let liveGigId: string
let completedGigId: string

function db() {
  return new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
}

test.beforeAll(async () => {
  const prisma = db()
  const stamp = Date.now()
  specEmail = `attn-spec-${stamp}@example.com`

  const client = await prisma.user.create({
    data: {
      email: `attn-client-${stamp}@example.com`,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Внимание', inn: '7700000000' } },
    },
  })
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: {
        create: { displayName: 'Спец Внимание', techStack: 'React', experienceLevel: 'SENIOR', bio: 'Опыт' },
      },
    },
  })
  specId = spec.id

  const base = {
    description: 'Attention feed lifecycle test gig.',
    acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
    budget: 10000000,
    serviceFee: 1000000,
    totalAmount: 11000000,
    tags: 'React',
    deadlineDays: 14,
    clientId: client.id,
    assignedSpecialistId: spec.id,
  }

  const gLive = await prisma.gig.create({ data: { ...base, title: 'ATTN Live Gig', status: 'IN_PROGRESS' } })
  const gDone = await prisma.gig.create({ data: { ...base, title: 'ATTN ToComplete Gig', status: 'IN_PROGRESS' } })
  liveGigId = gLive.id
  completedGigId = gDone.id

  // Two unread acceptance notifications → both surface in «Требует внимания» (one row per [user, gig]).
  for (const gigId of [gLive.id, gDone.id]) {
    await prisma.notification.create({
      data: { userId: spec.id, gigId, type: 'STATUS_CHANGE', eventType: 'application_accepted' },
    })
  }

  await prisma.$disconnect()
})

test.describe('attention-feed-lifecycle — «Требует внимания» clears resolved deals', () => {
  test('a completed deal drops its card and the count; an active deal remains', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })

    // The attention block — the deepest <div> that holds both the heading and its CTA links.
    const strip = () =>
      page
        .locator('div')
        .filter({ has: page.getByRole('heading', { name: 'Требует внимания' }) })
        .filter({ has: page.getByRole('link', { name: 'Открыть', exact: true }) })
        .last()

    // Both live-gig notifications appear.
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Требует внимания' })).toBeVisible()
    await expect(strip().getByRole('link', { name: 'Открыть', exact: true })).toHaveCount(2)
    await expect(strip().locator(`a[href="/gigs/${liveGigId}"]`).first()).toBeVisible()
    await expect(strip().locator(`a[href="/gigs/${completedGigId}"]`).first()).toBeVisible()

    // The deal on the second gig completes (client approves work → COMPLETED).
    const prisma = db()
    await prisma.gig.update({ where: { id: completedGigId }, data: { status: 'COMPLETED' } })
    await prisma.$disconnect()

    // Reload: the completed gig's card is gone from the strip, the count dropped to 1, and the
    // still-actionable active-gig card remains — the fix is selective, not a blanket hide.
    await page.goto('/dashboard')
    await expect(strip().getByRole('link', { name: 'Открыть', exact: true })).toHaveCount(1)
    await expect(strip().locator(`a[href="/gigs/${completedGigId}"]`)).toHaveCount(0)
    await expect(strip().locator(`a[href="/gigs/${liveGigId}"]`).first()).toBeVisible()
  })
})
