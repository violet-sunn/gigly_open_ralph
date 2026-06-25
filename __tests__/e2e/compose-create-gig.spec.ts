import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-create-gig (reconciliation #8) — verifies the rebuilt «Создать гиг» guided brief at /gigs/new
 * (app/(protected)/gigs/new/CreateGigDesign.tsx). The screen is driven by its STABLE name= contract
 * (title/description/goal/deliverables/constraints/budget/deadlineDays + hidden category/acceptanceCriteria/tags);
 * the design surfaces (the four brief cards, the category chips, the criteria editor + suggestions, the tag chips,
 * the live «Готовность брифа» checklist, and the fee summary) are asserted by their real text/role — the component's
 * <label>s are unassociated and the category chips are <div>s, so getByLabel / getByRole('radio') do NOT apply.
 * Publishing a valid brief still redirects to /gigs/new/success («Гиг опубликован»). Seeds a CLIENT into the E2E db.
 */
let clientId: string
let clientEmail: string

// A single criterion long enough to clear createGig's ≥50-char acceptanceCriteria floor.
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

test.describe('e2e-create-gig — guided brief', () => {
  test('renders the four brief cards, the readiness panel, and the fee summary; the live fee tracks the budget', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/gigs/new')

    // The four guided-brief cards (headings, to avoid the intro-banner text collision).
    await expect(page.getByRole('heading', { name: 'Что нужно сделать?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Как поймём, что готово?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Что важно учесть?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Условия' })).toBeVisible()

    // The readiness panel («Готовность брифа» is also mentioned in the intro banner — pin the heading).
    await expect(page.getByRole('heading', { name: 'Готовность брифа' })).toBeVisible()
    await expect(page.getByText('Заполнено')).toBeVisible()

    // The fee summary rows (there is NO «Сводка (комиссия)» heading in the rebuilt component).
    await expect(page.getByText('Сервисный сбор (10%)')).toBeVisible()
    await expect(page.getByText('Итого к оплате')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Опубликовать гиг' })).toBeVisible()

    // Live fee: budget 100000 → fee 10% → итого 110000. ru-RU emits a non-breaking thousands separator;
    // \s matches it, so assert whitespace-tolerant.
    await page.locator('input[name="budget"]').fill('100000')
    await expect(page.getByText(/Сервисный сбор \(10%\)/)).toBeVisible()
    await expect(page.getByText(/10\s?000\s*₽/).first()).toBeVisible() // fee row
    await expect(page.getByText(/110\s?000\s*₽/)).toBeVisible() // Итого к оплате (budget + 10%)
  })

  test('a category chip sets the hidden slug; the criteria editor and tag chips write their hidden mirrors', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/gigs/new')

    // Category chip is a clickable <div> (not a radio); clicking writes the hidden slug.
    await page.getByText('Программирование', { exact: true }).click()
    await expect(page.locator('input[name="category"]')).toHaveValue('programming')

    // Criteria editor: input (by placeholder) + «Добавить» → a «Готово, когда …» row + the hidden mirror.
    await page.getByPlaceholder(/например/).fill(LONG_CRITERION)
    await page.getByRole('button', { name: 'Добавить' }).click()
    await expect(page.getByText(/Готово, когда .*Лендинг проходит lighthouse/)).toBeVisible()
    await expect(page.locator('input[name="acceptanceCriteria"]')).toHaveValue(/Лендинг проходит lighthouse/)

    // A suggestion chip appends a second criterion.
    await page.getByText(/Есть тесты/).click()
    await expect(page.getByText(/Готово, когда .*Есть тесты/)).toBeVisible()

    // Tag input: type + Enter → a chip + the hidden comma-joined mirror.
    await page.getByPlaceholder(/Введите тег/).fill('Node.js')
    await page.getByPlaceholder(/Введите тег/).press('Enter')
    await expect(page.locator('input[name="tags"]')).toHaveValue(/Node\.js/)
  })

  test('a completed valid brief reaches 7/7 readiness, publishes, and lands on the «Гиг опубликован» success screen', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/gigs/new')

    // Drive every field by its unchanged name= selector.
    await page.locator('input[name="title"]').fill('E2E Гид-бриф гиг')
    await page.getByText('Программирование', { exact: true }).click()
    await page.locator('textarea[name="description"]').fill('Подробное описание задачи длиной более двадцати символов для брифа.')
    await page.locator('input[name="goal"]').fill('Повысить конверсию лендинга')
    await page.locator('textarea[name="deliverables"]').fill('Готовый адаптивный лендинг с исходниками')

    // One criterion, long enough to pass the server's ≥50-char acceptanceCriteria floor.
    await page.getByPlaceholder(/например/).fill(LONG_CRITERION)
    await page.getByRole('button', { name: 'Добавить' }).click()
    await expect(page.getByText(/Готово, когда .*Лендинг проходит lighthouse/)).toBeVisible()

    await page.locator('input[name="budget"]').fill('100000')
    await page.locator('input[name="deadlineDays"]').fill('14')

    // All seven readiness rows satisfied → the «Заполнено» score reads 7 / 7.
    await expect(page.getByText('7 / 7')).toBeVisible()

    await page.getByRole('button', { name: 'Опубликовать гиг' }).click()

    // createGig redirects to the dedicated success screen.
    await page.waitForURL('**/gigs/new/success')
    await expect(page.getByText('Гиг опубликован')).toBeVisible()
    await expect(page.getByRole('button', { name: 'К моим гигам' })).toBeVisible()
  })
})
