import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role === 'SPECIALIST') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { specialistProfile: true },
    })

    if (!user) {
      redirect('/login')
    }

    if (!user.specialistProfile) {
      return (
        <div className="min-h-screen bg-navy-900 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-8 leading-tight">My Profile</h1>
            <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4 mb-6">
              <p className="text-warning-400">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                Set up your profile
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const profile = user.specialistProfile

    return (
      <div className="min-h-screen bg-navy-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 space-y-6 shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <p className="mt-1 text-white">{session.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Display Name</label>
              <p className="mt-1 text-white">{profile.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Tech Stack</label>
              <p className="mt-1 text-white">{profile.techStack || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Experience Level</label>
              <p className="mt-1 text-white">{profile.experienceLevel || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Bio</label>
              <p className="mt-1 text-white whitespace-pre-wrap">{profile.bio || 'Not set'}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    )
  } else if (session.role === 'CLIENT') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { clientProfile: true },
    })

    if (!user) {
      redirect('/login')
    }

    if (!user.clientProfile) {
      return (
        <div className="min-h-screen bg-navy-900 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-8 leading-tight">My Profile</h1>
            <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4 mb-6">
              <p className="text-warning-400">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                Set up your profile
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const profile = user.clientProfile

    return (
      <div className="min-h-screen bg-navy-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 space-y-6 shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <p className="mt-1 text-white">{session.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Company Name</label>
              <p className="mt-1 text-white">{profile.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">INN</label>
              <p className="mt-1 text-white">{profile.inn}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">KPP</label>
              <p className="mt-1 text-white">{profile.kpp || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Contact Person</label>
              <p className="mt-1 text-white">{profile.contactPerson || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Phone Number</label>
              <p className="mt-1 text-white">{profile.phoneNumber || 'Not set'}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-white">Unknown role</p>
      </div>
    </div>
  )
}
