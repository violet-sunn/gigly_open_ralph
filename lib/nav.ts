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
export function buildAdminNav(openDisputes?: number): SidebarNavItemVM[] {
  // «Модерация» is the moderation console (overview); «Споры» is the dedicated full dispute list (all statuses +
  // filter); «Пользователи»/«Гиги» are the paginated management tables. The prototype only has the single console —
  // the dispute list + tables are the app's management extensions (see transport-admin-console).
  //
  // The «Споры» badge is the moderation queue length (OPEN disputes) — the admin's "a new dispute needs you" signal,
  // since disputes are not participant notifications and never reached the bell. Seeded server-side per render.
  return [
    { icon: 'dashboard', label: 'Модерация', href: '/admin', active: false },
    { icon: 'disputes', label: 'Споры', href: '/admin/disputes', count: openDisputes || undefined, active: false },
    { icon: 'search', label: 'Пользователи', href: '/admin/users', active: false },
    { icon: 'my-gigs', label: 'Гиги', href: '/admin/gigs', active: false },
  ]
}

/**
 * Mark the active nav item as the one whose href is the LONGEST match for the current pathname — either an exact
 * match or a path-segment prefix (`href + '/'`). Longest-match ensures a parent route (e.g. `/admin`, which is a
 * prefix of `/admin/users` and `/admin/gigs`) is active ONLY on itself, not on its children — so exactly one item
 * highlights at a time.
 */
export function markActive(items: SidebarNavItemVM[], pathname: string): SidebarNavItemVM[] {
  let best = ''
  for (const item of items) {
    const matches = pathname === item.href || pathname.startsWith(item.href + '/')
    if (matches && item.href.length > best.length) best = item.href
  }
  return items.map((item) => ({ ...item, active: best !== '' && item.href === best }))
}
