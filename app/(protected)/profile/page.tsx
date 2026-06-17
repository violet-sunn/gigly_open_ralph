import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getProfile } from '@/lib/view-models'
import { Breadcrumb } from '@/app/components/Breadcrumb'
import { Notice } from '@/app/components/blocks'
import { Profile } from './Profile'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const breadcrumb = (
    <Breadcrumb
      items={[
        { label: 'Дашборд', href: '/dashboard' },
        { label: 'Профиль', current: true },
      ]}
    />
  )

  const data = await getProfile(session.userId, { userId: session.userId, role: session.role })

  // Profile not set up yet (or unknown role) — guide the user to the edit form.
  if (!data) {
    return (
      <>
        {breadcrumb}
        <Notice tone="warning">
          Профиль ещё не заполнен.{' '}
          <Link href="/profile/edit?from=profile" className="underline">
            Заполнить профиль
          </Link>
        </Notice>
      </>
    )
  }

  return (
    <>
      {breadcrumb}
      <Profile data={data} />
    </>
  )
}
