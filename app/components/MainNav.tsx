'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { logoutUser } from '@/app/actions/auth'
import { NotificationBell } from './NotificationBell'
import { useState } from 'react'

interface MainNavProps {
  userEmail: string
  userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'
}

export function MainNav({ userEmail, userRole }: MainNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    // Special handling for gig detail pages
    if (pathname.startsWith('/gigs/') && pathname !== '/gigs' && pathname !== '/gigs/new') {
      // We're on a gig detail page
      if (path === '/dashboard') {
        return from === 'dashboard'
      }
      if (path === '/gigs') {
        return from === 'browse'
      }
      return false
    }

    // Original logic for other pages
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) => {
    const base = 'px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200'
    return isActive(path)
      ? `${base} border-blue-500 text-blue-500`
      : `${base} border-transparent text-neutral-strong hover:text-white hover:bg-navy-700`
  }

  const mobileLinkClass = (path: string) => {
    const base = 'block px-4 py-3 text-base font-medium transition-colors duration-200 min-h-[44px] flex items-center'
    return isActive(path)
      ? `${base} bg-blue-500/10 text-blue-500`
      : `${base} text-neutral-strong hover:text-white hover:bg-surface-level-2`
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-level-1 border-b border-neutral-weak">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight py-4">
              GIGLY
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>

              {userRole === 'CLIENT' && (
                <Link href="/gigs/new" className={linkClass('/gigs/new')}>
                  Post Gig
                </Link>
              )}

              {userRole === 'SPECIALIST' && (
                <Link href="/gigs" className={linkClass('/gigs')}>
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

              <Link href="/profile" className={linkClass('/profile')}>
                Profile
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {(userRole === 'CLIENT' || userRole === 'SPECIALIST') && (
              <NotificationBell />
            )}
            <span className="text-sm text-neutral-strong">{userEmail}</span>
            <form action={logoutUser}>
              <button
                type="submit"
                className="text-sm text-neutral-strong hover:text-white transition-colors duration-200"
              >
                Sign Out
              </button>
            </form>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center text-white hover:bg-surface-level-2 rounded-md transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-[57px] right-0 bottom-0 w-64 bg-surface-level-1 border-l border-neutral-weak z-50 md:hidden overflow-y-auto">
            <div className="py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-neutral-weak">
                <p className="text-sm text-neutral-strong truncate">{userEmail}</p>
                <p className="text-xs text-neutral-weak mt-1">{userRole}</p>
              </div>

              {/* Navigation Links */}
              <div className="py-2">
                <Link
                  href="/dashboard"
                  className={mobileLinkClass('/dashboard')}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>

                {userRole === 'CLIENT' && (
                  <Link
                    href="/gigs/new"
                    className={mobileLinkClass('/gigs/new')}
                    onClick={closeMobileMenu}
                  >
                    Post Gig
                  </Link>
                )}

                {userRole === 'SPECIALIST' && (
                  <Link
                    href="/gigs"
                    className={mobileLinkClass('/gigs')}
                    onClick={closeMobileMenu}
                  >
                    Browse Gigs
                  </Link>
                )}

                {userRole === 'ADMIN' && (
                  <>
                    <Link
                      href="/admin"
                      className={mobileLinkClass('/admin')}
                      onClick={closeMobileMenu}
                    >
                      Moderation
                    </Link>
                    <Link
                      href="/admin/users"
                      className={mobileLinkClass('/admin/users')}
                      onClick={closeMobileMenu}
                    >
                      Users
                    </Link>
                    <Link
                      href="/admin/gigs"
                      className={mobileLinkClass('/admin/gigs')}
                      onClick={closeMobileMenu}
                    >
                      Gigs
                    </Link>
                  </>
                )}

                <Link
                  href="/profile"
                  className={mobileLinkClass('/profile')}
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              </div>

              {/* Notification Bell (Mobile) */}
              {(userRole === 'CLIENT' || userRole === 'SPECIALIST') && (
                <div className="px-4 py-3 border-t border-neutral-weak">
                  <NotificationBell />
                </div>
              )}

              {/* Sign Out */}
              <div className="px-4 py-3 border-t border-neutral-weak">
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-3 text-base font-medium text-neutral-strong hover:text-white hover:bg-surface-level-2 rounded-md transition-colors min-h-[44px]"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
