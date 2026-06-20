import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'
import { CreateGig } from './CreateGig'

/**
 * «Создать гиг» (reconcile-create-gig) — the guided-brief gig-creation screen. CLIENT-only; passes the category
 * options (server-sourced from lib/categories) into the composed screen.
 */
export default async function NewGigPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'CLIENT') redirect('/dashboard')

  const categoryOptions = CATEGORIES.map((c) => ({ key: c.slug, label: c.name }))

  return <CreateGig categoryOptions={categoryOptions} />
}
