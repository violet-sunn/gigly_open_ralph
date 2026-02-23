'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/app/actions/auth'

interface DashboardNavProps {
  userEmail: string
  userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'
}

export function DashboardNav({ userEmail, userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) => {
    const base = 'px-4 py-4 text-sm font-medium border-b-2 transition-colors'
    return isActive(path)
      ? `${base} border-blue-600 text-blue-600`
      : `${base} border-transparent text-gray-600 hover:text-gray-900`
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>

            {userRole === 'CLIENT' && (
              <Link href="/dashboard/gigs/new" className={linkClass('/dashboard/gigs/new')}>
                Post Gig
              </Link>
            )}

            {(userRole === 'CLIENT' || userRole === 'SPECIALIST') && (
              <Link href="/dashboard/gigs" className={linkClass('/dashboard/gigs')}>
                Browse Gigs
              </Link>
            )}

            {userRole === 'ADMIN' && (
              <>
                <Link href="/admin" className={linkClass('/admin')}>
                  Moderation
                </Link>
                <Link href="/admin/users" className={linkClass('/admin/users')}>
                  Users
                </Link>
                <Link href="/admin/gigs" className={linkClass('/admin/gigs')}>
                  Gigs
                </Link>
              </>
            )}

            <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')}>
              Profile
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <form action={logoutUser}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
