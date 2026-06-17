import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { getProfile } from '@/lib/view-models'
import { BackButton } from '@/app/components/BackButton'
import { Breadcrumb } from '@/app/components/Breadcrumb'
import { Notice } from '@/app/components/blocks'
import { Profile } from '../Profile'

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

  // Viewing own profile → the owner view.
  if (userId === session.userId) {
    redirect('/profile')
  }

  const data = await getProfile(userId, { userId: session.userId, role: session.role })

  if (!data) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: 'Дашборд', href: '/dashboard' },
            { label: 'Профиль', current: true },
          ]}
        />
        <Notice tone="error">Пользователь не найден</Notice>
      </>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Дашборд', href: '/dashboard' },
          { label: 'Профиль', href: '/profile' },
          { label: data.header.name, current: true },
        ]}
      />
      <Suspense fallback={null}>
        <BackButton />
      </Suspense>
      <Profile data={data} />
    </>
  )
}
