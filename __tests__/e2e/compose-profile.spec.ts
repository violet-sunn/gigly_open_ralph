import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-profile (reconciliation #12) — verifies /profile + /profile/[userId] are reconciled to the prototype profile
 * blocks (ProfileDesign.tsx): the ID card (avatar + name + role tag + an `offline` pill; for a SPECIALIST a verified
 * badge + «На платформе с …»; for a CLIENT the «Реквизиты» ИНН/КПП panel), then — SPECIALIST only — «Стек» / «Опыт» /
 * «Избранные категории» / «Реализованные проекты» (design GigCards). The owner edit affordance is a bare Pencil <span>
 * (no accessible name) located by DOM position; clicking it opens an in-place edit modal (bio / stack / categories /
 * company requisites) wired to updateProfile + setFavoriteCategories — there is NO standalone /profile/edit screen (it
 * redirects to /profile). The shell header supplies the «ПРОФИЛЬ» title. Seeds a SPECIALIST + a CLIENT viewer (with an
 * «about») + a COMPLETED realized gig + review into the E2E db (file:./test.db).
 */
let specId: string
let specEmail: string
let viewerId: string
let viewerEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `cprofile-spec-${stamp}@example.com`
  viewerEmail = `cprofile-viewer-${stamp}@example.com`

  // Categories must exist for the favorites connect (the five are rendered from a static const regardless).
  for (const [i, [slug, name]] of [
    ['marketing', 'Маркетинг'],
    ['design', 'Дизайн'],
    ['programming', 'Программирование'],
    ['development', 'Разработка'],
    ['coding', 'Кодинг'],
  ].entries()) {
    await prisma.category.upsert({ where: { slug }, create: { slug, name, order: i }, update: {} })
  }

  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: {
        create: {
          displayName: 'Иван Иванов',
          techStack: 'Python, Node.js, WebSocket',
          experienceLevel: 'SENIOR',
          bio: 'Специализируюсь на высоконагруженных интерфейсах.',
          position: 'Senior Frontend Engineer',
          phoneVerified: true,
          location: 'Москва',
          workExperience: {
            create: [
              { company: 'Yandex', title: 'Senior Frontend Developer', startYear: 2021, endYear: null, order: 0, description: 'Облачная платформа.' },
              { company: 'Вконтакте', title: 'Middle Frontend Developer', startYear: 2018, endYear: 2021, order: 1 },
            ],
          },
        },
      },
      favoriteCategories: { connect: [{ slug: 'marketing' }, { slug: 'design' }, { slug: 'programming' }] },
    },
  })
  specId = spec.id

  const viewer = await prisma.user.create({
    data: {
      email: viewerEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Зритель', inn: '7700000001', about: 'Продуктовая IT-компания.' } },
    },
  })
  viewerId = viewer.id

  const realized = await prisma.gig.create({
    data: {
      title: 'E2E Profile Realized Gig',
      description: 'Profile composition realized gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 3000000,
      serviceFee: 300000,
      totalAmount: 3300000,
      status: 'COMPLETED',
      tags: 'Node.js',
      deadlineDays: 3,
      clientId: viewer.id,
      assignedSpecialistId: spec.id,
    },
  })
  await prisma.review.create({ data: { rating: 5, gigId: realized.id, authorId: viewer.id, targetId: spec.id } })

  await prisma.$disconnect()
})

