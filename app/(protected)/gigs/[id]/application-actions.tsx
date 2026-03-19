'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { acceptApplication, rejectApplication } from '@/app/actions/gig'

function AcceptButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs px-4 py-2 rounded-md bg-success-500 text-white hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Accepting...' : 'Accept'}
    </button>
  )
}

function RejectButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs px-4 py-2 rounded-md bg-error-500 text-white hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Rejecting...' : 'Reject'}
    </button>
  )
}

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [acceptState, acceptAction] = useActionState(acceptApplication, null)
  const [rejectState, rejectAction] = useActionState(rejectApplication, null)

  const error = acceptState?.error || rejectState?.error

  return (
    <div className="mt-2">
      {error && (
        <p className="text-xs text-error-400 mb-1">{error}</p>
      )}
      <div className="flex gap-2">
        <form action={acceptAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <AcceptButton />
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <RejectButton />
        </form>
      </div>
    </div>
  )
}
