import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getProfile } from '@/lib/view-models'
import { Notice } from '@/app/components/blocks'
import { ProfileDesign } from './ProfileDesign'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const data = await getProfile(session.userId, { userId: session.userId, role: session.role })

  // Profile not set up yet (or unknown role) — guide the user to the edit form (the shell header supplies the title).
  if (!data) {
    return (
      <Notice tone="warning">
        Профиль ещё не заполнен.{' '}
        <Link href="/profile/edit?from=profile" className="underline">
          Заполнить профиль
        </Link>
      </Notice>
    )
  }

  return <ProfileDesign data={data} />
}
