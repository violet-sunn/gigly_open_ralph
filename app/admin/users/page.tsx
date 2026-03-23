import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SuspendUserForm } from './SuspendUserForm'
import { UnsuspendUserForm } from './UnsuspendUserForm'
import { UserFilters } from './UserFilters'
import PaginationControls from '@/app/components/PaginationControls'
import { BackButton } from '@/app/components/BackButton'
import EmptyState from '@/app/components/onboarding/EmptyState'
import { Breadcrumb } from '@/app/components/Breadcrumb'

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

  const hasActiveFilters = roleFilter || statusFilter

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
    <div className="min-h-screen bg-surface-level-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', current: true }
        ]} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="mt-2 text-neutral-strong">View and moderate user accounts</p>
        </div>

        <div className="bg-surface-level-1 border border-neutral-weak rounded-lg mb-6 p-6 shadow-md">
          <UserFilters />
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-neutral-strong mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} users
          </p>
        )}

        <div className="bg-surface-level-1 border border-neutral-weak rounded-lg overflow-hidden shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-surface-level-0">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-neutral-strong uppercase tracking-wider">
                  Email
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-neutral-strong uppercase tracking-wider">
                  Role
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-neutral-strong uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-neutral-strong uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-neutral-strong uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-level-1 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.suspended ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-error-500/10 text-error-400">
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-500/10 text-success-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-strong">
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
            <div className="p-6">
              {hasActiveFilters ? (
                <EmptyState
                  icon="🔍"
                  heading="No Users Found"
                  description="No users match your current filters. Try adjusting the role or status filters to see more results."
                  primaryAction={{ label: "Clear Filters", href: "/admin/users" }}
                />
              ) : (
                <EmptyState
                  icon="👥"
                  heading="No Users Yet"
                  description="No users have registered yet. Once users sign up, they will appear here for moderation."
                />
              )}
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
          <Suspense fallback={null}>
            <BackButton />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
