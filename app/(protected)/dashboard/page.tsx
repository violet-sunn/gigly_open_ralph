import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getClientDashboard, getSpecialistDashboard } from '@/lib/view-models'
import { ClientDashboard } from './ClientDashboard'
import { SpecialistDashboard } from './SpecialistDashboard'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Extract error parameter for displaying error messages
  const params = await searchParams
  const errorParam = typeof params.error === 'string' ? params.error : undefined

  const errorMessages: Record<string, string> = {
    'browse-gigs-specialists-only': 'Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page.',
    'gigs-specialists-only': 'Browse Gigs is only available for specialists.',
    'gig-creation-clients-only': 'Creating gigs is only available for clients.',
    'admin-access-required': 'Admin access is required for this page.',
  }

  const errorMessage = errorParam ? errorMessages[errorParam] : null
  const notice = errorMessage ? (
    <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4 mb-6">
      <p className="text-sm text-warning-400">{errorMessage}</p>
    </div>
  ) : null

  // CLIENT dashboard — composed purely from the kit (compose-client-dashboard, Phase 2).
  if (session.role === 'CLIENT') {
    const data = await getClientDashboard(session.userId)
    return (
      <>
        {notice}
        <ClientDashboard {...data} />
      </>
    )
  }

  // SPECIALIST dashboard — composed purely from the kit (compose-specialist-dashboard, Phase 2).
  if (session.role === 'SPECIALIST') {
    const data = await getSpecialistDashboard(session.userId)
    return (
      <>
        {notice}
        <SpecialistDashboard {...data} />
      </>
    )
  }

  // Unknown role — fallback notice (the shell provides the surrounding layout).
  return (
    <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 text-center shadow-md">
      <h2 className="text-3xl font-bold text-white leading-tight">Dashboard</h2>
      <p className="mt-2 text-sm text-neutral-strong">Signed in as {session.email}</p>
      <p className="mt-4 text-sm text-warning-400">Your account role is not recognized. Please contact support.</p>
    </div>
  )
}
