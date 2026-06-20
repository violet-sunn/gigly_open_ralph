import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
const COOKIE_NAME = 'session'

export type UserRole = 'CLIENT' | 'SPECIALIST' | 'ADMIN'

/** The verified session payload. `sid` is the `Session` row id (reconcile-settings); optional for backward-compat
 *  with pre-existing tokens and the test harness's directly-minted JWTs. */
export interface SessionPayload {
  userId: string
  email: string
  role: UserRole
  sid?: string
}

/** Best-effort request context for session tracking — never throws (callable outside a request scope). */
async function captureRequestContext(): Promise<{ userAgent: string; ipAddress: string }> {
  try {
    const h = await headers()
    return {
      userAgent: h.get('user-agent') || '',
      ipAddress: h.get('x-forwarded-for') || h.get('x-real-ip') || '',
    }
  } catch {
    return { userAgent: '', ipAddress: '' }
  }
}

export async function createSession(userId: string, email: string, role: UserRole) {
  // Create a Session row capturing device (user-agent) + IP; its id becomes the JWT `sid`. Best-effort: a tracking
  // failure must never block login (and keeps sid-less tokens valid via getSession's tolerance).
  let sid: string | undefined
  try {
    const { userAgent, ipAddress } = await captureRequestContext()
    const row = await prisma.session.create({ data: { userId, userAgent, ipAddress } })
    sid = row.id
  } catch {
    sid = undefined
  }

  const token = await new SignJWT({ userId, email, role, ...(sid ? { sid } : {}) })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    // `sid` is read when present but NOT required — sid-less/row-less tokens still authenticate.
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  // Best-effort: delete the current Session row (by `sid`) before clearing the cookie.
  try {
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (token) {
      const { payload } = await jwtVerify(token, secret)
      const sid = (payload as unknown as SessionPayload).sid
      if (sid) await prisma.session.delete({ where: { id: sid } }).catch(() => {})
    }
  } catch {
    /* ignore — logout must always clear the cookie */
  }
  cookieStore.delete(COOKIE_NAME)
}
