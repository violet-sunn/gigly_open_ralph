'use client'

import { Topbar } from './Topbar'
import { NotificationBell } from '@/app/components/NotificationBell'
import type { ProfileCardVM } from './view-models'

/**
 * Live wrapper for the presentational Topbar block. Injects the interactive NotificationBell via the block's
 * `notifications` slot. Client-only — so the protected layout stays a pure server composition.
 */
export function TopbarLive({ profile, unread }: { profile: ProfileCardVM; unread: number }) {
  return (
    <Topbar
      vm={{ profile, unreadNotifications: unread }}
      notifications={<NotificationBell />}
      gearHref="/settings"
    />
  )
}
