import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <main className="text-center space-y-8 px-4">
        <h1 className="text-6xl font-bold text-white tracking-tight">GIGLY</h1>
        <p className="text-lg text-gray-300">High-end B2B freelance marketplace for Russian IT specialists</p>
        {session ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">Signed in as {session.email}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
              >
                Go to Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="inline-block px-8 py-3 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
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
              className="inline-block px-8 py-3 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              Get Started
            </Link>
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
