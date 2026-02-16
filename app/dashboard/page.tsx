import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

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

  const applications = session.role === 'SPECIALIST'
    ? await prisma.application.findMany({
        where: { specialistId: session.userId },
        include: { gig: { select: { title: true } } },
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
            <div className="space-y-4">
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
                              gig.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>{gig.status}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{formatRoubles(gig.budget)} ₽</span>
                            <span className="text-xs text-gray-400">
                              {gig._count.applications} app{gig._count.applications !== 1 ? 's' : ''} · {gig.createdAt.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
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
            <div className="space-y-4">
              <Link
                href="/dashboard/gigs"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Browse Gigs
              </Link>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500 text-center mb-3">My Applications</p>
                {applications.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center">No applications yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {applications.map((app) => (
                      <li key={app.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-900">{app.gig.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{app.status}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-gray-400">{app.createdAt.toLocaleDateString('ru-RU')}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
