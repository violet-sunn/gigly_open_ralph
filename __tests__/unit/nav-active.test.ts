import { describe, it, expect } from 'vitest'
import { buildAdminNav, buildSidebarNav, markActive } from '@/lib/nav'
import { disputeLabel } from '@/app/_design/util'

describe('admin nav (disputes/moderation present + dedicated Споры)', () => {
  it('is Модерация · Споры · Пользователи · Гиги, with Споры on the disputes icon', () => {
    const items = buildAdminNav()
    expect(items.map((i) => i.label)).toEqual(['Модерация', 'Споры', 'Пользователи', 'Гиги'])
    const spory = items.find((i) => i.label === 'Споры')
    expect(spory).toMatchObject({ icon: 'disputes', href: '/admin/disputes' })
  })
})

describe('markActive (exactly one active; parent not lit on children)', () => {
  const active = (items: ReturnType<typeof buildAdminNav>, path: string) =>
    markActive(items, path).filter((i) => i.active).map((i) => i.href)

  it('/admin → only «Модерация»', () => {
    expect(active(buildAdminNav(), '/admin')).toEqual(['/admin'])
  })
  it('/admin/disputes → only «Споры» (NOT /admin)', () => {
    expect(active(buildAdminNav(), '/admin/disputes')).toEqual(['/admin/disputes'])
  })
  it('/admin/users → only «Пользователи» (NOT /admin)', () => {
    expect(active(buildAdminNav(), '/admin/users')).toEqual(['/admin/users'])
  })
  it('/admin/gigs → only «Гиги» (NOT /admin)', () => {
    expect(active(buildAdminNav(), '/admin/gigs')).toEqual(['/admin/gigs'])
  })

  it('regular nav: /my-gigs lights only «Мои гиги»', () => {
    const r = markActive(buildSidebarNav('SPECIALIST'), '/my-gigs').filter((i) => i.active).map((i) => i.href)
    expect(r).toEqual(['/my-gigs'])
  })
  it('regular nav: /disputes/abc lights only «Споры»', () => {
    const r = markActive(buildSidebarNav('CLIENT'), '/disputes/abc').filter((i) => i.active).map((i) => i.href)
    expect(r).toEqual(['/disputes'])
  })
  it('regular nav: /dashboard lights only «Дашборд»', () => {
    const r = markActive(buildSidebarNav('CLIENT'), '/dashboard').filter((i) => i.active).map((i) => i.href)
    expect(r).toEqual(['/dashboard'])
  })
})

describe('disputeLabel (RESOLVED reads «Решён», not the gig «Завершён»)', () => {
  it('maps the design statuses to dispute terms', () => {
    expect(disputeLabel('open')).toBe('Открыт')
    expect(disputeLabel('completed')).toBe('Решён')
    expect(disputeLabel('rejected')).toBe('Отклонён')
  })
})
