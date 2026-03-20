import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CloseGigForm } from './CloseGigForm'
import { GigFilters } from './GigFilters'
import PaginationControls from '@/app/components/PaginationControls'

const PAGE_SIZE = 30

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminGigsPage(props: { searchParams: SearchParams }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const searchParams = await props.searchParams
  const statusFilter = searchParams.status as string | undefined
  const closedFilter = searchParams.closed as string | undefined

  // Extract and validate page parameter
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const redirectParams = new URLSearchParams()
    if (statusFilter) redirectParams.set('status', statusFilter)
    if (closedFilter) redirectParams.set('closed', closedFilter)
    const query = redirectParams.toString()
    redirect(`/admin/gigs${query ? `?${query}` : ''}`)
  }

  const where: any = {}
  if (statusFilter && ['OPEN', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'].includes(statusFilter)) {
    where.status = statusFilter
  }
  if (closedFilter === 'true') {
    where.closedByAdmin = true
  } else if (closedFilter === 'false') {
    where.closedByAdmin = false
  }

  // Execute queries in parallel: fetch paginated gigs and total count
  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        client: {
          include: {
            clientProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.gig.count({ where })
  ])

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Redirect if page exceeds total pages
  if (page > totalPages && totalPages > 0) {
    const redirectParams = new URLSearchParams()
    if (statusFilter) redirectParams.set('status', statusFilter)
    if (closedFilter) redirectParams.set('closed', closedFilter)
    redirectParams.set('page', totalPages.toString())
    const query = redirectParams.toString()
    redirect(`/admin/gigs${query ? `?${query}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Gig Management</h1>
          <p className="mt-2 text-gray-300">View and moderate gigs</p>
        </div>

        <div className="bg-surface-level-1 border border-neutral-weak rounded-lg mb-6 p-6 shadow-md">
          <GigFilters />
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-gray-300 mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
          </p>
        )}

        <div className="bg-surface-level-1 border border-neutral-weak rounded-lg overflow-hidden shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-navy-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-level-1 divide-y divide-gray-700">
              {gigs.map((gig) => (
                <tr key={gig.id}>
                  <td className="px-6 py-4 text-sm text-white">
                    <Link
                      href={`/gigs/${gig.id}`}
                      className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                      {gig.title}
                    </Link>
                    {gig.closedByAdmin && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-error-500/10 text-error-400">
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {gig.client.clientProfile?.companyName || gig.client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      gig.status === 'OPEN' ? 'bg-gray-500/20 text-gray-400' :
                      gig.status === 'IN_PROGRESS' ? 'bg-success-500/10 text-success-400' :
                      gig.status === 'REVIEW' ? 'bg-warning-500/10 text-warning-400' :
                      gig.status === 'COMPLETED' ? 'bg-warning-500/10 text-warning-400' :
                      gig.status === 'PAID' ? 'bg-success-500/10 text-success-400' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {gig.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {(gig.budget / 100).toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!gig.closedByAdmin && <CloseGigForm gigId={gig.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {gigs.length === 0 && (
            <div className="text-center py-12 text-gray-300">
              No gigs found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Suspense fallback={<div className="h-10" />}>
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </Suspense>
          </div>
        )}

        <div className="mt-8">
          <Link href="/admin" className="text-blue-500 hover:text-blue-400">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
