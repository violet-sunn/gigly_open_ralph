'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Active Work
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Pending Applications
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'archive'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Archive
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'active' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Work</h3>
            {activeWorkGigs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active work.{' '}
                <Link href="/gigs" className="text-primary hover:text-primary/90 underline">
                  Browse and apply to gigs
                </Link>{' '}
                to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {activeWorkGigs.map((gig) => (
                  <Link
                    key={gig.id}
                    href={`/gigs/${gig.id}?from=dashboard&tab=active`}
                    className="block bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{gig.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Client: {gig.client.clientProfile?.companyName || gig.client.email}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Updated: {new Date(gig.updatedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-foreground">{formatRoubles(gig.budget)} ₽</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mt-1 ${
                          gig.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' :
                          gig.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-400' :
                          gig.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                          'bg-muted/50 text-muted-foreground'
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pending Applications</h3>
            {pendingApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending applications.</p>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/gigs/${app.gigId}?from=dashboard&tab=pending`}
                    className="block bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-foreground">{app.gig.title}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">{app.createdAt.toLocaleDateString('ru-RU')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Archive</h3>
            {paidGigs.length === 0 && archivedApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No archived items.</p>
            ) : (
              <div className="space-y-6">
                {/* Completed Gigs Section */}
                {paidGigs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Completed Gigs</h4>
                    <div className="space-y-4">
                      {paidGigs.map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/gigs/${gig.id}?from=dashboard&tab=archive`}
                          className="block bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-foreground">{gig.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                Client: {gig.client.clientProfile?.companyName || gig.client.email}
                              </p>
                              {gig.paidAt && (
                                <p className="text-xs text-green-400 mt-0.5">
                                  Paid on {new Date(gig.paidAt).toLocaleDateString('ru-RU')}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-semibold text-foreground">{formatRoubles(gig.budget)} ₽</p>
                              <span className="inline-block px-2 py-1 text-xs font-semibold rounded mt-1 bg-green-500/10 text-green-400">
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
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rejected & Withdrawn Applications</h4>
                    <div className="space-y-4">
                      {archivedApplications.map((app) => (
                        <Link
                          key={app.id}
                          href={`/gigs/${app.gigId}?from=dashboard&tab=archive`}
                          className="block bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-foreground">{app.gig.title}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              app.status === 'WITHDRAWN'
                                ? 'bg-muted/50 text-muted-foreground'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
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
