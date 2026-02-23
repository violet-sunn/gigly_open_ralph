'use client'

import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'archive'>('active')

  // Filter data for each tab
  const activeWorkGigs = activeGigs.filter(gig => gig.status !== 'PAID')
  const pendingApplications = applications.filter(app => app.status === 'PENDING')
  const paidGigs = activeGigs.filter(gig => gig.status === 'PAID')
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED')

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Work
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Applications
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'archive'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Archive
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'active' && (
          <div className="border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-500 text-center mb-3">Active Work</p>
            {activeWorkGigs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center">
                No active work.{' '}
                <Link href="/dashboard/gigs" className="text-indigo-600 hover:text-indigo-800 underline">
                  Browse and apply to gigs
                </Link>{' '}
                to get started.
              </p>
            ) : (
              <ul className="space-y-3">
                {activeWorkGigs.map((gig) => (
                  <li key={gig.id}>
                    <Link
                      href={`/dashboard/gigs/${gig.id}`}
                      className="block border-b border-gray-100 pb-2 last:border-0 last:pb-0 rounded hover:bg-gray-50 transition-colors p-2 -m-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">{gig.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Client: {gig.client.clientProfile?.companyName || gig.client.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Updated: {new Date(gig.updatedAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-gray-900">{formatRoubles(gig.budget)} ₽</p>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mt-1 ${
                            gig.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            gig.status === 'REVIEW' ? 'bg-amber-100 text-amber-800' :
                            gig.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {gig.status === 'IN_PROGRESS' && 'In Progress'}
                            {gig.status === 'REVIEW' && 'Under Review'}
                            {gig.status === 'COMPLETED' && 'Completed - Awaiting Payment'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-500 text-center mb-3">Pending Applications</p>
            {pendingApplications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center">No pending applications.</p>
            ) : (
              <ul className="space-y-3">
                {pendingApplications.map((app) => (
                  <li key={app.id}>
                    <Link
                      href={`/dashboard/gigs/${app.gigId}`}
                      className="block border-b border-gray-100 pb-2 last:border-0 last:pb-0 rounded hover:bg-gray-50 transition-colors p-2 -m-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-900">{app.gig.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                          {app.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-400">{app.createdAt.toLocaleDateString('ru-RU')}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-500 text-center mb-3">Archive</p>
            {paidGigs.length === 0 && rejectedApplications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center">No archived items.</p>
            ) : (
              <div className="space-y-4">
                {/* Completed Gigs Section */}
                {paidGigs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Completed Gigs</h4>
                    <ul className="space-y-3">
                      {paidGigs.map((gig) => (
                        <li key={gig.id}>
                          <Link
                            href={`/dashboard/gigs/${gig.id}`}
                            className="block border-b border-gray-100 pb-2 last:border-0 last:pb-0 rounded hover:bg-gray-50 transition-colors p-2 -m-2"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900">{gig.title}</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                  Client: {gig.client.clientProfile?.companyName || gig.client.email}
                                </p>
                                {gig.paidAt && (
                                  <p className="text-xs text-green-600 mt-0.5">
                                    Paid on {new Date(gig.paidAt).toLocaleDateString('ru-RU')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-semibold text-gray-900">{formatRoubles(gig.budget)} ₽</p>
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded mt-1 bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rejected Applications Section */}
                {rejectedApplications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Rejected Applications</h4>
                    <ul className="space-y-3">
                      {rejectedApplications.map((app) => (
                        <li key={app.id}>
                          <Link
                            href={`/dashboard/gigs/${app.gigId}`}
                            className="block border-b border-gray-100 pb-2 last:border-0 last:pb-0 rounded hover:bg-gray-50 transition-colors p-2 -m-2"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-gray-900">{app.gig.title}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                {app.status}
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="text-xs text-gray-400">{app.createdAt.toLocaleDateString('ru-RU')}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
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
