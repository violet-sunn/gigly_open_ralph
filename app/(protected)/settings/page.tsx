import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getSettings } from '@/lib/view-models'
import { Settings } from './Settings'

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const data = await getSettings({ userId: session.userId, email: session.email, sid: session.sid })

  return <Settings {...data} />
}
