import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { GigForm } from './gig-form'

export default async function NewGigPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'CLIENT') redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Post a Gig</h2>
          <p className="mt-2 text-sm text-gray-600">Describe the work and set your budget</p>
        </div>
        <GigForm />
      </div>
    </div>
  )
}
