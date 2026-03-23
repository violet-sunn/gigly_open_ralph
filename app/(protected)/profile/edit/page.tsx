import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import ProfileEditForm from './ProfileEditForm'
import { Breadcrumb } from '@/app/components/Breadcrumb'

export default async function ProfileEditPage() {
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

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile', href: '/profile' },
            { label: 'Edit', current: true }
          ]} />
          <ProfileEditForm role="SPECIALIST" profile={user.specialistProfile} email={user.email} />
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

    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile', href: '/profile' },
            { label: 'Edit', current: true }
          ]} />
          <ProfileEditForm role="CLIENT" profile={user.clientProfile} email={user.email} />
        </div>
      </div>
    )
  }

  return <div>Unknown role</div>
}
