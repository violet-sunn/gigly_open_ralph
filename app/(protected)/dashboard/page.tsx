import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { SpecialistDashboardTabs } from './SpecialistDashboardTabs'
import { getRecentMessages } from '@/app/actions/message'
import { formatDistanceToNow } from 'date-fns'
import { DashboardOnboarding } from './DashboardOnboarding'
import ProfileCompletionCard from '@/app/components/onboarding/ProfileCompletionCard'
import EmptyState from '@/app/components/onboarding/EmptyState'

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

  // Fetch recent messages for dashboard sidebar
  const recentMessages = await getRecentMessages()

  return (
    <div className="min-h-screen bg-navy-900">
      {(session.role === 'CLIENT' || session.role === 'SPECIALIST') && (
        <DashboardOnboarding role={session.role} />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {session.role === 'CLIENT' ? (
          <div className="space-y-6">
            <ProfileCompletionCard
              role={session.role}
              profile={user?.clientProfile || null}
            />
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold text-white leading-tight">Welcome back, {user?.clientProfile?.companyName || session.email}</h2>
              <p className="mt-2 text-sm text-gray-300">Client Dashboard</p>
              <div className="mt-4">
                <Link href="/profile" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                  View Profile →
                </Link>
              </div>
            </div>

            {profileIncomplete && (
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                <p className="text-sm text-warning-400">
                  Complete your profile to build trust with specialists.{' '}
                  <Link href="/profile/edit" className="underline font-medium text-warning-300">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                <p className="text-sm text-warning-400">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">My Gigs</h3>
                    <Link
                      href="/gigs/new"
                      className="px-6 py-3 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
                    >
                      Post New Gig
                    </Link>
                  </div>
                  {gigs.length === 0 ? (
                    <EmptyState
                      icon="📋"
                      heading="Post Your First Gig"
                      description="Get started by posting a gig. Describe what you need, set your budget, and receive applications from qualified specialists."
                      primaryAction={{ label: "Create Gig", href: "/gigs/new" }}
                      secondaryAction={{ label: "View Example Gigs", href: "/gigs/examples" }}
                    />
                  ) : (
                    <div className="space-y-6">
                      {gigs.map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/gigs/${gig.id}?from=dashboard`}
                          className="block bg-navy-900 border border-gray-700 rounded-lg p-6 hover:bg-navy-700 hover:border-gray-600 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-white">{gig.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                              gig.status === 'PAID' ? 'bg-success-500/20 text-success-400 border-success-500/30' :
                              gig.status === 'COMPLETED' ? 'bg-warning-500/20 text-warning-400 border-warning-500/30' :
                              gig.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {gig.status === 'PAID' ? 'Paid' :
                               gig.status === 'COMPLETED' ? 'Completed' :
                               gig.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white font-semibold">{formatRoubles(gig.budget)} ₽</span>
                            <span className="text-gray-500 text-xs">
                              {gig._count.applications} app{gig._count.applications !== 1 ? 's' : ''} · {gig.createdAt.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          {gig.status === 'PAID' && gig.paidAt && (
                            <p className="mt-2 text-xs text-success-400">Paid on {gig.paidAt.toLocaleDateString('ru-RU')}</p>
                          )}
                          {gig.status === 'COMPLETED' && (
                            <p className="mt-2 text-xs text-warning-400">Awaiting Payment</p>
                          )}
                          {gig.assignedSpecialist && (
                            <p className="mt-2 text-xs text-blue-500">Specialist: {gig.assignedSpecialist.email}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Find Project Card */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Найти проект</h3>
                      <p className="text-sm text-gray-300 mb-3">Проекты и вакансии с актуальными заказами</p>
                      <Link
                        href="/gigs/new"
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Создать заказ
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Finances Card */}
                <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">ФИНАНСЫ</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Earned this month</p>
                      <p className="text-2xl font-bold text-white">$0.00</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Messages Card */}
                <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">СООБЩЕНИЯ</h3>
                  {recentMessages.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No recent messages</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-3">
                      {recentMessages.map((message) => (
                        <Link
                          key={message.gigId}
                          href={`/gigs/${message.gigId}#messages`}
                          className="block p-3 rounded-lg hover:bg-navy-700 transition-colors"
                        >
                          <h4 className="text-sm font-semibold text-white mb-1">{message.gigTitle}</h4>
                          <p className="text-xs text-gray-400 mb-1">{message.senderName}</p>
                          <p className="text-xs text-gray-300 mb-1">{message.contentPreview}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : session.role === 'SPECIALIST' ? (
          <div className="space-y-6">
            <ProfileCompletionCard
              role={session.role}
              profile={user?.specialistProfile || null}
            />
            <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold text-white leading-tight">Welcome back, {user?.specialistProfile?.displayName || session.email}</h2>
              <p className="mt-2 text-sm text-gray-300">Specialist Dashboard</p>
              <div className="mt-4 flex gap-4">
                <Link href="/profile" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                  View Profile →
                </Link>
                <Link href="/gigs" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                  Browse Gigs →
                </Link>
              </div>
            </div>

            {profileIncomplete && (
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                <p className="text-sm text-warning-400">
                  Complete your profile to stand out when applying to gigs.{' '}
                  <Link href="/profile/edit" className="underline font-medium text-warning-300">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                <p className="text-sm text-warning-400">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Tabs */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="h-64 animate-pulse bg-navy-800 rounded-lg" />}>
                  <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
                </Suspense>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Find Project Card */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Найти проект</h3>
                      <p className="text-sm text-gray-300 mb-3">Проекты и вакансии с актуальными заказами</p>
                      <Link
                        href="/gigs"
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Browse Gigs
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Finances Card */}
                <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">ФИНАНСЫ</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Earned this month</p>
                      <p className="text-2xl font-bold text-white">$0.00</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Messages Card */}
                <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">СООБЩЕНИЯ</h3>
                  {recentMessages.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No recent messages</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-3">
                      {recentMessages.map((message) => (
                        <Link
                          key={message.gigId}
                          href={`/gigs/${message.gigId}#messages`}
                          className="block p-3 rounded-lg hover:bg-navy-700 transition-colors"
                        >
                          <h4 className="text-sm font-semibold text-white mb-1">{message.gigTitle}</h4>
                          <p className="text-xs text-gray-400 mb-1">{message.senderName}</p>
                          <p className="text-xs text-gray-300 mb-1">{message.contentPreview}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 text-center shadow-md">
            <h2 className="text-3xl font-bold text-white leading-tight">Dashboard</h2>
            <p className="mt-2 text-sm text-gray-300">Signed in as {session.email}</p>
            <p className="mt-4 text-sm text-warning-400">Your account role is not recognized. Please contact support.</p>
          </div>
        )}
      </div>
    </div>
  )
}
