import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SpecialistDashboardTabs } from './SpecialistDashboardTabs'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {session.role === 'CLIENT' ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Client Dashboard</h2>
              <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            </div>
            {profileIncomplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  Complete your profile to build trust with specialists.{' '}
                  <Link href="/dashboard/profile/edit" className="underline font-medium">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}
            <div className="space-y-4">
              <Link
                href="/dashboard/profile"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/gigs/new"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Post a Gig
              </Link>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500 text-center mb-3">My Gigs</p>
                {gigs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center">No gigs posted yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {gigs.map((gig) => (
                      <li key={gig.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <Link href={`/dashboard/gigs/${gig.id}`} className="block rounded hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">{gig.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              gig.status === 'PAID' ? 'bg-green-100 text-green-700' :
                              gig.status === 'COMPLETED' ? 'bg-yellow-100 text-yellow-700' :
                              gig.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {gig.status === 'PAID' ? 'Paid' :
                               gig.status === 'COMPLETED' ? 'Completed' :
                               gig.status}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{formatRoubles(gig.budget)} ₽</span>
                            <span className="text-xs text-gray-400">
                              {gig._count.applications} app{gig._count.applications !== 1 ? 's' : ''} · {gig.createdAt.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          {gig.status === 'PAID' && gig.paidAt && (
                            <p className="mt-1 text-xs text-green-600">Paid on {gig.paidAt.toLocaleDateString('ru-RU')}</p>
                          )}
                          {gig.status === 'COMPLETED' && (
                            <p className="mt-1 text-xs text-yellow-600">Awaiting Payment</p>
                          )}
                          {gig.assignedSpecialist && (
                            <p className="mt-1 text-xs text-blue-600">Specialist: {gig.assignedSpecialist.email}</p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : session.role === 'SPECIALIST' ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Specialist Dashboard</h2>
              <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            </div>
            {profileIncomplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  Complete your profile to stand out when applying to gigs.{' '}
                  <Link href="/dashboard/profile/edit" className="underline font-medium">
                    Complete profile
                  </Link>
                </p>
              </div>
            )}
            <div className="space-y-4">
              <Link
                href="/dashboard/profile"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/gigs"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Browse Gigs
              </Link>

              <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            <p className="mt-4 text-sm text-yellow-600">Your account role is not recognized. Please contact support.</p>
          </div>
        )}
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
