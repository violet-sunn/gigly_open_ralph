import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { BackButton } from '@/app/components/BackButton'
import { Suspense } from 'react'
import { Breadcrumb } from '@/app/components/Breadcrumb'

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
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
          <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-4 mb-6">
            User not found
          </div>
        </div>
      </div>
    )
  }

  // Display SPECIALIST profile
  if (user.specialistProfile) {
    const profile = user.specialistProfile
    const userName = profile.displayName || user.email

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile', href: '/profile' },
            { label: userName, current: true }
          ]} />
          <div className="mb-4">
            <Suspense fallback={null}>
              <BackButton />
            </Suspense>
          </div>
          <h1 className="text-2xl font-bold text-white mb-6">Specialist Profile</h1>
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Name</label>
            <p className="mt-1 text-white">{profile.displayName || user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Tech Stack</label>
            <p className="mt-1 text-white">{profile.techStack || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Experience Level</label>
            <p className="mt-1 text-white">{profile.experienceLevel || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Bio</label>
            <p className="mt-1 text-white whitespace-pre-wrap">{profile.bio || 'Not specified'}</p>
          </div>
          </div>
        </div>
      </div>
    )
  }

  // Display CLIENT profile
  if (user.clientProfile) {
    const profile = user.clientProfile
    const userName = profile.companyName || user.email

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile', href: '/profile' },
            { label: userName, current: true }
          ]} />
          <div className="mb-4">
            <Suspense fallback={null}>
              <BackButton />
            </Suspense>
          </div>
          <h1 className="text-2xl font-bold text-white mb-6">Client Profile</h1>
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Company Name</label>
            <p className="mt-1 text-white">{profile.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-strong">Contact Person</label>
            <p className="mt-1 text-white">{profile.contactPerson || 'Not specified'}</p>
          </div>
          </div>
        </div>
      </div>
    )
  }

  // No profile available
  return (
    <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
        <div className="bg-surface-level-1 border border-neutral-weak rounded p-4 mb-6 shadow-md">
          <p className="text-neutral-strong">Profile not available</p>
        </div>
      </div>
    </div>
  )
}
