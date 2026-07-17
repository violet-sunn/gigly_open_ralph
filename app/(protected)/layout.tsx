import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { AppShellDesign } from '@/app/_design/AppShellDesign'
import { computeNavCounts } from '@/lib/counts'
import { countOpenDisputes } from '@/lib/disputes'

/**
 * Protected app shell — rebuilt on the gigly_full_design prototype's own shell markup (AppShellDesign: sidebar with the
 * profile/role/nav + the «ПРОЕКТ»-style header zone). Preserves the session guard (getSession → /login), logout, the
 * NotificationBell, and the #main-content focus target (provided by AppShellDesign). Desktop-only.
 *
 * The counts computed here are the SSR *seed* only — AppShellDesign keeps them live from there (useLiveCounts), since
 * this shell does not re-mount on client-side navigation.
 */

// This shell is per-session (profile, role, counts) and must never be statically optimized or served from a shared
// cache — a proxy keying on URL alone would hand one user's shell to another, and is the suspected cause of the
// deployed «F5 не помогает, только перезаход» symptom.
export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  // An ADMIN reaching a (protected) route — e.g. a dispute detail at /disputes/[id] — gets the admin shell (admin nav +
  // «Админ» indicator), NOT the CLIENT/«Компания» one. Mirrors app/admin/layout.tsx.
  if (session.role === 'ADMIN') {
    const openDisputes = await countOpenDisputes()
    return (
      <AppShellDesign
        role="CLIENT"
        counts={{}}
        admin
        adminOpenDisputes={openDisputes}
        profile={{ name: session.email, sub: 'Админ' }}
      >
        {children}
      </AppShellDesign>
    )
  }

  const role = session.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
  const [{ gigs, chats: unreadChats }, user] = await Promise.all([
    computeNavCounts({ userId: session.userId, role: session.role }),
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
