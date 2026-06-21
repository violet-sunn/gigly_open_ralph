import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getProfile } from '@/lib/view-models'
import { Notice } from '@/app/components/blocks'
import { ProfileDesign } from '../ProfileDesign'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { userId } = await params

  // Viewing own profile → the owner view.
  if (userId === session.userId) redirect('/profile')

  const data = await getProfile(userId, { userId: session.userId, role: session.role })
  if (!data) return <Notice tone="error">Пользователь не найден</Notice>

  return <ProfileDesign data={data} />
}
