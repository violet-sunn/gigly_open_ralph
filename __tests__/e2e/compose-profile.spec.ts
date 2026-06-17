import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-profile (Phase 2) — verifies /profile is composed from the kit (ProfileHeader + StatPanel + TagList +
 * CategoryTags + ExperienceList + GigCard·list) with real data, that the edit flow is preserved (the header affordance
 * → /profile/edit, a save round-trips), and that the public /profile/[userId] view renders read-only. Seeds a
 * SPECIALIST with the profile-evolution fields + favorite categories + a COMPLETED gig + a review directly into the E2E
 * db (file:./test.db, same as the dev server).
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
      clientProfile: { create: { companyName: 'ООО Зритель', inn: '7700000001' } },
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

test.describe('compose-profile — composed profile screen', () => {
  test('renders the composed blocks (header, stack, categories, experience, realized)', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile')

    // ProfileHeader — role tag + phone-verified badge
    await expect(page.getByText('Senior Frontend Engineer')).toBeVisible()
    await expect(page.getByText('Номер телефона верифицирован')).toBeVisible()
    // TagList «Стек»
    await expect(page.getByText('Стек', { exact: true })).toBeVisible()
    await expect(page.getByText('WebSocket')).toBeVisible()
    // CategoryTags «Избранные категории» (all five render)
    await expect(page.getByText('Избранные категории')).toBeVisible()
    await expect(page.getByText('Маркетинг')).toBeVisible()
    // ExperienceList «Опыт»
    await expect(page.getByText('Опыт', { exact: true })).toBeVisible()
    await expect(page.getByText('Yandex')).toBeVisible()
    // Realized GigCard
    await expect(page.getByText(/Реализованные проекты/)).toBeVisible()
    await expect(page.getByText('E2E Profile Realized Gig')).toBeVisible()
  })

  test('the public profile renders read-only (no edit affordance)', async ({ page }) => {
    await setE2ESession(page, { id: viewerId, email: viewerEmail, role: 'CLIENT' })
    await page.goto(`/profile/${specId}`)

    // The specialist's sections render (assert on data the basic edit form does not touch — tech stack,
    // work experience, favorites — so this stays independent of the edit round-trip test below).
    await expect(page.getByText('Стек', { exact: true })).toBeVisible()
    await expect(page.getByText('WebSocket')).toBeVisible()
    await expect(page.getByText('Опыт', { exact: true })).toBeVisible()
    await expect(page.getByText('Yandex')).toBeVisible()
    // …but no edit affordance is shown to a non-owner.
    await expect(page.getByRole('button', { name: 'Редактировать профиль' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Редактировать' })).toHaveCount(0)
  })

  // Destructive (mutates the seeded specialist) — runs last so the read-only tests above see the pristine seed.
  test('the edit affordance navigates to /profile/edit and a save round-trips', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile')

    await page.getByRole('button', { name: 'Редактировать профиль' }).click()
    await expect(page).toHaveURL(/\/profile\/edit/)

    await page.fill('#displayName', 'Иван Обновлённый')
    await page.getByRole('button', { name: /Save Profile/ }).click()

    await expect(page).toHaveURL(/\/profile(\?|$)/)
    await expect(page.getByText('Иван Обновлённый').first()).toBeVisible()
  })
})
