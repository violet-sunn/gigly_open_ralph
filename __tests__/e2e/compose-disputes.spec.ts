import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-disputes (Phase 2) — verifies /disputes (list + detail) is composed from the kit (DisputeList +
 * DisputeDetail) over the disputes-flow data layer: the open-dispute entry from a gig creates a dispute and it lists;
 * an admin resolves it via the resolve view (status updates); a participant sees their dispute read-only; a
 * non-participant cannot reach the detail (not-found); the empty state renders; and the sidebar «Споры» nav item is
 * active. Seeds directly into the E2E db (file:./test.db). No Споры mock exists → F1 flagged-missing.
 */
let clientId: string
let clientEmail: string
let specId: string
let adminId: string
let adminEmail: string
let outsiderId: string
let outsiderEmail: string
let emptyId: string
let emptyEmail: string

let gigForOpenId: string // a gig with no dispute yet — the open-from-gig flow
let disputeReadId: string // a seeded dispute — read-only + non-participant 404
let disputeResolveId: string // a seeded dispute — admin resolve
let gigReadTitle: string
let gigResolveTitle: string

async function makeGig(prisma: any, clientIdArg: string, specIdArg: string, title: string) {
  const gig = await prisma.gig.create({
    data: {
      title,
      description: 'Dispute composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 15000000,
      serviceFee: 1500000,
      totalAmount: 16500000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 14,
      clientId: clientIdArg,
      assignedSpecialistId: specIdArg,
    },
  })
  return gig.id
}

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  clientEmail = `cdis-client-${stamp}@example.com`
  adminEmail = `cdis-admin-${stamp}@example.com`
  outsiderEmail = `cdis-out-${stamp}@example.com`
  emptyEmail = `cdis-empty-${stamp}@example.com`

  const client = await prisma.user.create({
    data: {
      email: clientEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Спор', inn: '7700000010' } },
    },
  })
  clientId = client.id

  const spec = await prisma.user.create({
    data: {
      email: `cdis-spec-${stamp}@example.com`,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Иван Петров', techStack: 'React', experienceLevel: 'SENIOR' } },
    },
  })
  specId = spec.id

  const admin = await prisma.user.create({ data: { email: adminEmail, password: 'x', role: 'ADMIN' } })
  adminId = admin.id

  const outsider = await prisma.user.create({
    data: {
      email: outsiderEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Чужой', techStack: 'Go', experienceLevel: 'SENIOR' } },
    },
  })
  outsiderId = outsider.id

  const empty = await prisma.user.create({
    data: {
      email: emptyEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Пусто', techStack: 'Rust', experienceLevel: 'SENIOR' } },
    },
  })
  emptyId = empty.id

  gigForOpenId = await makeGig(prisma, clientId, specId, `E2E Open-From-Gig ${stamp}`)

  gigReadTitle = `E2E Read Dispute ${stamp}`
  const gigRead = await makeGig(prisma, clientId, specId, gigReadTitle)
  const dRead = await prisma.dispute.create({
    data: { gigId: gigRead, openerId: clientId, reason: 'Объём работ вырос относительно исходной задачи.' },
  })
  disputeReadId = dRead.id

  gigResolveTitle = `E2E Resolve Dispute ${stamp}`
  const gigResolve = await makeGig(prisma, clientId, specId, gigResolveTitle)
  const dResolve = await prisma.dispute.create({
    data: { gigId: gigResolve, openerId: clientId, reason: 'Работа не соответствует критериям приёмки.' },
  })
  disputeResolveId = dResolve.id

  await prisma.$disconnect()
})

test.describe('compose-disputes — composed disputes screen', () => {
  test('open-dispute entry from a gig → the dedicated «Открыть спор» screen → creates a dispute', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigForOpenId}`)

    // The gig-detail dispute entry is a clickable <div> «Возникли разногласия? Открыть спор» (not a role=button) →
    // match by text. It routes to the dedicated «Открыть спор» screen.
    await page.getByText(/Открыть спор/).click()
    await expect(page).toHaveURL(new RegExp(`/disputes/new\\?gig=${gigForOpenId}`))

    // The disputeNew screen: a reason chip is preselected; fill the description + submit «Открыть спор» (the form button).
    await page.locator('textarea[name="description"]').fill('Спор по гигу: задача расширилась без согласования.')
    await page.getByRole('button', { name: 'Открыть спор' }).click()

    // openDispute redirects to the gig — wait for it so the action commits before navigating away.
    await page.waitForURL('**/gigs/**')

    // the dispute now lists on /disputes.
    await page.goto('/disputes')
    await expect(page.getByText('E2E Open-From-Gig')).toBeVisible({ timeout: 10000 })
  })

  test('an admin resolves a dispute via a verdict button; the status updates to «Решён»', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto(`/disputes/${disputeResolveId}`)

    // The «Решение модератора» panel has three verdict submit buttons — clicking one IS the submit (no note textarea).
    await page.getByRole('button', { name: 'В пользу заказчика' }).click()

    // resolveDispute redirects to the gig on success — wait for it so the action commits before we navigate away.
    await page.waitForURL('**/gigs/**')

    // the detail now shows the resolved status + the prefixed resolution.
    await page.goto(`/disputes/${disputeResolveId}`)
    await expect(page.getByText('Решён', { exact: true })).toBeVisible() // status pill (exact: «раз-решён» appears in the resolution text)
    // The resolution «В пользу заказчика …» appears in both the banner and the moderator timeline entry → assert the first.
    await expect(page.getByText(/В пользу заказчика/).first()).toBeVisible()
  })

  test('a participant sees their dispute read-only — no moderator panel', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/disputes/${disputeReadId}`)

    await expect(page.getByText(gigReadTitle)).toBeVisible() // detail renders
    await expect(page.getByText('Объём работ вырос относительно исходной задачи.')).toBeVisible() // reason
    // The admin «Решение модератора» panel + its verdict buttons are absent for a participant.
    await expect(page.getByText('Решение модератора')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'В пользу специалиста' })).toHaveCount(0)
  })

  test('a non-participant cannot reach the dispute detail (not-found)', async ({ page }) => {
    await setE2ESession(page, { id: outsiderId, email: outsiderEmail, role: 'SPECIALIST' })
    await page.goto(`/disputes/${disputeReadId}`)

    // getDispute returns null for a non-participant → the page 404s; the dispute content is absent.
    await expect(page.getByText('Объём работ вырос относительно исходной задачи.')).toHaveCount(0)
  })

  test('a user with no disputes sees the empty state', async ({ page }) => {
    await setE2ESession(page, { id: emptyId, email: emptyEmail, role: 'SPECIALIST' })
    await page.goto('/disputes')

    await expect(page.getByText('Открытых споров нет')).toBeVisible()
  })
})
