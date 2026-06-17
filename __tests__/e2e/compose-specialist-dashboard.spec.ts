import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-specialist-dashboard (Phase 2) — verifies the SPECIALIST /dashboard is composed from the kit (BannerCard +
 * Tabs + GigCard·grid + SearchPanel + MessagesPanel) with real data, that the five status tabs render
 * (Все/Заявки/В работе/На проверке/Завершённые), and that gig links + the find-project search work. Seeds a SPECIALIST
 * + a client + an assigned IN_PROGRESS gig + an OPEN gig with a PENDING application directly into the E2E db
 * (file:./test.db, same as the dev server).
 */
let specId: string
let specEmail: string
let inProgressGigId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `sdash-spec-${stamp}@example.com`

  const client = await prisma.user.create({
    data: {
      email: `sdash-client-${stamp}@example.com`,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Тест', inn: '7700000000' } },
    },
  })
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: {
        create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'Опыт' },
      },
    },
  })
  specId = spec.id

  const base = {
    description: 'Specialist dashboard composition test gig.',
    acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
    budget: 10000000,
    serviceFee: 1000000,
    totalAmount: 11000000,
    tags: 'React',
    deadlineDays: 14,
    clientId: client.id,
  }

  const g1 = await prisma.gig.create({
    data: { ...base, title: 'E2E Spec InProgress Gig', status: 'IN_PROGRESS', assignedSpecialistId: spec.id },
  })
  inProgressGigId = g1.id

  const g2 = await prisma.gig.create({ data: { ...base, title: 'E2E Spec Pending Gig', status: 'OPEN' } })
  await prisma.application.create({
    data: {
      gigId: g2.id,
      specialistId: spec.id,
      approach: 'Подход к решению задачи достаточной длины для прохождения валидации полей отклика специалиста.',
      questions: 'Уточняющие вопросы по проекту достаточной длины для валидации.',
      estimatedEffort: '2 недели',
      status: 'PENDING',
    },
  })

  await prisma.$disconnect()
})

test.describe('compose-specialist-dashboard — composed SPECIALIST dashboard', () => {
  test('renders the composed blocks (banner, five tabs, search, gig card)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')

    await expect(page.getByText(/Находите интересные гиги/)).toBeVisible() // BannerCard
    await expect(page.getByRole('tablist')).toBeVisible() // Tabs
    for (const label of ['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые']) {
      await expect(page.getByRole('tab', { name: new RegExp(label) })).toBeVisible()
    }
    await expect(page.getByRole('button', { name: /Найти проект/ })).toBeVisible() // SearchPanel
    await expect(page.getByText('E2E Spec InProgress Gig')).toBeVisible() // a GigCard (Все shows the assigned gig)
  })

  test('a GigCard opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    // Filter to «В работе» so the in-progress gig is the only card, then open it.
    await page.getByRole('tab', { name: /В работе/ }).click()
    await page.getByRole('button', { name: /К проекту/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${inProgressGigId}`))
  })

  test('the Заявки tab shows the pending application', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    await page.getByRole('tab', { name: /Заявки/ }).click()
    await expect(page.getByText('E2E Spec Pending Gig')).toBeVisible()
  })

  test('the find-project search routes to /gigs', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /Найти проект/ }).click()
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
  })
})
