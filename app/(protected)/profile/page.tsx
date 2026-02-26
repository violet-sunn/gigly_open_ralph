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
        <div className="min-h-screen bg-background py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">My Profile</h1>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-200">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-primary hover:text-primary/90"
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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 text-foreground">{session.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Display Name</label>
              <p className="mt-1 text-foreground">{profile.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Tech Stack</label>
              <p className="mt-1 text-foreground">{profile.techStack || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Experience Level</label>
              <p className="mt-1 text-foreground">{profile.experienceLevel || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Bio</label>
              <p className="mt-1 text-foreground whitespace-pre-wrap">{profile.bio || 'Not set'}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200"
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
        <div className="min-h-screen bg-background py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">My Profile</h1>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-200">Profile not set up yet</p>
              <Link
                href="/profile/edit"
                className="text-primary hover:text-primary/90"
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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 text-foreground">{session.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Company Name</label>
              <p className="mt-1 text-foreground">{profile.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">INN</label>
              <p className="mt-1 text-foreground">{profile.inn}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">KPP</label>
              <p className="mt-1 text-foreground">{profile.kpp || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Contact Person</label>
              <p className="mt-1 text-foreground">{profile.contactPerson || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
              <p className="mt-1 text-foreground">{profile.phoneNumber || 'Not set'}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-foreground">Unknown role</p>
      </div>
    </div>
  )
}
