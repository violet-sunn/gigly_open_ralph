'use client'

import { useEffect, useRef } from 'react'
import GigFilters from './components/GigFilters'

export default function GigBrowseClient() {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleSlashKey = (e: KeyboardEvent) => {
      // Don't activate if already in a text input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleSlashKey)
    return () => document.removeEventListener('keydown', handleSlashKey)
  }, [])

  return <GigFilters ref={searchInputRef} />
}
