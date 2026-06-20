import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CreateGigSuccess } from './CreateGigSuccess'

/** «Гиг опубликован» (reconcile-create-gig) — the post-create success screen `createGig` redirects to. CLIENT-only. */
export default async function CreateGigSuccessPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'CLIENT') redirect('/dashboard')

  return <CreateGigSuccess />
}
