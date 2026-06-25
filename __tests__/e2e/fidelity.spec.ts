import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * DESIGN-TOKEN RENDER FIDELITY — verifies the shipped design-token bridge `app/_design/tokens.css`
 * actually loads and resolves in the browser on a rebuilt design route, in both the default (dark)
 * theme and the light (`data-theme="light"`) override.
 *
 * This replaces the former kit-era fidelity-capture spec (which screenshot-diffed the legacy
 * design-system catalog vs a lossy reference frame). After the gigly_full_design reground the app no
 * longer derives from that kit — every screen renders the prototype's inline-styled markup keyed off
 * the tokens defined here. The assertions read resolved `:root` CSS custom properties (NOT per-screen
 * markup) so the spec stays stable while the per-screen reconciliation changes rewrite those screens.
 *
 * The asserted tokens (--surface-card / --text-1 / --accent-ink / --surface-app) are defined ONLY in
 * app/_design/tokens.css — not in globals.css or fig-tokens.css — so their resolution proves that file
 * loaded and that its light cascade works. It reads computed CSS variables only — no import of the
 * screenshot-diff engine, no navigation to a catalog route, and no dependency on the retired kit gates.
 */

let userId: string
let userEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  userEmail = `fidelity-tokens-${Date.now()}@example.com`
  const user = await prisma.user.create({
    data: {
      email: userEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Токены', inn: '7700000000' } },
    },
  })
  userId = user.id
  await prisma.$disconnect()
})

test.describe('fidelity — app/_design/tokens.css renders', () => {
  test('design tokens resolve to their committed dark values on a rebuilt route', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard') // DashboardDesign imports app/_design/tokens.css

    // Poll until tokens.css has applied to :root (tolerates stylesheet-load timing).
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--surface-card').trim(),
          ),
        { message: 'app/_design/tokens.css should resolve --surface-card on :root' },
      )
      .toBe('#0e101a')

    const dark = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        card: cs.getPropertyValue('--surface-card').trim(),
        text1: cs.getPropertyValue('--text-1').trim(),
        accent: cs.getPropertyValue('--accent-ink').trim(),
      }
    })
    expect(dark).toEqual({ card: '#0e101a', text1: '#ffffff', accent: '#4ea3ff' })
  })

  test('the light-theme override from tokens.css cascades under [data-theme="light"]', async ({ page }) => {
    await setE2ESession(page, { id: userId, email: userEmail, role: 'CLIENT' })
    await page.goto('/dashboard')

    // Wait for tokens.css (dark default) to apply before flipping the theme.
    await expect
      .poll(() =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--surface-card').trim(),
        ),
      )
      .toBe('#0e101a')

    // Set data-theme="light" and read the resolved tokens synchronously in the SAME evaluate, so no
    // re-render can interfere — proving the html[data-theme="light"] block in tokens.css cascades.
    const light = await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light')
      const cs = getComputedStyle(document.documentElement)
      return {
        card: cs.getPropertyValue('--surface-card').trim(),
        accent: cs.getPropertyValue('--accent-ink').trim(),
        app: cs.getPropertyValue('--surface-app').trim(),
      }
    })
    expect(light).toEqual({ card: '#ffffff', accent: '#0a66c2', app: '#f4f5f7' })
  })
})
