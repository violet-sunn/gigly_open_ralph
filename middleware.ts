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

    // ADMIN has no CLIENT/SPECIALIST dashboard — send them to their home (the moderation console) so they are not
    // mislabelled as a «Компания» user with no admin nav.
    if (session.role === 'ADMIN' && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin', request.url))
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
  // Only bounce GET navigations. The auth surface is an in-surface state machine: starting on /login and choosing
  // «Создать аккаунт» keeps the URL at /login through the whole two-phase onboarding, so the step-3 updateProfile
  // Server Action POSTs to /login *while already authenticated* (the account is created at step 2). Redirecting that
  // POST returns a 307 in place of the action result → the client throws «An unexpected response was received from
  // the server». Server Actions are POST, so gating on GET lets them through while still bouncing real page visits.
  // (/register is likewise not matched here for the same onboarding reason.)
  if (pathname === '/login' && request.method === 'GET') {
    if (session) {
      return NextResponse.redirect(new URL(session.role === 'ADMIN' ? '/admin' : '/dashboard', request.url))
    }
  }

  // Authenticated HTML is per-session and must never be cached by an intermediary. Without this, a proxy/CDN keying on
  // URL alone (the deployment sits behind one) can serve a stale — or another session's — /dashboard, which is the
  // suspected cause of the tester's «F5 не помогает, только перезаход»: even a hard reload returned a cached body.
  // This is the single choke point for it: the matcher below already scopes us to authenticated app routes, and static
  // assets never reach middleware, so their caching is unaffected.
  const response = NextResponse.next()
  if (session) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
  }
  return response
}

// The role/auth gates above key off explicit pathname prefixes, so the extra entries here are matched for the
// no-store header only — no redirect block applies to them, and the (protected) layout remains their auth guard.
// They are listed because they render the counter-bearing shell and must not be cacheable by an intermediary either.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gigs/:path*',
    '/profile/:path*',
    '/login',
    '/admin/:path*',
    '/my-gigs/:path*',
    '/chats/:path*',
    '/finances/:path*',
    '/disputes/:path*',
    '/settings/:path*',
  ],
}
