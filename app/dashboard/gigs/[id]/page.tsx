import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ApplyForm } from './apply-form'
import { ApplicationActions } from './application-actions'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const gig = await prisma.gig.findUnique({
    where: { id },
    include: {
      client: { select: { email: true } },
      assignedSpecialist: { select: { email: true } },
      applications: {
        include: { specialist: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Gig not found</h2>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const hasApplied = session.role === 'SPECIALIST' &&
    gig.applications.some((app) => app.specialistId === session.userId)
  const isOwner = session.role === 'CLIENT' && gig.clientId === session.userId

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/dashboard/gigs" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to Gigs
        </Link>

        <div className="mt-4 bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{gig.title}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{gig.status}</span>
          </div>

          <p className="text-sm text-gray-600 whitespace-pre-wrap">{gig.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Budget:</span>
              <span className="ml-2 font-medium">{formatRoubles(gig.budget)} ₽</span>
            </div>
            <div>
              <span className="text-gray-500">Posted by:</span>
              <span className="ml-2 font-medium">{gig.client.email}</span>
            </div>
          </div>

          {gig.tags && (
            <div className="flex gap-2">
              {gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Posted {gig.createdAt.toLocaleDateString('ru-RU')}
          </p>
        </div>

        {session.role === 'SPECIALIST' && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            {hasApplied ? (
              <div className="text-center">
                <p className="text-sm text-green-700 font-medium">You have already applied to this gig.</p>
              </div>
            ) : gig.status !== 'OPEN' ? (
              <div className="text-center">
                <p className="text-sm text-gray-500">This gig is no longer accepting applications.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Apply to this Gig</h3>
                <ApplyForm gigId={gig.id} />
              </>
            )}
          </div>
        )}

        {isOwner && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            {gig.status === 'IN_PROGRESS' && gig.assignedSpecialist && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Assigned to:</span> {gig.assignedSpecialist.email}
                </p>
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Applications ({gig.applications.length})
            </h3>
            {gig.applications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No applications yet.</p>
            ) : (
              <ul className="space-y-3">
                {gig.applications.map((app) => (
                  <li key={app.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-900">{app.specialist.email}</span>
                      {app.status === 'ACCEPTED' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Accepted</span>
                      ) : app.status === 'REJECTED' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Rejected</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                      )}
                    </div>
                    {app.coverLetter && (
                      <p className="mt-1 text-sm text-gray-600">{app.coverLetter}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{app.createdAt.toLocaleDateString('ru-RU')}</p>
                    {app.status === 'PENDING' && gig.status === 'OPEN' && (
                      <ApplicationActions applicationId={app.id} />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
