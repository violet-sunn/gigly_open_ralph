import { useState, useCallback } from 'react'

interface UseConfirmDialogReturn {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  confirmDialog: (action: () => void) => void
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
  }, [])

  const confirmDialog = useCallback((action: () => void) => {
    action()
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    openDialog,
    closeDialog,
    confirmDialog
  }
}
