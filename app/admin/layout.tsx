import type { ReactNode } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/app/components/templates/AppShell'
import { TopbarLive } from '@/app/components/blocks'
import { AdminNavLive } from './AdminNavLive'

/**
 * Admin shell (prove-extensibility-admin, Phase 2) — the AppShell template + the admin SidebarNav/Topbar (replacing the
 * legacy MainNav), so the admin moderation screens sit in the same shell as every other Phase-2 screen. Preserves the
 * session + ADMIN guard.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'ADMIN') redirect('/dashboard')

  const unread = await prisma.notification.count({
    where: { userId: session.userId, lastReadAt: null },
  })
  const profile = { avatar: '', name: session.email, roleTag: session.role }

  return (
    <AppShell
      sidebar={<AdminNavLive profile={profile} />}
      topbar={<TopbarLive profile={profile} unread={unread} />}
    >
      {children}
    </AppShell>
  )
}
