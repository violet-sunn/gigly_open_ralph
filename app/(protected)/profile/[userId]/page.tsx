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
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
        <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-4 mb-6">
          User not found
        </div>
      </div>
    )
  }

  // Display SPECIALIST profile
  if (user.specialistProfile) {
    const profile = user.specialistProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Specialist Profile</h1>
        <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <p className="mt-1 text-white">{profile.displayName || user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Tech Stack</label>
            <p className="mt-1 text-white">{profile.techStack || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Experience Level</label>
            <p className="mt-1 text-white">{profile.experienceLevel || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <p className="mt-1 text-white whitespace-pre-wrap">{profile.bio || 'Not specified'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Display CLIENT profile
  if (user.clientProfile) {
    const profile = user.clientProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Client Profile</h1>
        <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-300">Company Name</label>
            <p className="mt-1 text-white">{profile.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Contact Person</label>
            <p className="mt-1 text-white">{profile.contactPerson || 'Not specified'}</p>
          </div>
        </div>
      </div>
    )
  }

  // No profile available
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-navy-800 border border-gray-700 rounded p-4 mb-6 shadow-md">
        <p className="text-gray-300">Profile not available</p>
      </div>
    </div>
  )
}
