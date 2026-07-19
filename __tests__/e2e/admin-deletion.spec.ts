/**
 * E2E: Admin hard deletion (gig + user) with the blast-radius preview.
 *
 * 1. Setup client/specialist/admin + an OPEN gig with an application and a message (programmatic).
 * 2. Admin auth via cookie.
 * 3. /admin/gigs → «Удалить» → the confirm dialog shows the impact preview → confirm → the gig (and its
 *    application/message) is purged; row gone.
 * 4. /admin/users → «Удалить» is DISABLED on the admin's own row; enabled on the now-gig-less specialist → confirm →
 *    the user is purged.
 *
 * Uses `waitUntil: 'domcontentloaded'` throughout — the authenticated shell holds an open SSE connection, so
 * `networkidle` never fires.
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createTestUser, createTestGig, createTestApplication } from '../helpers/seed'
import { createTestSession } from '../helpers/auth'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter: adapter as any })

test.describe('Admin deletion E2E', () => {
  test.afterEach(async () => {
    // Child-first cleanup.
    await prisma.disputeEntry.deleteMany({})
    await prisma.dispute.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.notification.deleteMany({})
    await prisma.message.deleteMany({})
    await prisma.application.deleteMany({})
    await prisma.moderationLog.deleteMany({})
    await prisma.gig.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.user.deleteMany({})
  })
  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  // The delete button is a hydrated client control; on a cold dev compile React wires its onClick a beat after
  // domcontentloaded (and `networkidle` never fires — the shell holds an SSE connection). Open the dialog resiliently:
  // click, and if the dialog hasn't appeared, the click landed pre-hydration — retry.
  const openDeleteDialog = async (page: import('@playwright/test').Page, row: import('@playwright/test').Locator) => {
    const dialog = page.getByRole('dialog')
    for (let i = 0; i < 8; i++) {
      await row.getByRole('button', { name: 'Удалить' }).click()
      if (await dialog.isVisible().catch(() => false)) return dialog
      await page.waitForTimeout(750)
      if (await dialog.isVisible().catch(() => false)) return dialog
    }
    return dialog
  }

  test('admin previews then hard-deletes a gig, then deletes the now-clean user', async ({ page }) => {
    const t = Date.now()
    const s = Math.random().toString(36).slice(7)

    const client = await createTestUser(prisma, { role: 'CLIENT', email: `client-${t}-${s}@test.com`, companyName: 'ООО Тест' })
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', email: `spec-${t}-${s}@test.com`, displayName: 'Спец' })
    const admin = await createTestUser(prisma, { role: 'ADMIN', email: `admin-${t}-${s}@test.com` })

    const gig = await createTestGig(prisma, { clientId: client.id, title: `Тестовый гиг ${s}`, status: 'OPEN' })
    const app = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id, status: 'PENDING' })
    await prisma.message.create({ data: { gigId: gig.id, senderId: client.id, content: 'привет' } })

    // Admin auth via cookie (keeps the test DB consistent across setup + server actions).
    const token = await createTestSession(admin)
    await page.context().addCookies([
      { name: 'session', value: token, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax', expires: Math.floor(Date.now() / 1000) + 604800 },
    ])

    // ---- Delete the gig, with the preview ----
    await page.goto('http://localhost:3000/admin/gigs', { waitUntil: 'domcontentloaded' })
    const gigRow = page.locator('[data-row="gig"]').filter({ hasText: gig.title })
    await expect(gigRow).toBeVisible()

    const gigDialog = await openDeleteDialog(page, gigRow)
    await expect(gigDialog).toBeVisible()
    // The preview loads async, then names the irreversible purge.
    await expect(gigDialog).toContainText('безвозвратно', { timeout: 10000 })
    const gigConfirm = gigDialog.getByRole('button', { name: 'Удалить' })
    await expect(gigConfirm).toBeEnabled()

    await Promise.all([page.waitForURL(/\/admin\/gigs/, { timeout: 15000 }), gigConfirm.click()])
    await page.waitForTimeout(1500)

    // The gig and everything on it is gone.
    expect(await prisma.gig.findUnique({ where: { id: gig.id } })).toBeNull()
    expect(await prisma.application.findUnique({ where: { id: app.id } })).toBeNull()
    expect(await prisma.message.count({ where: { gigId: gig.id } })).toBe(0)
    const gigLog = await prisma.moderationLog.findFirst({ where: { action: 'DELETE_GIG' } })
    expect(gigLog?.reason).toContain(gig.title)

    // ---- Delete the (now gig-less, application-less) specialist ----
    await page.goto('http://localhost:3000/admin/users', { waitUntil: 'domcontentloaded' })

    // The admin's own «Удалить» is disabled.
    const adminRow = page.locator('[data-row="user"]').filter({ hasText: admin.email })
    await expect(adminRow.getByRole('button', { name: 'Удалить' })).toBeDisabled()

    // The specialist is deletable.
    const specRow = page.locator('[data-row="user"]').filter({ hasText: specialist.email })
    await expect(specRow).toBeVisible()
    const userDialog = await openDeleteDialog(page, specRow)
    await expect(userDialog).toContainText('безвозвратно', { timeout: 10000 })
    const userConfirm = userDialog.getByRole('button', { name: 'Удалить' })
    await expect(userConfirm).toBeEnabled()

    await Promise.all([page.waitForURL(/\/admin\/users/, { timeout: 15000 }), userConfirm.click()])
    await page.waitForTimeout(1500)

    expect(await prisma.user.findUnique({ where: { id: specialist.id } })).toBeNull()
    const userLog = await prisma.moderationLog.findFirst({ where: { action: 'DELETE_USER' } })
    expect(userLog?.reason).toContain(specialist.email)
  })
})
