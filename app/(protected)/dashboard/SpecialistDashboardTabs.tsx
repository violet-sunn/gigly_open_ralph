'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import EmptyState from '@/app/components/onboarding/EmptyState'

interface Gig {
  id: string
  title: string
  status: string
  budget: number
  updatedAt: Date
  paidAt: Date | null
  client: {
    email: string
    clientProfile: {
      companyName: string
    } | null
  }
}

interface Application {
  id: string
  gigId: string
  status: string
  createdAt: Date
  updatedAt: Date
  gig: {
    title: string
    status: string
    paidAt: Date | null
  }
}

interface Props {
  activeGigs: Gig[]
  applications: Application[]
}

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export function SpecialistDashboardTabs({ activeGigs, applications }: Props) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as 'active' | 'pending' | 'archive' | null
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'archive'>(
    initialTab && ['active', 'pending', 'archive'].includes(initialTab) ? initialTab : 'active'
  )

  // Filter data for each tab
  const activeWorkGigs = activeGigs.filter(gig => gig.status !== 'PAID')
  const pendingApplications = applications.filter(app => app.status === 'PENDING')
  const paidGigs = activeGigs.filter(gig => gig.status === 'PAID')
  const archivedApplications = applications.filter(app =>
    app.status === 'REJECTED' || app.status === 'WITHDRAWN'
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-neutral-weak">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-neutral-strong hover:text-white hover:border-neutral-weak'
            }`}
          >
            Active Work
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-neutral-strong hover:text-white hover:border-neutral-weak'
            }`}
          >
            Pending Applications
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'archive'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-neutral-strong hover:text-white hover:border-neutral-weak'
            }`}
          >
            Archive
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'active' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Active Work</h3>
            {activeWorkGigs.length === 0 ? (
              <EmptyState
                icon="🔍"
                heading="No Active Work Yet"
                description="Browse available gigs and apply to projects that match your skills. Once accepted, your work will appear here."
                primaryAction={{ label: "Browse Gigs", href: "/gigs" }}
              />
            ) : (
              <div className="space-y-4">
                {activeWorkGigs.map((gig) => (
                  <Link
                    key={gig.id}
                    href={`/gigs/${gig.id}?from=dashboard&tab=active`}
                    className="block bg-surface-level-2 border border-neutral-weak rounded-lg p-4 hover:border-neutral-strong transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">{gig.title}</h4>
                        <p className="text-xs text-neutral-weak mt-1">
                          Client: {gig.client.clientProfile?.companyName || gig.client.email}
                        </p>
                        <p className="text-xs text-neutral-weak mt-0.5">
                          Updated: {new Date(gig.updatedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-white">{formatRoubles(gig.budget)} ₽</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md border mt-1 ${
                          gig.status === 'IN_PROGRESS' ? 'bg-success-weak-default text-success-default border-success-default' :
                          gig.status === 'REVIEW' ? 'bg-warning-weak-default text-warning-default border-warning-default' :
                          gig.status === 'COMPLETED' ? 'bg-success-weak-default text-success-default border-success-default' :
                          'bg-gray-500/20 text-neutral-weak border-gray-500/30'
                        }`}>
                          {gig.status === 'IN_PROGRESS' && 'In Progress'}
                          {gig.status === 'REVIEW' && 'Under Review'}
                          {gig.status === 'COMPLETED' && 'Completed - Awaiting Payment'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Applications</h3>
            {pendingApplications.length === 0 ? (
              <EmptyState
                icon="📝"
                heading="No Pending Applications"
                description="You haven't applied to any gigs yet. Browse open gigs and submit applications to get started."
                primaryAction={{ label: "Browse Gigs", href: "/gigs" }}
              />
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/gigs/${app.gigId}?from=dashboard&tab=pending`}
                    className="block bg-surface-level-2 border border-neutral-weak rounded-lg p-4 hover:border-neutral-strong transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-white">{app.gig.title}</span>
                      <span className="text-xs px-2 py-1 rounded-md border font-medium bg-warning-weak-default text-warning-default border-warning-default">
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-neutral-weak">{app.createdAt.toLocaleDateString('ru-RU')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Archive</h3>
            {paidGigs.length === 0 && archivedApplications.length === 0 ? (
              <EmptyState
                icon="📦"
                heading="No Archived Items"
                description="Completed gigs and rejected applications will appear here once you start working on projects."
              />
            ) : (
              <div className="space-y-6">
                {/* Completed Gigs Section */}
                {paidGigs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-weak uppercase tracking-wider mb-3">Completed Gigs</h4>
                    <div className="space-y-4">
                      {paidGigs.map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/gigs/${gig.id}?from=dashboard&tab=archive`}
                          className="block bg-surface-level-2 border border-neutral-weak rounded-lg p-4 hover:border-neutral-strong transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-white">{gig.title}</h5>
                              <p className="text-xs text-neutral-weak mt-1">
                                Client: {gig.client.clientProfile?.companyName || gig.client.email}
                              </p>
                              {gig.paidAt && (
                                <p className="text-xs text-success-400 mt-0.5">
                                  Paid on {new Date(gig.paidAt).toLocaleDateString('ru-RU')}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-semibold text-white">{formatRoubles(gig.budget)} ₽</p>
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-md border mt-1 bg-success-weak-default text-success-default border-success-default">
                                Paid
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected/Withdrawn Applications Section */}
                {archivedApplications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-weak uppercase tracking-wider mb-3">Rejected & Withdrawn Applications</h4>
                    <div className="space-y-4">
                      {archivedApplications.map((app) => (
                        <Link
                          key={app.id}
                          href={`/gigs/${app.gigId}?from=dashboard&tab=archive`}
                          className="block bg-surface-level-2 border border-neutral-weak rounded-lg p-4 hover:border-neutral-strong transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-white">{app.gig.title}</span>
                            <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                              app.status === 'WITHDRAWN'
                                ? 'bg-gray-500/20 text-neutral-weak border-gray-500/30'
                                : 'bg-danger-weak-default text-danger-default border-danger-default'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-neutral-weak">
                              {app.status === 'WITHDRAWN'
                                ? `Withdrawn on ${new Date(app.updatedAt).toLocaleDateString('ru-RU')}`
                                : `Applied on ${app.createdAt.toLocaleDateString('ru-RU')}`
                              }
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
