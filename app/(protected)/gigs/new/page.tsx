import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { GigForm } from './gig-form'

export default async function NewGigPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'CLIENT') redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <div className="max-w-lg w-full space-y-8 p-8 bg-card border border-border rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Post a Gig</h2>
          <p className="mt-2 text-sm text-muted-foreground">Describe the work and set your budget</p>
        </div>
        <GigForm />
      </div>
    </div>
  )
}
