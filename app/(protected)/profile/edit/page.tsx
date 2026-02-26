import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import ProfileEditForm from './ProfileEditForm'

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

    return <ProfileEditForm role="SPECIALIST" profile={user.specialistProfile} />
  } else if (session.role === 'CLIENT') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { clientProfile: true },
    })

    if (!user) {
      redirect('/login')
    }

    return <ProfileEditForm role="CLIENT" profile={user.clientProfile} />
  }

  return <div>Unknown role</div>
}
