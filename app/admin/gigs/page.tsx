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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gig Management</h1>
          <p className="mt-2 text-gray-600">View and moderate gigs</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <GigFilters />
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
          </p>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gigs.map((gig) => (
                <tr key={gig.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      href={`/dashboard/gigs/${gig.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {gig.title}
                    </Link>
                    {gig.closedByAdmin && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gig.client.clientProfile?.companyName || gig.client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {gig.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(gig.budget / 100).toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            <div className="text-center py-12 text-gray-500">
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
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
