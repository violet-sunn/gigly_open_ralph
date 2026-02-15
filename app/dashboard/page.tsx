import { getSession } from '@/lib/session'
import { logoutUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {session.role === 'CLIENT' ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Client Dashboard</h2>
              <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            </div>
            <div className="space-y-4">
              <button
                disabled
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-50 cursor-not-allowed"
              >
                Post a Gig (coming soon)
              </button>
              <div className="border border-gray-200 rounded-md p-4 text-center">
                <p className="text-sm text-gray-500">My Gigs</p>
                <p className="text-xs text-gray-400 mt-1">No gigs posted yet.</p>
              </div>
            </div>
          </>
        ) : session.role === 'SPECIALIST' ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Specialist Dashboard</h2>
              <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            </div>
            <div className="space-y-4">
              <button
                disabled
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 opacity-50 cursor-not-allowed"
              >
                Browse Gigs (coming soon)
              </button>
              <div className="border border-gray-200 rounded-md p-4 text-center">
                <p className="text-sm text-gray-500">My Applications</p>
                <p className="text-xs text-gray-400 mt-1">No applications yet.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="mt-2 text-sm text-gray-600">Signed in as {session.email}</p>
            <p className="mt-4 text-sm text-yellow-600">Your account role is not recognized. Please contact support.</p>
          </div>
        )}
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
