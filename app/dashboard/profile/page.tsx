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
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <p className="text-yellow-800">Profile not set up yet</p>
            <Link
              href="/dashboard/profile/edit"
              className="text-blue-600 hover:underline"
            >
              Set up your profile
            </Link>
          </div>
        </div>
      )
    }

    const profile = user.specialistProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{session.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <p className="mt-1">{profile.displayName || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
            <p className="mt-1">{profile.techStack || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <p className="mt-1">{profile.experienceLevel || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <p className="mt-1 whitespace-pre-wrap">{profile.bio || 'Not set'}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/dashboard/profile/edit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </Link>
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
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <p className="text-yellow-800">Profile not set up yet</p>
            <Link
              href="/dashboard/profile/edit"
              className="text-blue-600 hover:underline"
            >
              Set up your profile
            </Link>
          </div>
        </div>
      )
    }

    const profile = user.clientProfile

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{session.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <p className="mt-1">{profile.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">INN</label>
            <p className="mt-1">{profile.inn}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">KPP</label>
            <p className="mt-1">{profile.kpp || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
            <p className="mt-1">{profile.contactPerson || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="mt-1">{profile.phoneNumber || 'Not set'}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/dashboard/profile/edit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <p>Unknown role</p>
    </div>
  )
}
