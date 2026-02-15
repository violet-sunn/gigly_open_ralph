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
      className="text-xs px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
      className="text-xs px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-xs text-red-600 mb-1">{error}</p>
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
