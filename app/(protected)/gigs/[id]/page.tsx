import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { ApplyForm } from './apply-form'
import { ApplicationActions } from './application-actions'
import { SubmitWorkForm } from './submit-work-form'
import { ApproveWorkForm } from './approve-work-form'
import { MarkAsPaidButton } from '@/app/components/MarkAsPaidButton'
import { MessageList } from './message-list'
import { MessageForm } from './message-form'
import { WithdrawApplicationButton } from './withdraw-application-button'
import { BackButton } from '@/app/components/BackButton'
import { markNotificationAsRead } from '@/app/actions/notification'

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
        include: { clientProfile: true }
      },
      assignedSpecialist: true,
      applications: {
        include: {
          specialist: {
            include: { specialistProfile: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      },
      messages: {
        include: {
          sender: {
            include: {
              clientProfile: true,
              specialistProfile: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      moderations: session.role === 'ADMIN' ? {
        include: {
          admin: true
        },
        orderBy: { createdAt: 'desc' }
      } : false,
    },
  })

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-level-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Gig not found</h2>
        </div>
      </div>
    )
  }

  const hasApplied = session.role === 'SPECIALIST' &&
    gig.applications.some((app) => app.specialistId === session.userId)
  const myApplication = session.role === 'SPECIALIST'
    ? gig.applications.find(app => app.specialistId === session.userId)
    : null
  const isOwner = session.role === 'CLIENT' && gig.clientId === session.userId
  const isAssignedSpecialist = session.role === 'SPECIALIST' && gig.assignedSpecialistId === session.userId
  const canViewMessages = (isOwner || isAssignedSpecialist) && gig.assignedSpecialistId !== null

  // Mark notification as read if user is authorized
  if (isOwner || isAssignedSpecialist) {
    try {
      await markNotificationAsRead(id)
    } catch (error) {
      // Silently fail - don't block page render
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <div className="min-h-screen bg-surface-level-0 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Suspense fallback={<div className="h-8" />}>
            <BackButton />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gig Details Card */}
            <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-white leading-tight">{gig.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-4 ${
                  gig.status === 'PAID' ? 'bg-success-weak-default text-success-default' :
                  gig.status === 'COMPLETED' ? 'bg-warning-weak-default text-warning-default' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {gig.status === 'PAID' ? 'Paid' :
                   gig.status === 'COMPLETED' ? 'Completed - Awaiting Payment' :
                   gig.status}
                </span>
              </div>

              {gig.status === 'PAID' && gig.paidAt && (
                <div className="p-3 bg-success-500/10 border border-success-500/20 rounded-md">
                  <p className="text-sm text-success-400">
                    <span className="font-medium">Payment confirmed on:</span> {gig.paidAt.toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}

              {gig.isExample && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">✨</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">
                        Example Gig
                      </h3>
                      <p className="text-sm text-gray-300">
                        This is an example gig demonstrating best practices for writing clear requirements.
                        Use this as a reference when creating your own gigs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{gig.description}</p>

              {(gig.goal || gig.deliverables || gig.constraints) && (
                <div className="mt-6 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Additional Requirements</h3>

                  {gig.goal && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">🎯 Goal / Desired Outcome</h4>
                      <p className="text-white whitespace-pre-wrap">{gig.goal}</p>
                    </div>
                  )}

                  {gig.deliverables && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">📦 Specific Deliverables</h4>
                      <p className="text-white whitespace-pre-wrap">{gig.deliverables}</p>
                    </div>
                  )}

                  {gig.constraints && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">⚙️ Constraints & Preferences</h4>
                      <p className="text-white whitespace-pre-wrap">{gig.constraints}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-l-4 border-blue-500 bg-blue-500/10 p-4 mb-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Definition of Done
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {gig.acceptanceCriteria || 'Not specified'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">Budget:</span>
                  <span className="ml-2 font-medium text-white">{formatRoubles(gig.budget)} ₽</span>
                </div>
                <div>
                  <span className="text-gray-300">Posted by:</span>
                  <span className="ml-2 font-medium text-white">{gig.client.email}</span>
                  {gig.client.clientProfile?.companyName && (
                    <>
                      <br />
                      <Link
                        href={`/dashboard/profile/${gig.client.id}`}
                        className="ml-2 text-blue-500 hover:text-blue-400"
                      >
                        {gig.client.clientProfile.companyName}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {gig.tags && (
                <div className="flex gap-2 flex-wrap">
                  {gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-300">
                Posted {gig.createdAt.toLocaleDateString('ru-RU')}
              </p>
            </div>

        {session.role === 'SPECIALIST' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8">
            {gig.isExample ? (
              <div className="p-4 bg-navy-700/50 border border-gray-700 rounded-lg">
                <p className="text-sm text-white">
                  This is an example gig for demonstration purposes. You cannot apply to example gigs.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Use this example to understand what clear requirements look like when posting your own gigs.
                </p>
              </div>
            ) : myApplication && myApplication.status === 'PENDING' ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-success-400 font-medium">You have already applied to this gig.</p>
                </div>
                <div className="mt-4 p-4 bg-warning-500/10 border border-warning-500/20 rounded">
                  <p className="text-sm text-warning-200 mb-3">
                    Changed your mind? You can withdraw your application.
                  </p>
                  <WithdrawApplicationButton applicationId={myApplication.id} />
                </div>
              </>
            ) : myApplication && myApplication.status === 'WITHDRAWN' ? (
              <div className="p-4 bg-navy-700/50 border border-gray-700 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Your Application Status:</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-navy-700/50 text-gray-300">
                    WITHDRAWN
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  Withdrawn on {myApplication.updatedAt.toLocaleDateString('ru-RU')}
                </p>
              </div>
            ) : hasApplied ? (
              <div className="text-center">
                <p className="text-sm text-success-400 font-medium">You have already applied to this gig.</p>
              </div>
            ) : gig.status !== 'OPEN' ? (
              <div className="text-center">
                <p className="text-sm text-gray-300">This gig is no longer accepting applications.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-medium text-white mb-4">Apply to this Gig</h3>
                <ApplyForm gigId={gig.id} />
              </>
            )}
          </div>
        )}

        {isAssignedSpecialist && gig.status === 'IN_PROGRESS' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8">
            <h3 className="text-xl font-medium text-white mb-4">Submit Your Work</h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Once you&apos;ve completed the work, submit it for client review.
            </p>
            <SubmitWorkForm gigId={gig.id} />
          </div>
        )}

        {isOwner && gig.status === 'REVIEW' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8">
            <h3 className="text-xl font-medium text-white mb-4">Review Submitted Work</h3>
            {gig.assignedSpecialist && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm text-blue-500">
                  <span className="font-medium">Submitted by:</span> {gig.assignedSpecialist.email}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Review the specialist&apos;s work and approve it to mark the gig as completed.
            </p>
            <ApproveWorkForm gigId={gig.id} />
          </div>
        )}

        {isOwner && gig.status === 'COMPLETED' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8">
            <h3 className="text-xl font-medium text-white mb-4">Mark as Paid</h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Once you&apos;ve paid the specialist, mark this gig as paid to complete the transaction.
            </p>
            <MarkAsPaidButton gigId={gig.id} />
          </div>
        )}

        {isOwner && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8">
            {gig.status === 'IN_PROGRESS' && gig.assignedSpecialist && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm text-blue-500">
                  <span className="font-medium">Assigned to:</span> {gig.assignedSpecialist.email}
                </p>
              </div>
            )}
            <h3 className="text-xl font-medium text-white mb-6">
              Applications ({gig.applications.length})
            </h3>
            {gig.applications.length === 0 ? (
              <p className="text-sm text-gray-300 text-center">No applications yet.</p>
            ) : (
              <div className="space-y-6">
                {gig.applications.map((app) => (
                  <div key={app.id} className="bg-surface-level-2 border border-neutral-weak rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/profile/${app.specialist.id}`}
                          className="text-sm font-medium text-blue-500 hover:text-blue-400"
                        >
                          {app.specialist.specialistProfile?.displayName
                            ? `${app.specialist.specialistProfile.displayName} (${app.specialist.email})`
                            : app.specialist.email}
                        </Link>
                        {app.specialist.specialistProfile?.experienceLevel && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                            {app.specialist.specialistProfile.experienceLevel}
                          </span>
                        )}
                      </div>
                      {app.status === 'ACCEPTED' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-success-weak-default text-success-default">Accepted</span>
                      ) : app.status === 'REJECTED' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-danger-weak-default text-danger-default">Rejected</span>
                      ) : app.status === 'WITHDRAWN' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-500/50 text-gray-400">WITHDRAWN</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-warning-weak-default text-warning-default">Pending</span>
                      )}
                    </div>
                    {app.specialist.specialistProfile?.techStack && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {app.specialist.specialistProfile.techStack.split(',').map((tech) => tech.trim()).filter(Boolean).map((tech) => (
                          <span key={tech} className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Structured fields for new applications */}
                    {app.approach && app.questions ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <h5 className="text-sm font-semibold text-white">🔧 Technical Approach</h5>
                          <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{app.approach}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white">❓ Clarifying Questions</h5>
                          <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{app.questions}</p>
                        </div>
                        {app.estimatedEffort && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-300">⏱️ Estimated Effort</h5>
                            <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{app.estimatedEffort}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Legacy cover letter for old applications */
                      app.coverLetter && (
                        <div className="mt-3">
                          <h5 className="text-sm font-semibold text-white">Cover Letter</h5>
                          <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
                        </div>
                      )
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      {app.status === 'WITHDRAWN'
                        ? `Withdrawn on ${app.updatedAt.toLocaleDateString('ru-RU')}`
                        : app.createdAt.toLocaleDateString('ru-RU')
                      }
                    </p>
                    {app.status === 'PENDING' && gig.status === 'OPEN' && (
                      <div className="mt-4">
                        <ApplicationActions applicationId={app.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(isOwner || isAssignedSpecialist) && (
          <div id="messages" className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-medium text-white mb-6">Messages</h3>
            {gig.assignedSpecialistId === null ? (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm text-blue-500">
                  Messaging will be available once a specialist is assigned to this gig.
                </p>
              </div>
            ) : (
              <>
                <MessageList messages={gig.messages} currentUserId={session.userId} gigClientId={gig.clientId} />
                {!gig.closedByAdmin && gig.status !== 'PAID' && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <MessageForm gigId={gig.id} />
                  </div>
                )}
                {gig.closedByAdmin && (
                  <div className="mt-4 p-3 bg-navy-700/50 border border-gray-700 rounded-md">
                    <p className="text-sm text-gray-300">
                      This gig has been closed by administrators. Messaging is no longer available.
                    </p>
                  </div>
                )}
                {gig.status === 'PAID' && (
                  <div className="mt-4 p-3 bg-navy-700/50 border border-gray-700 rounded-md">
                    <p className="text-sm text-gray-300">
                      This gig has been marked as paid. Messaging is no longer available.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {session.role === 'ADMIN' && gig.moderations && gig.moderations.length > 0 && (
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-white mb-4">Moderation History</h3>
            <div className="space-y-3">
              {gig.moderations.map((log) => (
                <div key={log.id} className="border-b border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">
                        {log.action === 'CLOSE_GIG' ? 'Gig Closed' : log.action}
                      </span>
                      <p className="text-sm text-gray-300 mt-1">{log.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        By {'admin' in log ? (log as any).admin.email : 'Admin'} on {new Date(log.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gig.closedByAdmin && (
          <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4">
            <p className="text-sm text-error-400 font-medium">
              This gig has been closed by administrators and is no longer accepting applications.
            </p>
            {gig.closedAt && (
              <p className="text-xs text-error-400 mt-1">
                Closed on {new Date(gig.closedAt).toLocaleString('ru-RU')}
              </p>
            )}
          </div>
        )}
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Budget</h3>
                <p className="text-3xl font-bold text-white">{formatRoubles(gig.budget)} ₽</p>
                <p className="text-xs text-gray-300 mt-1">Fixed price</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
