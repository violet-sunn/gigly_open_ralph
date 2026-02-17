import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ApplyForm } from './apply-form'
import { ApplicationActions } from './application-actions'
import { SubmitWorkForm } from './submit-work-form'
import { ApproveWorkForm } from './approve-work-form'
import { MarkAsPaidButton } from '@/app/components/MarkAsPaidButton'
import { MessageList } from './message-list'
import { MessageForm } from './message-form'

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
      client: {
        select: {
          email: true,
          id: true,
        },
        include: { clientProfile: true }
      },
      assignedSpecialist: { select: { email: true } },
      applications: {
        include: {
          specialist: {
            select: {
              email: true,
              id: true,
            },
            include: { specialistProfile: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      },
      messages: {
        include: {
          sender: {
            select: { email: true, id: true },
            include: {
              clientProfile: { select: { companyName: true } },
              specialistProfile: { select: { displayName: true } }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      moderations: session.role === 'ADMIN' ? {
        include: {
          admin: {
            select: { email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      } : false,
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
  const isAssignedSpecialist = session.role === 'SPECIALIST' && gig.assignedSpecialistId === session.userId
  const canViewMessages = (isOwner || isAssignedSpecialist) && gig.assignedSpecialistId !== null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/dashboard/gigs" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to Gigs
        </Link>

        <div className="mt-4 bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{gig.title}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              gig.status === 'PAID' ? 'bg-green-100 text-green-700' :
              gig.status === 'COMPLETED' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {gig.status === 'PAID' ? 'Paid' :
               gig.status === 'COMPLETED' ? 'Completed - Awaiting Payment' :
               gig.status}
            </span>
          </div>

          {gig.status === 'PAID' && gig.paidAt && (
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">Payment confirmed on:</span> {gig.paidAt.toLocaleDateString('ru-RU')}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 whitespace-pre-wrap">{gig.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Budget:</span>
              <span className="ml-2 font-medium">{formatRoubles(gig.budget)} ₽</span>
            </div>
            <div>
              <span className="text-gray-500">Posted by:</span>
              <span className="ml-2 font-medium">{gig.client.email}</span>
              {gig.client.clientProfile?.companyName && (
                <>
                  <br />
                  <Link
                    href={`/dashboard/profile/${gig.client.id}`}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {gig.client.clientProfile.companyName}
                  </Link>
                </>
              )}
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

        {isAssignedSpecialist && gig.status === 'IN_PROGRESS' && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Work</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you&apos;ve completed the work, submit it for client review.
            </p>
            <SubmitWorkForm gigId={gig.id} />
          </div>
        )}

        {isOwner && gig.status === 'REVIEW' && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Submitted Work</h3>
            {gig.assignedSpecialist && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Submitted by:</span> {gig.assignedSpecialist.email}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Review the specialist&apos;s work and approve it to mark the gig as completed.
            </p>
            <ApproveWorkForm gigId={gig.id} />
          </div>
        )}

        {isOwner && gig.status === 'COMPLETED' && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mark as Paid</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you&apos;ve paid the specialist, mark this gig as paid to complete the transaction.
            </p>
            <MarkAsPaidButton gigId={gig.id} />
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
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/profile/${app.specialist.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {app.specialist.specialistProfile?.displayName
                            ? `${app.specialist.specialistProfile.displayName} (${app.specialist.email})`
                            : app.specialist.email}
                        </Link>
                        {app.specialist.specialistProfile?.experienceLevel && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {app.specialist.specialistProfile.experienceLevel}
                          </span>
                        )}
                      </div>
                      {app.status === 'ACCEPTED' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Accepted</span>
                      ) : app.status === 'REJECTED' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Rejected</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                      )}
                    </div>
                    {app.specialist.specialistProfile?.techStack && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {app.specialist.specialistProfile.techStack.split(',').map((tech) => tech.trim()).filter(Boolean).map((tech) => (
                          <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
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

        {(isOwner || isAssignedSpecialist) && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
            {gig.assignedSpecialistId === null ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  Messaging will be available once a specialist is assigned to this gig.
                </p>
              </div>
            ) : (
              <>
                <MessageList messages={gig.messages} currentUserId={session.userId} gigClientId={gig.clientId} />
                {!gig.closedByAdmin && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <MessageForm gigId={gig.id} />
                  </div>
                )}
                {gig.closedByAdmin && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600">
                      This gig has been closed by administrators. Messaging is no longer available.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {session.role === 'ADMIN' && gig.moderations && gig.moderations.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Moderation History</h3>
            <ul className="space-y-3">
              {gig.moderations.map((log) => (
                <li key={log.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {log.action === 'CLOSE_GIG' ? 'Gig Closed' : log.action}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{log.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        By {'admin' in log ? (log as any).admin.email : 'Admin'} on {new Date(log.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {gig.closedByAdmin && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              This gig has been closed by administrators and is no longer accepting applications.
            </p>
            {gig.closedAt && (
              <p className="text-xs text-red-600 mt-1">
                Closed on {new Date(gig.closedAt).toLocaleString('ru-RU')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
