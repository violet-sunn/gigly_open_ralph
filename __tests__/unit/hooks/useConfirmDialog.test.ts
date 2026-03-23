/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConfirmDialog } from '@/app/hooks/useConfirmDialog'

describe('useConfirmDialog', () => {
  it('initializes with isOpen as false', () => {
    const { result } = renderHook(() => useConfirmDialog())

    expect(result.current.isOpen).toBe(false)
  })

  it('sets isOpen to true when openDialog is called', () => {
    const { result } = renderHook(() => useConfirmDialog())

    act(() => {
      result.current.openDialog()
    })

    expect(result.current.isOpen).toBe(true)
  })

  it('sets isOpen to false when closeDialog is called', () => {
    const { result } = renderHook(() => useConfirmDialog())

    act(() => {
      result.current.openDialog()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeDialog()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('executes action callback and sets isOpen to false when confirmDialog is called', () => {
    const { result } = renderHook(() => useConfirmDialog())
    let actionExecuted = false

    act(() => {
      result.current.openDialog()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.confirmDialog(() => {
        actionExecuted = true
      })
    })

    expect(actionExecuted).toBe(true)
    expect(result.current.isOpen).toBe(false)
  })

  it('maintains stable function references', () => {
    const { result, rerender } = renderHook(() => useConfirmDialog())

    const initialOpenDialog = result.current.openDialog
    const initialCloseDialog = result.current.closeDialog
    const initialConfirmDialog = result.current.confirmDialog

    rerender()

    expect(result.current.openDialog).toBe(initialOpenDialog)
    expect(result.current.closeDialog).toBe(initialCloseDialog)
    expect(result.current.confirmDialog).toBe(initialConfirmDialog)
  })
})