test.describe('e2e-profile — reconciled profile screen', () => {
  test('a SPECIALIST owner sees the ID card and the four blocks', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile')

    // The shell header owns the page title (no in-screen «Профиль»).
    await expect(page.getByRole('heading', { name: 'ПРОФИЛЬ' })).toBeVisible()
    // ID card — name + role tag (sp.position) + verified badge + member-since line («offline» pill, not «Не в сети»).
    await expect(page.getByText('Иван Иванов').first()).toBeVisible()
    await expect(page.getByText('Senior Frontend Engineer')).toBeVisible() // header.roleTag
    await expect(page.getByText('Номер телефона верифицирован')).toBeVisible()
    await expect(page.getByText(/На платформе с/)).toBeVisible()
    // «Стек» block
    await expect(page.getByText('Стек', { exact: true })).toBeVisible()
    await expect(page.getByText('WebSocket')).toBeVisible()
    // «Избранные категории» block (only favorites render, as «[ label ]»)
    await expect(page.getByText('Избранные категории')).toBeVisible()
    await expect(page.getByText('Маркетинг')).toBeVisible()
    // «Опыт» block
    await expect(page.getByText('Опыт', { exact: true })).toBeVisible()
    await expect(page.getByText('Yandex')).toBeVisible()
    // «Реализованные проекты» — count badge + the realized GigCard title
    await expect(page.getByText(/Реализованные проекты/)).toBeVisible()
    await expect(page.getByText('E2E Profile Realized Gig')).toBeVisible()
  })

  test('a CLIENT owner sees the «Реквизиты» panel (ИНН/КПП)', async ({ page }) => {
    await setE2ESession(page, { id: viewerId, email: viewerEmail, role: 'CLIENT' })
    await page.goto('/profile')

    await expect(page.getByText('Заказчик')).toBeVisible() // CLIENT roleTag
    await expect(page.getByText('Продуктовая IT-компания.')).toBeVisible() // company «about» paragraph
    await expect(page.getByText('Реквизиты')).toBeVisible()
    await expect(page.getByText('ИНН', { exact: true })).toBeVisible()
    await expect(page.getByText('7700000001')).toBeVisible() // seeded inn
    await expect(page.getByText('КПП', { exact: true })).toBeVisible()
    // The SPECIALIST-only «Стек» block does not render for a CLIENT.
    await expect(page.getByText('Стек', { exact: true })).toHaveCount(0)
  })

  test('the public profile renders read-only (no edit pencil)', async ({ page }) => {
    await setE2ESession(page, { id: viewerId, email: viewerEmail, role: 'CLIENT' })
    await page.goto(`/profile/${specId}`)

    // The specialist's sections render (assert on data the basic edit form does not touch — tech stack +
    // work experience — so this stays independent of the edit round-trip test below).
    await expect(page.getByText('Стек', { exact: true })).toBeVisible()
    await expect(page.getByText('WebSocket')).toBeVisible()
    await expect(page.getByText('Опыт', { exact: true })).toBeVisible()
    await expect(page.getByText('Yandex')).toBeVisible()
    // …but no edit button is rendered to a non-owner (the owner-only «Редактировать» button is absent everywhere).
    await expect(page.getByRole('button', { name: 'Редактировать' })).toHaveCount(0)
  })

  test('the retired /profile/edit route redirects to /profile', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile/edit')
    await expect(page).toHaveURL(/\/profile(\?|$)/)
    await expect(page).not.toHaveURL(/\/profile\/edit/)
  })

  // Destructive (mutates the seeded specialist's bio) — runs after the read-only tests so they see the pristine seed.
  test('the specialist Опыт pencil opens the bio modal in place and a save round-trips', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile')

    // Owner edit buttons share the accessible name «Редактировать»; DOM order is [0]=Стек, [1]=Опыт(bio),
    // [2]=Избранные категории (no name button). The Опыт button opens the «Опыт и уровень» modal in place —
    // no navigation to a separate edit screen.
    await page.getByRole('button', { name: 'Редактировать' }).nth(1).click()
    await expect(page.getByRole('heading', { name: 'Опыт и уровень' })).toBeVisible()
    await expect(page).not.toHaveURL(/\/profile\/edit/)

    const newBio = `Обновлённое описание ${Date.now()}`
    await page.locator('textarea[name="bio"]').fill(newBio)
    await page.getByRole('button', { name: 'Сохранить' }).click()

    // Modal closes (noRedirect → refresh in place) and the new bio is persisted in the «Опыт» block.
    await expect(page.getByRole('heading', { name: 'Опыт и уровень' })).toHaveCount(0)
    await expect(page.getByText(newBio)).toBeVisible()
  })

  // Destructive (mutates the company viewer's requisites) — runs last.
  test('the company name pencil opens the requisites modal and a save round-trips', async ({ page }) => {
    await setE2ESession(page, { id: viewerId, email: viewerEmail, role: 'CLIENT' })
    await page.goto('/profile')

    // The company has a single «Редактировать» button (beside the name) → the «Редактировать реквизиты» modal.
    await page.getByRole('button', { name: 'Редактировать' }).first().click()
    await expect(page.getByRole('heading', { name: 'Редактировать реквизиты' })).toBeVisible()

    await page.locator('input[name="kpp"]').fill('770801001')
    await page.getByRole('button', { name: 'Сохранить' }).click()

    await expect(page.getByRole('heading', { name: 'Редактировать реквизиты' })).toHaveCount(0)
    await expect(page.getByText('770801001')).toBeVisible() // new КПП persisted
  })
})
