import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { SpecialistDashboardTabs } from './SpecialistDashboardTabs'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

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

  // Fetch user with profile
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      clientProfile: true,
      specialistProfile: true,
    },
  })

  // Check profile completion
  let profileIncomplete = false
  if (session.role === 'CLIENT') {
    profileIncomplete = !user?.clientProfile || !user.clientProfile.companyName || !user.clientProfile.inn
  } else if (session.role === 'SPECIALIST') {
    profileIncomplete = !user?.specialistProfile || !user.specialistProfile.techStack || !user.specialistProfile.experienceLevel
  }

  const gigs = session.role === 'CLIENT'
    ? await prisma.gig.findMany({
        where: { clientId: session.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { applications: true } },
          assignedSpecialist: { select: { email: true } },
        },
      })
    : []

  const activeGigs = session.role === 'SPECIALIST'
    ? await prisma.gig.findMany({
        where: {
          assignedSpecialistId: session.userId,
          status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
        },
        include: {
          client: {
            select: {
              email: true,
              clientProfile: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    : []

  const applications = session.role === 'SPECIALIST'
    ? await prisma.application.findMany({
        where: { specialistId: session.userId },
        include: {
          gig: {
            select: {
              title: true,
              status: true,
              paidAt: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {session.role === 'CLIENT' ? (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground leading-tight">Welcome back, {user?.clientProfile?.companyName || session.email}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Client Dashboard</p>
              <div className="mt-4">
                <Link href="/profile" className="text-sm text-primary hover:text-primary/90 font-medium">
                  View Profile →
                </Link>
              </div>
            </div>

            {profileIncomplete && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                  Complete your profile to build trust with specialists.{' '}
                  <Link href="/profile/edit" className="underline font-medium text-yellow-100">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-200">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">My Gigs</h3>
                    <Link
                      href="/gigs/new"
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                    >
                      Post New Gig
                    </Link>
                  </div>
                  {gigs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No gigs posted yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {gigs.map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/gigs/${gig.id}?from=dashboard`}
                          className="block bg-background border border-border rounded-lg p-6 hover:border-primary transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-foreground">{gig.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              gig.status === 'PAID' ? 'bg-green-500/10 text-green-400' :
                              gig.status === 'COMPLETED' ? 'bg-yellow-500/10 text-yellow-400' :
                              gig.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-muted/50 text-muted-foreground'
                            }`}>
                              {gig.status === 'PAID' ? 'Paid' :
                               gig.status === 'COMPLETED' ? 'Completed' :
                               gig.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground font-semibold">{formatRoubles(gig.budget)} ₽</span>
                            <span className="text-muted-foreground text-xs">
                              {gig._count.applications} app{gig._count.applications !== 1 ? 's' : ''} · {gig.createdAt.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          {gig.status === 'PAID' && gig.paidAt && (
                            <p className="mt-2 text-xs text-green-400">Paid on {gig.paidAt.toLocaleDateString('ru-RU')}</p>
                          )}
                          {gig.status === 'COMPLETED' && (
                            <p className="mt-2 text-xs text-yellow-400">Awaiting Payment</p>
                          )}
                          {gig.assignedSpecialist && (
                            <p className="mt-2 text-xs text-primary">Specialist: {gig.assignedSpecialist.email}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      href="/gigs/new"
                      className="block p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Post a Gig</p>
                          <p className="text-xs text-muted-foreground">Find specialists</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : session.role === 'SPECIALIST' ? (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground leading-tight">Welcome back, {user?.specialistProfile?.displayName || session.email}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Specialist Dashboard</p>
              <div className="mt-4 flex gap-4">
                <Link href="/profile" className="text-sm text-primary hover:text-primary/90 font-medium">
                  View Profile →
                </Link>
                <Link href="/gigs" className="text-sm text-primary hover:text-primary/90 font-medium">
                  Browse Gigs →
                </Link>
              </div>
            </div>

            {profileIncomplete && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                  Complete your profile to stand out when applying to gigs.{' '}
                  <Link href="/profile/edit" className="underline font-medium text-yellow-100">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-200">{errorMessage}</p>
              </div>
            )}

            <Suspense fallback={<div className="h-64 animate-pulse bg-card rounded-lg" />}>
              <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
            </Suspense>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground leading-tight">Dashboard</h2>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {session.email}</p>
            <p className="mt-4 text-sm text-yellow-400">Your account role is not recognized. Please contact support.</p>
          </div>
        )}
      </div>
    </div>
  )
}
