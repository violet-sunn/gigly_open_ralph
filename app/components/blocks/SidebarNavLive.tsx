'use client'

import { usePathname } from 'next/navigation'
import { SidebarNav } from './SidebarNav'
import { Button } from '@/app/components/primitives'
import { buildSidebarNav, markActive, type NavRole, type NavCounts } from '@/lib/nav'
import { logoutUser } from '@/app/actions/auth'
import type { ProfileCardVM } from './view-models'

/**
 * Live wrapper for the presentational SidebarNav block. Builds the role-based RU nav (lib/nav), marks the active
 * item from `usePathname`, and injects the interactive logout form via the block's `logout` slot. Client-only — so
 * the protected layout stays a pure server composition.
 */
export function SidebarNavLive({
  role,
  counts,
  profile,
}: {
  role: NavRole
  counts: NavCounts
  profile: ProfileCardVM
}) {
  const pathname = usePathname()
  const items = markActive(buildSidebarNav(role, counts), pathname)
  return (
    <SidebarNav
      vm={{ role: role === 'SPECIALIST' ? 'specialist' : 'client', items, collapsed: false, profile }}
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
