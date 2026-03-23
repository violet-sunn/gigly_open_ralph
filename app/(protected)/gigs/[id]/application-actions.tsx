'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { acceptApplication, rejectApplication } from '@/app/actions/gig'
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog'
import { useConfirmDialog } from '@/app/hooks/useConfirmDialog'

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
      type="button"
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
  const { isOpen, openDialog, closeDialog, confirmDialog } = useConfirmDialog()

  const error = acceptState?.error || rejectState?.error

  const handleRejectClick = () => {
    openDialog()
  }

  const handleConfirmReject = () => {
    confirmDialog(() => {
      const formData = new FormData()
      formData.append('applicationId', applicationId)
      rejectAction(formData)
    })
  }

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
        <div onClick={handleRejectClick}>
          <RejectButton />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        title="Reject Application"
        message="This will permanently reject this application. The specialist will be notified and cannot reapply to this gig."
        onConfirm={handleConfirmReject}
        onCancel={closeDialog}
      />
    </div>
  )
}
