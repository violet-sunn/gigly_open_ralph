import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SuspendUserForm } from './SuspendUserForm'
import { UnsuspendUserForm } from './UnsuspendUserForm'
import { UserFilters } from './UserFilters'
import PaginationControls from '@/app/components/PaginationControls'

const PAGE_SIZE = 30

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminUsersPage(props: { searchParams: SearchParams }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const searchParams = await props.searchParams
  const roleFilter = searchParams.role as string | undefined
  const statusFilter = searchParams.status as string | undefined

  // Extract and validate page parameter
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const redirectParams = new URLSearchParams()
    if (roleFilter) redirectParams.set('role', roleFilter)
    if (statusFilter) redirectParams.set('status', statusFilter)
    const query = redirectParams.toString()
    redirect(`/admin/users${query ? `?${query}` : ''}`)
  }

  const where: any = {}
  if (roleFilter && ['CLIENT', 'SPECIALIST', 'ADMIN'].includes(roleFilter)) {
    where.role = roleFilter
  }
  if (statusFilter === 'suspended') {
    where.suspended = true
  } else if (statusFilter === 'active') {
    where.suspended = false
  }

  // Execute queries in parallel: fetch paginated users and total count
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        clientProfile: true,
        specialistProfile: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Redirect if page exceeds total pages
  if (page > totalPages && totalPages > 0) {
    const redirectParams = new URLSearchParams()
    if (roleFilter) redirectParams.set('role', roleFilter)
    if (statusFilter) redirectParams.set('status', statusFilter)
    redirectParams.set('page', totalPages.toString())
    const query = redirectParams.toString()
    redirect(`/admin/users${query ? `?${query}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">View and moderate user accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <UserFilters />
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} users
          </p>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.suspended ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.suspended ? (
                      <UnsuspendUserForm userId={user.id} />
                    ) : (
                      <SuspendUserForm userId={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found
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
