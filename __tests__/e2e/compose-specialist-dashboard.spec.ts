import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-specialist-dashboard — verifies the SPECIALIST /dashboard rebuilt on the gigly_full_design
 * prototype (app/(protected)/dashboard/DashboardDesign.tsx): WELCOME «Добро пожаловать в Gigly!» + the
 * «Мои гиги» panel with the five <div> tab chips (Все/Заявки/В работе/На проверке/Завершённые) + the
 * design GigCard feed; col2 = the «Найти новый гиг» search panel + «Сообщения»; and the «Требует внимания»
 * strip. The page title now lives in the shell header (<h1>«ДАШБОРД»</h1>), not in-screen. Seeds a
 * SPECIALIST + a client + an assigned IN_PROGRESS gig + an OPEN gig with a PENDING application + a
 * notification (→ the attention strip) directly into the E2E db (file:./test.db, same as the dev server).
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

  // A notification → the «Требует внимания» attention strip renders.
  await prisma.notification.create({
    data: { userId: spec.id, gigId: g1.id, type: 'STATUS_CHANGE', eventType: 'work_approved' },
  })

  await prisma.$disconnect()
})

test.describe('compose-specialist-dashboard — rebuilt SPECIALIST dashboard', () => {
  test('renders the rebuilt blocks (welcome, мои гиги + five tabs, search, gig card, attention strip)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')

    await expect(page.getByText('Добро пожаловать в Gigly!')).toBeVisible() // WELCOME
    await expect(page.getByText('Заполните профиль')).toBeVisible() // an onboarding tile
    await expect(page.getByRole('heading', { name: 'Мои гиги' })).toBeVisible() // BOARD col1 panel header
    for (const label of ['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые']) {
      // The tab chips are <div>s; «В работе»/«На проверке» also appear as the in-progress card's status.
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
    }
    await expect(page.getByRole('heading', { name: 'Найти новый гиг' })).toBeVisible() // col2 search panel
    await expect(page.getByText('E2E Spec InProgress Gig').first()).toBeVisible() // a GigCard (also in the attention card)
    await expect(page.getByRole('heading', { name: 'Сообщения' })).toBeVisible() // col2 messages panel
    await expect(page.getByRole('heading', { name: 'Требует внимания' })).toBeVisible() // specialist attention strip
    await expect(page.getByRole('heading', { name: 'ДАШБОРД' })).toBeVisible() // title lives in the shell header now
  })

  test('a GigCard opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    // The compact GigCard is a Link (its footer CTA only renders on the browse screen) — click by title.
    await page.getByRole('link', { name: /E2E Spec InProgress Gig/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${inProgressGigId}`))
  })

  test('the Заявки tab shows the pending application', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    await page.getByText('Заявки', { exact: true }).first().click()
    await expect(page.getByText('E2E Spec Pending Gig')).toBeVisible()
  })

  test('the find-project search routes to /gigs', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/dashboard')
    await page.getByPlaceholder('Поиск по стеку или категории').fill('React')
    await page.getByPlaceholder('Поиск по стеку или категории').press('Enter')
    await expect(page).toHaveURL(/\/gigs(\?|$)/)
  })
})
