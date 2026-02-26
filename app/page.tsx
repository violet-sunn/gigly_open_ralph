import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="text-center space-y-8 px-4">
        <h1 className="text-6xl font-bold text-foreground tracking-tight">GIGLY</h1>
        <p className="text-lg text-muted-foreground">High-end B2B freelance marketplace for Russian IT specialists</p>
        {session ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Signed in as {session.email}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Go to Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="inline-block px-8 py-3 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/register"
              className="inline-block px-8 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Get Started
            </Link>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
