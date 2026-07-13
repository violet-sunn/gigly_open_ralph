import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AppShellDesign } from '@/app/_design/AppShellDesign'
import { getUnreadChatCount } from '@/lib/view-models'

/**
 * Protected app shell — rebuilt on the gigly_full_design prototype's own shell markup (AppShellDesign: sidebar with the
 * profile/role/nav + the «ПРОЕКТ»-style header zone). Preserves the session guard (getSession → /login), logout, the
 * NotificationBell, and the #main-content focus target (provided by AppShellDesign). Desktop-only.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  // An ADMIN reaching a (protected) route — e.g. a dispute detail at /disputes/[id] — gets the admin shell (admin nav +
  // «Админ» indicator), NOT the CLIENT/«Компания» one. Mirrors app/admin/layout.tsx.
  if (session.role === 'ADMIN') {
    return (
      <AppShellDesign role="CLIENT" counts={{}} admin profile={{ name: session.email, sub: 'Админ' }}>
        {children}
      </AppShellDesign>
    )
  }

  const role = session.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
  const [gigs, unreadChats, user] = await Promise.all([
    prisma.gig.count({
      where: role === 'CLIENT' ? { clientId: session.userId } : { assignedSpecialistId: session.userId },
    }),
    getUnreadChatCount({ userId: session.userId, role: session.role }),
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { specialistProfile: true, clientProfile: true },
    }),
  ])

  const name =
    role === 'SPECIALIST'
      ? user?.specialistProfile?.displayName || session.email
      : user?.clientProfile?.companyName || session.email
  const sub = role === 'SPECIALIST' ? 'Специалист' : 'Компания'

  return (
    <AppShellDesign role={role} counts={{ gigs, chats: unreadChats }} profile={{ name, sub }}>
      {children}
    </AppShellDesign>
  )
}
