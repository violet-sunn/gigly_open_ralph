'use client'

import { usePathname } from 'next/navigation'
import { SidebarNav } from '@/app/components/blocks'
import { Button } from '@/app/components/primitives'
import { buildAdminNav } from '@/lib/nav'
import { logoutUser } from '@/app/actions/auth'
import type { ProfileCardVM } from '@/app/components/blocks/view-models'

/**
 * Live admin sidebar (prove-extensibility-admin) — the SidebarNav block built from the admin nav set + the active item
 * (exact for `/admin`, prefix for the sub-routes), with the logout slot. Client-only so the admin layout stays a
 * server composition. Mirrors SidebarNavLive.
 */
export function AdminNavLive({ profile }: { profile: ProfileCardVM }) {
  const pathname = usePathname()
  const items = buildAdminNav().map((item) => ({
    ...item,
    active: item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href),
  }))
  return (
    <SidebarNav
      vm={{ role: 'client', items, collapsed: false, profile }}
      logout={
        <form action={logoutUser}>
          <Button variant="ghost" type="submit">
            Выйти
          </Button>
        </form>
      }
    />
  )
}
