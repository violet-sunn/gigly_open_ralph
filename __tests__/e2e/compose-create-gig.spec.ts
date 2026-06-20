import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * reconcile-create-gig (Phase 3) — verifies the «Создать гиг» guided brief at /gigs/new: the readiness meter + the live
 * fee panel render, fields fill, a criterion adds, the live fee reflects the 10%, and publishing a valid gig lands on
 * the «Гиг опубликован» success screen. Seeds a CLIENT directly into the E2E db.
 */
let clientId: string
let clientEmail: string

const LONG_CRITERION = 'Лендинг проходит lighthouse ≥ 90 и адаптив под мобильные устройства'

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  clientEmail = `ccg-client-${stamp}@example.com`

  // Categories (FK target for gig.categorySlug) — idempotent.
  const cats = [
    { slug: 'marketing', name: 'Маркетинг', order: 0 },
    { slug: 'design', name: 'Дизайн', order: 1 },
    { slug: 'programming', name: 'Программирование', order: 2 },
    { slug: 'development', name: 'Разработка', order: 3 },
    { slug: 'coding', name: 'Кодинг', order: 4 },
  ]
  for (const c of cats) await prisma.category.upsert({ where: { slug: c.slug }, create: c, update: {} })
  const client = await prisma.user.create({
    data: { email: clientEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Создатель', inn: '7700000070' } } },
  })
  clientId = client.id
  await prisma.$disconnect()
})

test.describe('reconcile-create-gig — guided brief', () => {
  test('renders the guided brief (readiness meter + fee panel) and the live fee tracks the budget', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/gigs/new')

    await expect(page.getByText('Готовность брифа')).toBeVisible()
    await expect(page.getByText('Сводка (комиссия)')).toBeVisible()
    await expect(page.getByText('Что нужно сделать?')).toBeVisible()
    await expect(page.getByText('Как поймём, что готово?')).toBeVisible()

    await page.getByLabel('Бюджет').fill('100000')
    await expect(page.getByText('110 000 ₽')).toBeVisible() // Итого = budget + 10% (live)
  })

  test('filling the brief + publishing lands on the «Гиг опубликован» success screen', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/gigs/new')

    await page.getByLabel('Название').fill('E2E Гид-бриф гиг')
    await page.getByRole('radio', { name: 'Программирование' }).click()
    await page.getByLabel('Описание').fill('Подробное описание задачи длиной более двадцати символов для брифа.')
    await page.getByLabel('Цель').fill('Повысить конверсию лендинга')
    await page.getByLabel('Ожидаемый результат').fill('Готовый адаптивный лендинг с исходниками')

    // Add a single criterion long enough to pass the server's ≥50-char acceptanceCriteria floor.
    await page.getByLabel('Критерий приёмки').fill(LONG_CRITERION)
    await page.getByRole('button', { name: 'Добавить' }).click()
    await expect(page.getByText(new RegExp('Лендинг проходит lighthouse'))).toBeVisible() // criterion row

    await page.getByLabel('Бюджет').fill('100000')
    await page.getByLabel('Срок выполнения').fill('14')

    await page.getByRole('button', { name: 'Опубликовать гиг' }).click()

    // createGig redirects to the dedicated success screen.
    await page.waitForURL('**/gigs/new/success')
    await expect(page.getByText('Гиг опубликован')).toBeVisible()
    await expect(page.getByRole('button', { name: 'К моим гигам' })).toBeVisible()
  })
})
