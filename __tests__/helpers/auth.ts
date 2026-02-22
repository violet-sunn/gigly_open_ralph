import { SignJWT, jwtVerify } from 'jose'
import { PrismaClient } from '@prisma/client'
import { createTestUser } from './seed'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
const COOKIE_NAME = 'session'

/**
 * Shared store for mocked session tokens
 * Used by withAuthContext to provide authenticated context in tests
 */
const sessionStore = new Map<string, string>()

/**
 * Generate a valid JWT session token for a test user
 * This is a pure function with no side effects, suitable for both unit tests and E2E tests
 */
export async function createTestSession(user: {
  id: string
  email: string
  role: string
}): Promise<string> {
  const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret)

  return token
}

/**
 * Get the current test session token from the shared store
 * Used by mocked cookies() function
 */
export function getTestSessionToken(): string | undefined {
  return sessionStore.get('current')
}

/**
 * Set the test session token in the shared store
 */
export function setTestSessionToken(token: string | undefined): void {
  if (token === undefined) {
    sessionStore.delete('current')
  } else {
    sessionStore.set('current', token)
  }
}

/**
 * Execute a callback with mocked authenticated session context
 * The callback will see the user as authenticated via getSession()
 */
export async function withAuthContext<T>(
  user: { id: string; email: string; role: string },
  callback: () => Promise<T>
): Promise<T> {
  const token = await createTestSession(user)
  const previousToken = getTestSessionToken()

  try {
    setTestSessionToken(token)
    return await callback()
  } finally {
    // Restore previous token (for nested contexts) or clear
    setTestSessionToken(previousToken)
  }
}

/**
 * Call a server action as an authenticated user
 * Convenience wrapper around withAuthContext for cleaner test code
 */
export async function makeAuthenticatedRequest<T>(
  user: { id: string; email: string; role: string },
  action: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> {
  return withAuthContext(user, async () => {
    return action(...args)
  })
}

/**
 * Assert that a callback fails with an authorization error
 * Useful for testing that unauthorized access is properly blocked
 */
export async function expectUnauthorized(callback: () => Promise<any>): Promise<void> {
  try {
    await callback()
    throw new Error('Expected operation to fail with authorization error, but it succeeded')
  } catch (error: any) {
    const message = error.message?.toLowerCase() || ''
    const isAuthError =
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('not allowed') ||
      message.includes('permission') ||
      message.includes('not authorized') ||
      message.includes('access denied')

    if (!isAuthError) {
      throw new Error(`Expected authorization error, but got: ${error.message}`)
    }
    // Test passed - authorization was properly denied
  }
}

/**
 * Create a CLIENT user with session token
 */
export async function createAuthenticatedClient(
  tx: PrismaClient,
  overrides?: {
    email?: string
    password?: string
    companyName?: string
    inn?: string
    kpp?: string
    contactPerson?: string
    phoneNumber?: string
  }
) {
  const user = await createTestUser(tx, {
    role: 'CLIENT',
    ...overrides
  })
  const session = await createTestSession(user)
  return { user, session }
}

/**
 * Create a SPECIALIST user with session token
 */
export async function createAuthenticatedSpecialist(
  tx: PrismaClient,
  overrides?: {
    email?: string
    password?: string
    displayName?: string
    techStack?: string
    experienceLevel?: string
    bio?: string
  }
) {
  const user = await createTestUser(tx, {
    role: 'SPECIALIST',
    ...overrides
  })
  const session = await createTestSession(user)
  return { user, session }
}

/**
 * Create an ADMIN user with session token
 */
export async function createAuthenticatedAdmin(
  tx: PrismaClient,
  overrides?: {
    email?: string
    password?: string
  }
) {
  const user = await createTestUser(tx, {
    role: 'ADMIN',
    ...overrides
  })
  const session = await createTestSession(user)
  return { user, session }
}

/**
 * Set authenticated session in Playwright E2E tests
 * Injects session cookie into browser context
 */
export async function setE2ESession(
  page: any, // Page type from @playwright/test
  user: { id: string; email: string; role: string }
): Promise<void> {
  const token = await createTestSession(user)

  await page.context().addCookies([
    {
      name: COOKIE_NAME,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
    }
  ])
}
