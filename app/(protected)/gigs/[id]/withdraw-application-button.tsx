'use client'

import { useActionState } from 'react'
import { withdrawApplication } from '@/app/actions/gig'
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog'
import { useConfirmDialog } from '@/app/hooks/useConfirmDialog'

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const [state, formAction] = useActionState(withdrawApplication, null)
  const { isOpen, openDialog, closeDialog, confirmDialog } = useConfirmDialog()

  const handleWithdrawClick = () => {
    openDialog()
  }

  const handleConfirmWithdraw = () => {
    confirmDialog(() => {
      const formData = new FormData()
      formData.append('applicationId', applicationId)
      formAction(formData)
    })
  }

  return (
    <>
      {state?.error && <p className="text-sm text-error-400 mb-2">{state.error}</p>}
      <button
        type="button"
        onClick={handleWithdrawClick}
        className="w-full px-4 py-2 bg-error-600 text-white rounded hover:bg-error-700 transition-colors"
      >
        Withdraw Application
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Withdraw Application"
        message="This will withdraw your application. You will not be able to reapply to this gig."
        onConfirm={handleConfirmWithdraw}
        onCancel={closeDialog}
      />
    </>
  )
}
