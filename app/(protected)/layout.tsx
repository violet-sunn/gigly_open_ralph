/* @composed-screen */
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/app/components/templates/AppShell'
import { SidebarNavLive, TopbarLive } from '@/app/components/blocks'
import { getUnreadChatCount } from '@/lib/view-models'

/**
 * Protected app shell (compose-shell-cutover, Phase 2). A composition-pure screen: AppShell template +
 * SidebarNav/Topbar blocks (via the live wrappers) + page content. Desktop-only. Preserves the session guard
 * (getSession → /login), logout, the NotificationBell, and the #main-content focus target (provided by AppShell).
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const role = session.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
  const [gigs, unread, unreadChats] = await Promise.all([
    prisma.gig.count({
      where: role === 'CLIENT' ? { clientId: session.userId } : { assignedSpecialistId: session.userId },
    }),
    prisma.notification.count({ where: { userId: session.userId, lastReadAt: null } }),
    getUnreadChatCount({ userId: session.userId, role: session.role }),
  ])

  const profile = { avatar: '', name: session.email, roleTag: session.role }

  return (
    <AppShell
      sidebar={<SidebarNavLive role={role} counts={{ gigs, chats: unreadChats }} profile={profile} />}
      topbar={<TopbarLive profile={profile} unread={unread} />}
    >
      {children}
    </AppShell>
  )
}
