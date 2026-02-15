import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">Gigly</h1>
        <p className="text-lg text-gray-600">Your events, simplified.</p>
        {session ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Signed in as {session.email}</p>
            <form action={logoutUser}>
              <button
                type="submit"
                className="inline-block px-6 py-3 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/register"
              className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </Link>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
