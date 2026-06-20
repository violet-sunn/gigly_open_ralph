import type { SidebarNavItemVM } from '@/app/components/blocks/view-models'

/**
 * Role-based sidebar navigation (the exact RU nav per role — DESIGN_SYSTEM_SPEC / SidebarNav fixtures).
 * Pure + server-safe (no React): the live client wrapper (SidebarNavLive) builds the VM from this and
 * marks the active item from `usePathname`. Counts (open gigs, unread chats) are computed in the layout.
 *
 * Nav targets for not-yet-built Phase-2 routes (/chats, /finances, /disputes, and the specialist /projects
 * list) are present per F3 (logical parity); those routes are delivered by their own compose-* changes.
 */
export type NavRole = 'CLIENT' | 'SPECIALIST'

export interface NavCounts {
  /** "Мои гиги" — posted gigs (CLIENT) or assigned gigs (SPECIALIST). */
  gigs?: number
  /** "Чаты" — unread conversations. */
  chats?: number
}

export function buildSidebarNav(role: NavRole, counts: NavCounts = {}): SidebarNavItemVM[] {
  const dashboard: SidebarNavItemVM = { icon: 'dashboard', label: 'Дашборд', href: '/dashboard', active: false }
  const search: SidebarNavItemVM = { icon: 'search', label: 'Поиск', href: '/gigs', active: false }
  // «Мои гиги» (reconcile-my-projects): the role-aware own-gigs screen at /my-gigs, both roles. The bare /gigs route
  // stays the SPECIALIST public browse/search (the «Поиск» item).
  const myGigs: SidebarNavItemVM = {
    icon: 'my-gigs',
    label: 'Мои гиги',
    href: '/my-gigs',
    count: counts.gigs,
    active: false,
  }
  const chats: SidebarNavItemVM = { icon: 'chats', label: 'Чаты', href: '/chats', count: counts.chats, active: false }
  const finances: SidebarNavItemVM = { icon: 'finances', label: 'Финансы', href: '/finances', active: false }
  const disputes: SidebarNavItemVM = { icon: 'disputes', label: 'Споры', href: '/disputes', active: false }

  // CLIENT: Дашборд · Мои гиги · Чаты · Финансы · Споры
  // SPECIALIST: + Поиск (after Дашборд)
  return role === 'SPECIALIST'
    ? [dashboard, search, myGigs, chats, finances, disputes]
    : [dashboard, myGigs, chats, finances, disputes]
}

/**
 * Admin sidebar nav (prove-extensibility-admin) — the moderation routes. Nav DATA only (not a kit addition); the
 * admin shell builds the VM from this + `markActive`, exactly like the role-based nav.
 */
export function buildAdminNav(): SidebarNavItemVM[] {
  return [
    { icon: 'dashboard', label: 'Дашборд', href: '/admin', active: false },
    { icon: 'search', label: 'Пользователи', href: '/admin/users', active: false },
    { icon: 'my-gigs', label: 'Гиги', href: '/admin/gigs', active: false },
  ]
}

/**
 * Mark the nav item matching the current pathname as active. `/dashboard` matches exactly (it is a prefix of
 * other routes); every other item matches by path prefix.
 */
export function markActive(items: SidebarNavItemVM[], pathname: string): SidebarNavItemVM[] {
  return items.map((item) => ({
    ...item,
    active: item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href),
  }))
}
