import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const { userId } = await params

  // Redirect if viewing own profile
  if (userId === session.userId) {
    redirect('/dashboard/profile')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clientProfile: true,
      specialistProfile: true,
    },
  })

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          User not found
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  // Display SPECIALIST profile
  if (user.specialistProfile) {
    const profile = user.specialistProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Specialist Profile</h1>
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1">{profile.displayName || user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
            <p className="mt-1">{profile.techStack || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <p className="mt-1">{profile.experienceLevel || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <p className="mt-1 whitespace-pre-wrap">{profile.bio || 'Not specified'}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </div>
    )
  }

  // Display CLIENT profile
  if (user.clientProfile) {
    const profile = user.clientProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Client Profile</h1>
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <p className="mt-1">{profile.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
            <p className="mt-1">{profile.contactPerson || 'Not specified'}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </div>
    )
  }

  // No profile available
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
        <p className="text-gray-700">Profile not available</p>
      </div>
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        ← Back
      </Link>
    </div>
  )
}
