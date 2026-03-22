import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { GigForm } from './gig-form'
import { BackButton } from '@/app/components/BackButton'
import { Suspense } from 'react'

export default async function NewGigPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'CLIENT') redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-level-0 py-12">
      <div className="max-w-lg w-full space-y-8 p-8 bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md">
        <div className="mb-4">
          <Suspense fallback={null}>
            <BackButton />
          </Suspense>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Post a Gig</h2>
          <p className="mt-2 text-sm text-neutral-strong">Describe the work and set your budget</p>
        </div>
        <GigForm />
      </div>
    </div>
  )
}
