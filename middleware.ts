import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET)

async function verifySession(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await verifySession(request)

  // Admin routes — require ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protected routes — require auth
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/gigs') || pathname.startsWith('/profile')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access control for specific routes
    // Browse gigs page (exact match) - SPECIALIST only
    if (pathname === '/gigs') {
      if (session.role === 'CLIENT') {
        return NextResponse.redirect(new URL('/dashboard?error=gigs-specialists-only', request.url))
      }
    }

    // Gig creation - CLIENT only
    if (pathname === '/gigs/new') {
      if (session.role === 'SPECIALIST') {
        return NextResponse.redirect(new URL('/dashboard?error=gig-creation-clients-only', request.url))
      }
    }
  }

  // Login — redirect to dashboard if already logged in.
  // NOTE: /register is intentionally NOT redirected for authenticated users: the design's two-phase onboarding
  // creates the account at step 2, so the user is authenticated while still on /register completing step-3 setup
  // (Auth.dc.html). Bouncing them to /dashboard would abort onboarding.
  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/gigs/:path*', '/profile/:path*', '/login', '/admin/:path*'],
}
