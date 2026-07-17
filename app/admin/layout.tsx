import type { ReactNode } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { AppShellDesign } from '@/app/_design/AppShellDesign'
import { countOpenDisputes } from '@/lib/disputes'

/**
 * Admin shell — rebuilt on the gigly_full_design prototype's shell (AppShellDesign in `admin` mode: the design sidebar
 * with the admin nav + «Админ» role indicator + the «МОДЕРАЦИЯ» header zone). Preserves the session + ADMIN guard.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'ADMIN') redirect('/dashboard')

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
