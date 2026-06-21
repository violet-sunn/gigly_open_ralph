import { test } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import fs from 'node:fs'

/**
 * THROWAWAY — captures the rebuilt /gigs/[id] pilot (GigDetail rebuilt on the gigly_full_design prototype's own markup)
 * for a visual fidelity check against gigly_full_design/screenshots/02-gigdetail.png. Not a regression test; delete
 * after review. Seeds a Node.js-leak gig mirroring the prototype's content, then captures specialist (apply form) +
 * owner (fee breakdown) views in both themes.
 */
const OUT = 'docs/design-system/fidelity/out/pilot'

let specId: string
let specEmail: string
let ownerId: string
let ownerEmail: string
let gigId: string

test.beforeAll(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  specEmail = `pilot-spec-${s}@example.com`
  ownerEmail = `pilot-owner-${s}@example.com`

  const owner = await prisma.user.create({
    data: {
      email: ownerEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'AlgoTrade', inn: '7700000000' } },
    },
  })
  ownerId = owner.id
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Тимур Камальтдинов', techStack: 'Node.js', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  specId = spec.id

  gigId = (
    await prisma.gig.create({
      data: {
        title: 'Исправить утечку памяти в Node.js (WebSocket-сервер для трейдинга)',
        description:
          'Сервер на ws + express. При 200+ подключениях память растёт до 2 ГБ за 3 часа. Нужно профилировать и устранить утечку.',
        acceptanceCriteria:
          'Утечка устранена и подтверждена нагрузочным тестом\nГрафик памяти стабилен под нагрузкой 200+ соединений\nКод-ревью пройдено',
        goal: 'Профилировать heap и найти источник роста памяти под нагрузкой.',
        deliverables: 'Патч с устранённой утечкой + краткий отчёт о причинах.',
        constraints: 'Стек ws + express, без смены архитектуры. Node 20.',
        budget: 3000000,
        serviceFee: 300000,
        totalAmount: 3300000,
        tags: 'Node.js,WebSocket,Профилирование',
        deadlineDays: 3,
        stageCount: 1,
        status: 'OPEN',
        clientId: owner.id,
      },
    })
  ).id

  // A second gig assigned to the specialist (IN_PROGRESS) + a notification — so the specialist dashboard feed and the
  // «Требует внимания» row have content.
  const gig2 = await prisma.gig.create({
    data: {
      title: 'Миграция аналитического дашборда на Next.js 14',
      description: 'Перенести аналитический дашборд на Next.js 14 (app router), сохранить SSR и графики.',
      acceptanceCriteria: 'SSR работает\nГрафики перенесены\nLighthouse ≥ 90',
      goal: 'Миграция на app router',
      deliverables: 'Рабочий дашборд на Next 14',
      constraints: 'Next 14, React 19',
      budget: 8000000,
      serviceFee: 800000,
      totalAmount: 8800000,
      tags: 'React,Next.js 14,TypeScript',
      deadlineDays: 10,
      stageCount: 2,
      status: 'IN_PROGRESS',
      clientId: owner.id,
      assignedSpecialistId: spec.id,
    },
  })
  await prisma.notification.create({
    data: { userId: spec.id, gigId: gig2.id, type: 'STATUS_CHANGE', eventType: 'application_accepted' },
  })

  // A pending application on the OPEN gig — so the owner's «Отклики» screen has an applicant (with accept/reject).
  await prisma.application.create({
    data: {
      gigId,
      specialistId: spec.id,
      approach: 'Профилирую heap через clinic.js и heapdump, найду удерживаемые ссылки, устраню по итерациям.',
      questions: 'Есть ли доступ к стейджингу с реальной нагрузкой? Какой бюджет по времени на профилирование?',
      estimatedEffort: '~3 дня, из них 1 на профилирование',
      status: 'PENDING',
    },
  })

  await prisma.$disconnect()
})

async function settle(page: any) {
  await page.evaluate(() => (document as any).fonts?.ready)
  await page.waitForTimeout(600)
}

test('specialist — dark', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
  await page.goto(`/gigs/${gigId}`)
  await settle(page)
  await page.screenshot({ path: `${OUT}/gigdetail-spec-dark.png`, fullPage: true })
})

test('specialist — light', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await page.addInitScript(() => window.localStorage.setItem('gigly-theme', 'light'))
  await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
  await page.goto(`/gigs/${gigId}`)
  await settle(page)
  await page.screenshot({ path: `${OUT}/gigdetail-spec-light.png`, fullPage: true })
})

test('owner — dark', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
  await page.goto(`/gigs/${gigId}`)
  await settle(page)
  await page.screenshot({ path: `${OUT}/gigdetail-owner-dark.png`, fullPage: true })
})

test('my-gigs (un-ported content) in new shell — dark', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
  await page.goto(`/my-gigs`)
  await settle(page)
  await page.screenshot({ path: `${OUT}/mygigs-shell-dark.png`, fullPage: true })
})

test('dashboard — specialist (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
  await page.goto('/dashboard')
  await settle(page)
  await page.screenshot({ path: `${OUT}/dashboard-specialist-dark.png`, fullPage: true })
})

test('dashboard — client (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
  await page.goto('/dashboard')
  await settle(page)
  await page.screenshot({ path: `${OUT}/dashboard-client-dark.png`, fullPage: true })
})

test('my-gigs — client (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
  await page.goto('/my-gigs')
  await settle(page)
  await page.screenshot({ path: `${OUT}/mygigs-client-dark.png`, fullPage: true })
})

test('browse — specialist (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
  await page.goto('/gigs')
  await settle(page)
  await page.screenshot({ path: `${OUT}/browse-spec-dark.png`, fullPage: true })
})

test('create-gig — client (dark, partially filled)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
  await page.goto('/gigs/new')
  await settle(page)
  await page.fill('input[name="title"]', 'Исправить утечку памяти в Node.js')
  await page.fill('textarea[name="description"]', 'Сервер на ws + express. При 200+ подключениях память растёт до 2 ГБ за 3 часа.')
  await page.getByText('Программирование', { exact: true }).click()
  await page.fill('input[name="budget"]', '150000')
  await page.fill('input[name="deadlineDays"]', '14')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/creategig-client-dark.png`, fullPage: true })
})

test('applications — owner (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 })
  await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
  await page.goto(`/gigs/${gigId}/applications`)
  await settle(page)
  await page.screenshot({ path: `${OUT}/applications-owner-dark.png`, fullPage: true })
})
