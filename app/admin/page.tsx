import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalUsers, totalGigs, suspendedUsers, closedGigs] = await Promise.all([
    prisma.user.count(),
    prisma.gig.count(),
    prisma.user.count({ where: { suspended: true } }),
    prisma.gig.count({ where: { closedByAdmin: true } })
  ])

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-300">Platform overview and moderation tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
            <div className="text-sm font-medium text-gray-300 mb-2">Total Users</div>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
          </div>

          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
            <div className="text-sm font-medium text-gray-300 mb-2">Total Gigs</div>
            <div className="text-3xl font-bold text-white">{totalGigs}</div>
          </div>

          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
            <div className="text-sm font-medium text-gray-300 mb-2">Suspended Users</div>
            <div className="text-3xl font-bold text-error-500">{suspendedUsers}</div>
          </div>

          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">
            <div className="text-sm font-medium text-gray-300 mb-2">Closed Gigs</div>
            <div className="text-3xl font-bold text-error-500">{closedGigs}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/users"
            className="bg-navy-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors duration-200 shadow-md"
          >
            <h2 className="text-xl font-semibold text-white mb-2">User Management</h2>
            <p className="text-gray-300">View and moderate user accounts</p>
          </Link>

          <Link
            href="/admin/gigs"
            className="bg-navy-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors duration-200 shadow-md"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Gig Management</h2>
            <p className="text-gray-300">View and moderate gigs</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-blue-500 hover:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
