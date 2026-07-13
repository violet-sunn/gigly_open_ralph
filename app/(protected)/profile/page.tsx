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

  // No profile record. For real specialists/clients this can't happen — registration step 3 is enforced and always
  // creates the profile record — so the only account that reaches here is ADMIN, which has no public profile by design.
  if (!data) {
    if (session.role === 'ADMIN') {
      return (
        <Notice tone="info">
          У администратора нет публичного профиля.{' '}
          <Link href="/admin" className="underline">
            Перейти в панель администратора
          </Link>
        </Notice>
      )
    }
    return (
      <Notice tone="warning">
        Профиль ещё не заполнен. Заполните его при регистрации, либо{' '}
        <Link href="/settings" className="underline">
          в настройках аккаунта
        </Link>
        .
      </Notice>
    )
  }

  return <ProfileDesign data={data} />
}
